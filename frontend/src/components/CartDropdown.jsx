import React, { useEffect, useState, useRef } from "react";
import CryptoJS from "crypto-js";
import '../styles/CartDropdown.css';

export default function CartDropdown({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [savingLocation, setSavingLocation] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/products/cart/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
        setDeliveryLocation(data.delivery_location || "");
      } else {
        console.log("Failed to fetch cart, maybe not logged in");
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    try {
      setSavingLocation(true);
      const res = await fetch("http://localhost:8000/api/products/cart/location/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ delivery_location: deliveryLocation }),
      });

      if (!res.ok) {
        console.error("Failed to save delivery location");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingLocation(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchCart();
  }, [isOpen]);

  const updateQuantity = async (productId, delta) => {
    try {
      await fetch("http://localhost:8000/api/products/cart/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ product: productId, quantity: delta }),
      });

      setCartItems(prev => prev.map(item => {
        if (item.product === productId) {
          const nextQty = item.quantity + delta;
          return { ...item, quantity: nextQty < 1 ? 1 : nextQty };
        }
        return item;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await fetch(`http://localhost:8000/api/products/cart/remove/${productId}/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      setCartItems(prev => prev.filter(item => item.product !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const handleInnerClick = (e) => {
    e.stopPropagation();
  };

  const handleDecreaseClick = (item) => {
    if (item.quantity > 1) {
      const ok = window.confirm("Reduce quantity by 1?");
      if (ok) updateQuantity(item.product, -1);
    }
  };

  const handleRemoveClick = (item) => {
    const ok = window.confirm("Remove this item from your cart?");
    if (ok) removeItem(item.product);
  };

  const handleEsewaCheckout = () => {
    if (cartItems.length === 0) return;

    const subtotalNumber = cartItems
      .reduce((acc, item) => acc + Number(item.product_price) * item.quantity, 0);
    // eSewa examples use integer amounts (no decimals). Use rounded integer string.
    const totalAmount = Math.round(subtotalNumber);
    const totalAmountStr = String(totalAmount);

    // eSewa ePay integration (UAT environment)
    // Per docs: https://rc-epay.esewa.com.np/api/epay/main/v2/form
    const esewaUrl = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    // Merchant product code from eSewa (test)
    const productCode = "EPAYTEST";

    // Unique transaction UUID for this order
    const transactionUuid = `DSIP-${Date.now()}`;

    const form = document.createElement("form");
    form.method = "POST";
    form.action = esewaUrl;

    const addField = (name, value) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    // Required fields as per latest eSewa ePay docs (UAT)
    addField("amount", totalAmountStr);            // product amount
    addField("tax_amount", "0");                  // tax amount
    addField("total_amount", totalAmountStr);      // total = amount + tax + charges
    addField("transaction_uuid", transactionUuid);
    addField("product_code", productCode);
    addField("product_service_charge", "0");      // service charge
    addField("product_delivery_charge", "0");     // delivery charge

    // Success and failure URLs (adjust to match your frontend routes)
    addField("success_url", "http://localhost:5173/payment/success");
    addField("failure_url", "http://localhost:5173/payment/failure");

    // Fields used for generating signature (HMAC SHA256)
    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    addField("signed_field_names", signedFieldNames);

    // UAT secret key from eSewa docs - verify this is exactly correct
    const secretKey = "8gBm/:&EnhH.1/q";

    // Build the exact string to sign (no spaces after commas)
    const stringToSign = `total_amount=${totalAmountStr},transaction_uuid=${transactionUuid},product_code=${productCode}`;

    // Debug: log what we're signing
    console.log("String to sign:", stringToSign);
    console.log("Secret key:", secretKey);

    // Generate HMAC-SHA256 and encode as Base64
    const hash = CryptoJS.HmacSHA256(stringToSign, secretKey);
    const signature = CryptoJS.enc.Base64.stringify(hash);
    
    console.log("Generated signature:", signature);

    addField("signature", signature);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <div className="cart-dropdown" ref={dropdownRef} onClick={handleInnerClick}>
      <div className="cart-header">
        <h3>Your Cart</h3>
        <button onClick={onClose}>✕</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <>
          <div className="cart-items">
            {cartItems.length === 0 ? <p className="cart-empty">No items in cart</p> : (
              cartItems.map(item => {
                const lineTotal = Number(item.product_price) * item.quantity;
                return (
                  <div className="cart-item" key={item.id}>
                    <img src={item.product_image} alt={item.product_name} />
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.product_name}</p>

                      <div className="cart-item-row">
                        <div className="cart-qty-controls">
                          <button
                            className="cart-qty-btn"
                            onClick={() => handleDecreaseClick(item)}
                          >
                            -
                          </button>
                          <span className="cart-qty-value">{item.quantity}</span>
                        </div>

                        <div className="cart-item-right">
                          <span className="cart-price">Rs. {lineTotal.toFixed(2)}</span>
                          <button
                            className="cart-remove-btn"
                            onClick={() => handleRemoveClick(item)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="cart-footer">
              <div className="cart-location">
                <label className="cart-location-label">Delivery location</label>
                <textarea
                  className="cart-location-input"
                  rows={2}
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="Enter delivery address / location"
                />
                <button
                  className="cart-location-save-btn"
                  onClick={handleSaveLocation}
                  disabled={savingLocation}
                >
                  {savingLocation ? "Saving..." : "Save location"}
                </button>
              </div>

              <div className="cart-subtotal">
                <span className="cart-subtotal-label">Subtotal</span>
                <span className="cart-subtotal-amount">
                  Rs. {cartItems
                    .reduce((acc, item) => acc + Number(item.product_price) * item.quantity, 0)
                    .toFixed(2)}
                </span>
              </div>

              <button className="checkout-btn" onClick={handleEsewaCheckout}>Checkout</button>
              <button className="view-cart-btn">View Cart</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}