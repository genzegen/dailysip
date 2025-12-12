from rest_framework.decorators import api_view, parser_classes, permission_classes, authentication_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from rest_framework.authentication import SessionAuthentication

from django.db.models import Q, Sum, Value
from django.db.models.functions import Coalesce
from django.db.models import DecimalField

from django.utils import timezone

from .models import *
from .serializers import *

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        # Disable CSRF checks for these API views (we rely on session auth only)
        return

@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def admin_order_list(request):
    """Return list of all orders for admin dashboard."""
    orders = Order.objects.select_related('user').prefetch_related('items__product').order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def user_order_list(request):
    """Return list of orders for the authenticated customer user."""
    orders = (
        Order.objects.filter(user=request.user)
        .prefetch_related('items__product')
        .order_by('-created_at')
    )
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def admin_dashboard_stats(request):
    """Return minimal sales and product stats for the admin dashboard."""
    # Orders stats
    total_orders = Order.objects.count()
    total_revenue = Order.objects.filter(status=Order.STATUS_COMPLETE).aggregate(
        total=Coalesce(
            Sum('total_amount'),
            Value(0, output_field=DecimalField(max_digits=10, decimal_places=2)),
        )
    )['total']

    today = timezone.now().date()
    today_orders = Order.objects.filter(created_at__date=today).count()

    # Product stats
    total_products = Product.objects.count()
    low_stock_products = Product.objects.filter(quantity__lt=5, quantity__gt=0).count()
    out_of_stock_products = Product.objects.filter(quantity__lte=0).count()

    data = {
        "total_orders": total_orders,
        "total_revenue": float(total_revenue or 0),
        "today_orders": today_orders,
        "total_products": total_products,
        "low_stock_products": low_stock_products,
        "out_of_stock_products": out_of_stock_products,
    }

    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_product(request):
    if not request.user.is_staff:
        return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

    # Convert request.data into a normal dict (NO deepcopy!)
    data = request.data.dict()

    # Fix tags (convert list → string)
    if "tags" in request.data:
        tags = request.data.getlist("tags")
        data["tags"] = ",".join(tags)

    # Extract images BEFORE serializer
    images = request.FILES.getlist("images")

    # Create product (without images)
    serializer = ProductSerializer(data=data)
    if serializer.is_valid():
        product = serializer.save()

        # Save images manually
        for img in images:
            ProductImage.objects.create(product=product, image=img)

        # Build final response
        response = ProductSerializer(product).data
        response["final_price"] = float(product.price) - float(product.discount or 0)
        response["tags"] = product.tags.split(",") if product.tags else []

        return Response(response, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def product_list(request):
    # Base queryset with popularity (how many units are currently in carts)
    products = Product.objects.all().annotate(
        popularity=Coalesce(Sum('cartitem__quantity'), 0)
    )

    # Search
    search = request.GET.get("search")
    if search:
        products = products.filter(
            Q(name__icontains=search) |
            Q(description__icontains=search) |
            Q(tags__icontains=search)
        )

    tag = request.GET.get("tag")
    if tag:
        products = products.filter(tags__icontains=tag)

    min_price = request.GET.get("min_price")
    max_price = request.GET.get("max_price")

    if min_price:
        products = products.filter(price__gte=min_price)
    if max_price:
        products = products.filter(price__lte=max_price)

    # Order by popularity first (relevance), then newest
    products = products.order_by('-popularity', '-id')

    serializer = ProductSerializer(products, many=True)

    response = serializer.data
    for obj, item in zip(products, response):
        original_price = float(item["price"])
        discount = float(item.get("discount") or 0)
        item["final_price"] = original_price - discount

        # Tag list output
        item["tags"] = item["tags"].split(",") if item["tags"] else []

        # Stock helper flags for frontend (list view)
        item["low_stock"] = obj.quantity < 5 and obj.quantity > 0
        item["out_of_stock"] = obj.quantity == 0

    return Response(response, status=status.HTTP_200_OK)

@api_view(['GET'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    serializer = ProductSerializer(product)
    data = serializer.data

    data["final_price"] = float(product.price) - float(product.discount or 0)
    data["tags"] = product.tags.split(",") if product.tags else []

    data["low_stock"] = product.quantity < 5

    return Response(data)

@api_view(['PUT', 'PATCH'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_product(request, pk):
    if not request.user.is_staff:
        return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    data = request.data.copy()

    if "tags" in data and isinstance(data.get("tags"), list):
        data["tags"] = ",".join(data.get("tags"))

    serializer = ProductSerializer(product, data=data, partial=True)
    if serializer.is_valid():
        updated_product = serializer.save()

        # Add new images if uploaded
        images = request.FILES.getlist("images")
        for img in images:
            ProductImage.objects.create(product=updated_product, image=img)

        # Prepare response
        response = serializer.data
        response["final_price"] = float(updated_product.price) - float(updated_product.discount or 0)
        response["tags"] = updated_product.tags.split(",") if updated_product.tags else []
        response["low_stock"] = updated_product.quantity < 5
        response["images"] = [i.image.url for i in updated_product.images.all()]

        return Response(response)

    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def delete_product(request, pk):
    if not request.user.is_staff:
        return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

    print("Delete request received for product ID:", pk)

    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    product.delete()
    return Response({"message": "Product deleted"}, status=204)

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        # Disable CSRF checks for these API views (we rely on session auth only)
        return

@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def cart_detail(request):
    """Return the authenticated user's cart."""
    cart, _ = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def cart_update_location(request):
    """Update the delivery_location for the authenticated user's cart."""
    cart, _ = Cart.objects.get_or_create(user=request.user)
    location = request.data.get("delivery_location", "")
    cart.delivery_location = location
    cart.save()
    serializer = CartSerializer(cart, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def cart_add(request):
    """Add or update an item in the authenticated user's cart."""
    cart, _ = Cart.objects.get_or_create(user=request.user)
    product_id = request.data.get('product')
    quantity = int(request.data.get('quantity', 1))

    if not product_id:
        return Response({"detail": "Product is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    # Positive quantity means adding to cart (reserving stock)
    if quantity > 0:
        # Ensure we don't reserve more than available stock
        reserve_qty = min(quantity, product.quantity)
        if reserve_qty <= 0:
            return Response({"detail": "Not enough stock available."}, status=status.HTTP_400_BAD_REQUEST)

        if created:
            item.quantity = reserve_qty
        else:
            item.quantity += reserve_qty

        product.quantity -= reserve_qty
        product.save()
        item.save()

    # Negative quantity means decreasing cart quantity (returning stock)
    elif quantity < 0:
        reduce_by = min(-quantity, item.quantity)

        # Nothing to reduce
        if reduce_by <= 0:
            serializer = CartSerializer(cart, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        item.quantity -= reduce_by
        product.quantity += reduce_by
        product.save()

        if item.quantity <= 0:
            item.delete()
        else:
            item.save()

    # If quantity == 0, no-op

    serializer = CartSerializer(cart, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def cart_remove(request, pk):
    """Remove a product from the authenticated user's cart by product id."""
    cart, _ = Cart.objects.get_or_create(user=request.user)
    try:
        item = CartItem.objects.get(cart=cart, product_id=pk)

        # When removing completely, restore the reserved stock
        product = item.product
        product.quantity += item.quantity
        product.save()

        item.delete()
    except CartItem.DoesNotExist:
        return Response({"detail": "Item not found in cart."}, status=status.HTTP_404_NOT_FOUND)

    serializer = CartSerializer(cart, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)