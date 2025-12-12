from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
import requests
from products.models import Cart, Order, OrderItem


@api_view(['GET'])
def landing_page(request):
    return JsonResponse({"message": "This is landing page view!"})


@api_view(['GET'])
def esewa_verify(request):
    """Verify eSewa transaction using transaction status API.

    Expects:
      - pid: transaction_uuid we sent to eSewa (our pid)
      - amt: total_amount

    Uses the UAT status URL:
      https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code=EPAYTEST&total_amount=100&transaction_uuid=123
    """
    pid = request.GET.get('pid')
    amt = request.GET.get('amt')

    if not (pid and amt):
        return Response({"detail": "Missing required parameters."}, status=400)

    # TODO: move these to settings or env vars
    product_code = "EPAYTEST"

    # IMPORTANT: Use rc-epay (with hyphen), not rc.esewa
    status_url = "https://rc-epay.esewa.com.np/api/epay/transaction/status/"

    params = {
        "product_code": product_code,
        "total_amount": amt,
        "transaction_uuid": pid,
    }

    print(f"Verifying eSewa payment with params: {params}")

    try:
        resp = requests.get(status_url, params=params, timeout=10)
        print(f"eSewa status response: {resp.status_code} - {resp.text}")
        
        data = resp.json()
    except ValueError:
        # Not JSON or unexpected body
        return Response({
            "detail": "Unexpected response from eSewa.", 
            "raw": resp.text
        }, status=502)
    except Exception as exc:
        return Response({
            "detail": f"Error contacting eSewa: {exc}"
        }, status=502)

    status_value = data.get("status")

    if status_value == "COMPLETE":
        # Create an Order from the authenticated user's cart, then clear the cart.
        if request.user.is_authenticated:
            try:
                cart = Cart.objects.get(user=request.user)
            except Cart.DoesNotExist:
                cart = None

            if cart and cart.items.exists():
                # Compute total from cart snapshot
                total_amount = sum(
                    item.product.price * item.quantity for item in cart.items.select_related("product")
                )

                # Create Order for the cart owner (customer)
                order = Order.objects.create(
                    user=cart.user,
                    total_amount=total_amount,
                    status=Order.STATUS_COMPLETE,
                    payment_method="eSewa",
                    transaction_uuid=pid,
                    esewa_ref_id=data.get("ref_id"),
                    delivery_location=cart.delivery_location,
                )

                # Create OrderItems (snapshot of product data)
                for cart_item in cart.items.select_related("product"):
                    OrderItem.objects.create(
                        order=order,
                        product=cart_item.product,
                        product_name=cart_item.product.name,
                        price=cart_item.product.price,
                        quantity=cart_item.quantity,
                    )

                # Clear cart items but do NOT touch product.quantity again
                cart.items.all().delete()

        return Response({
            "status": "success", 
            "message": "Payment verified with eSewa.", 
            "data": data
        })

    return Response({
        "status": "failed", 
        "detail": "Payment not verified with eSewa.", 
        "data": data
    }, status=400)