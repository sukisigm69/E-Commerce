// ==================== ORDER HISTORY SYSTEM ====================

// Order status constants
const ORDER_STATUS = {
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

// Get orders from localStorage
function getOrdersFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('userOrders')) || [];
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
}

// Save orders to localStorage
function saveOrdersToStorage(orders) {
  try {
    localStorage.setItem('userOrders', JSON.stringify(orders));
    return true;
  } catch (error) {
    console.error('Error saving orders:', error);
    return false;
  }
}

// Create a new order from cart
function createOrderFromCart(cart) {
  const subtotal = calculateSubtotal(cart);
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;
  
  return {
    id: generateOrderId(),
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    status: ORDER_STATUS.PROCESSING,
    subtotal: subtotal,
    tax: tax,
    total: total,
    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      color: item.color,
      size: item.size
    }))
  };
}

// Generate unique order ID
function generateOrderId() {
  return 'ORD-' + Date.now().toString().slice(-8) + Math.floor(1000 + Math.random() * 9000);
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

// ==================== UPDATED CHECKOUT FUNCTION ====================

function handleCheckout() {
  const cart = getCartFromStorage();
  
  if (cart.length === 0) {
    showNotification('Your cart is empty', 'error');
    return;
  }
  
  // Create new order
  const newOrder = createOrderFromCart(cart);
  
  // Save to order history
  const orders = getOrdersFromStorage();
  orders.unshift(newOrder); // Add new order to beginning of array
  
  if (saveOrdersToStorage(orders)) {
    // Clear cart
    saveCartToStorage([]);
    updateCartUI([]);
    
    // Show success notification
    showNotification('Order placed successfully!', 'success');
    
    // Redirect to account page after 1.5 seconds
    setTimeout(() => {
      window.location.href = 'account.html';
    }, 1500);
  } else {
    showNotification('Failed to place order', 'error');
  }
}

// ==================== MODIFIED INITIALIZATION ====================

// Initialize cart
document.addEventListener('DOMContentLoaded', function() {
  const cart = getCartFromStorage();
  updateCartUI(cart);
  
  // Empty cart button
  document.getElementById('empty-cart-btn').addEventListener('click', function() {
    saveCartToStorage([]);
    updateCartUI([]);
    showNotification('Cart has been emptied', 'success');
  });
  
  // Updated checkout button handler
  document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
});

// ==================== REST OF YOUR EXISTING CART CODE ====================
// ... (keep all your existing cart functions as they are)
// Notification system
function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    
    notification.className = `mb-2 px-6 py-3 rounded-md shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } animate-fade-in`;
    
    notification.textContent = message;
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('animate-fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Cart management functions
function getCartFromStorage() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (error) {
        console.error('Error reading cart:', error);
        return [];
    }
}

function saveCartToStorage(cart) {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        // Update cart count in header
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-count').textContent = count;
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

function calculateSubtotal(cart) {
    return cart.reduce((total, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        return total + (price * quantity);
    }, 0);
}

function calculateTax(subtotal) {
    return subtotal * 0.1; // 10% tax
}

function generateCartItemsHTML(cart) {
    return cart.map(item => {
        // Ensure all required fields have fallback values
        const product = {
            id: item.id || 'unknown',
            name: item.name || 'Unknown Product',
            price: item.price ? Number(item.price).toFixed(2) : '0.00',
            image: item.image || 'https://via.placeholder.com/150',
            color: item.color || 'Not specified',
            size: item.size || 'Not specified',
            quantity: item.quantity || 1
        };

        return `
            <div class="p-6 cart-item" data-id="${product.id}" data-size="${product.size}" data-color="${product.color}">
                <div class="flex flex-col sm:flex-row">
                    <div class="flex-shrink-0">
                        <img src="${product.image}" alt="${product.name}" 
                             class="w-full sm:w-32 h-32 object-cover rounded-md border border-gray-200"
                             onerror="this.src='https://via.placeholder.com/150'">
                    </div>
                    
                    <div class="mt-4 sm:mt-0 sm:ml-6 flex-grow">
                        <div class="flex justify-between">
                            <h3 class="text-lg font-medium text-gray-900">${product.name}</h3>
                            <p class="text-lg font-medium text-gray-900 ml-4">$${(product.price * product.quantity).toFixed(2)}</p>
                        </div>
                        
                        <div class="mt-2 text-sm text-gray-500">
                            <p>Color: ${product.color}</p>
                            <p class="mt-1">Size: ${product.size}</p>
                        </div>
                        
                        <div class="mt-4 flex items-center">
                            <div class="flex items-center border border-gray-300 rounded-md">
                                <button class="quantity-decrease px-3 py-1 text-gray-600 hover:bg-gray-100">
                                    -
                                </button>
                                <span class="quantity-value px-3 py-1">${product.quantity}</span>
                                <button class="quantity-increase px-3 py-1 text-gray-600 hover:bg-gray-100">
                                    +
                                </button>
                            </div>
                            
                            <button class="ml-6 text-sm font-medium text-indigo-600 hover:text-indigo-500 remove-item">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateCartUI(cart) {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartElement = document.getElementById('empty-cart');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const emptyCartBtn = document.getElementById('empty-cart-btn');

    if (cart.length === 0) {
        emptyCartElement.classList.remove('hidden');
        cartItemsContainer.classList.add('hidden');
        checkoutBtn.disabled = true;
        emptyCartBtn.disabled = true;
        
        subtotalElement.textContent = '$0.00';
        taxElement.textContent = '$0.00';
        totalElement.textContent = '$0.00';
        return;
    }

    emptyCartElement.classList.add('hidden');
    cartItemsContainer.classList.remove('hidden');
    checkoutBtn.disabled = false;
    emptyCartBtn.disabled = false;

    const subtotal = calculateSubtotal(cart);
    const tax = calculateTax(subtotal);
    const total = subtotal + tax;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;

    cartItemsContainer.innerHTML = generateCartItemsHTML(cart);
    setupCartItemEventListeners();
}

function setupCartItemEventListeners() {
    // Quantity controls
    document.querySelectorAll('.quantity-increase').forEach(button => {
        button.addEventListener('click', function() {
            const itemElement = this.closest('.cart-item');
            updateItemQuantity(itemElement, 1);
        });
    });
    
    document.querySelectorAll('.quantity-decrease').forEach(button => {
        button.addEventListener('click', function() {
            const itemElement = this.closest('.cart-item');
            updateItemQuantity(itemElement, -1);
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemElement = this.closest('.cart-item');
            removeItemFromCart(itemElement);
        });
    });
}

function updateItemQuantity(itemElement, change) {
    const cart = getCartFromStorage();
    const id = itemElement.dataset.id;
    const size = itemElement.dataset.size;
    const color = itemElement.dataset.color;
    
    const itemIndex = cart.findIndex(item => 
        item.id === id && 
        item.size === size && 
        item.color === color
    );
    
    if (itemIndex >= 0) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
            showNotification('Item removed from cart', 'success');
        } else {
            showNotification('Quantity updated', 'success');
        }
        
        saveCartToStorage(cart);
        updateCartUI(cart);
    }
}

function removeItemFromCart(itemElement) {
    const cart = getCartFromStorage();
    const id = itemElement.dataset.id;
    const size = itemElement.dataset.size;
    const color = itemElement.dataset.color;
    
    const updatedCart = cart.filter(item => 
        !(item.id === id && 
        item.size === size && 
        item.color === color)
    );
    
    saveCartToStorage(updatedCart);
    updateCartUI(updatedCart);
    showNotification('Item removed from cart', 'success');
}

// Initialize cart
document.addEventListener('DOMContentLoaded', function() {
    const cart = getCartFromStorage();
    updateCartUI(cart);
    
    // Empty cart button
    document.getElementById('empty-cart-btn').addEventListener('click', function() {
        saveCartToStorage([]);
        updateCartUI([]);
        showNotification('Cart has been emptied', 'success');
    });
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function() {
        alert('Proceeding to checkout!');
        // In a real app: window.location.href = 'checkout.html';
    });
});
// Contoh fungsi yang dipanggil saat checkout berhasil
function processCheckout(cartItems, totalAmount) {
  // Buat objek order baru
  const newOrder = {
    id: generateOrderId(),
    date: new Date().toISOString(),
    status: 'Processing', // atau 'Delivered' jika langsung dikirim
    items: cartItems.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    })),
    total: totalAmount
  };

  // Simpan order ke localStorage
  saveOrder(newOrder);

  // Redirect ke halaman order history atau tampilkan pesan sukses
  window.location.href = 'orderhistory.html';
}

// Fungsi generateOrderId dan saveOrder sama dengan yang di orderHistory.js
// Contoh pemanggilan saat tombol checkout diklik
document.getElementById('checkoutButton').addEventListener('click', function() {
  const cartItems = [
    {
      name: 'Classic Croissant',
      price: 3.50,
      quantity: 2,
      image: 'aset/gambar/product1.jpg'
    },
    {
      name: 'Chocolate Eclair',
      price: 4.25,
      quantity: 1,
      image: 'aset/gambar/product2.jpg'
    }
  ];
  
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  processCheckout(cartItems, totalAmount);
});