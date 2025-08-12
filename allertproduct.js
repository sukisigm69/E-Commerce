document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count on page load
    updateCartCount();
    
    // Set up event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Color selection visuals
    document.addEventListener('change', function(e) {
        if (e.target.name === 'color-choice') {
            // Remove ring from all color options
            document.querySelectorAll('input[name="color-choice"]').forEach(input => {
                const span = input.nextElementSibling;
                span.classList.remove('ring-2', 'ring-indigo-500');
            });
            
            // Add ring to selected color
            const selectedSpan = e.target.nextElementSibling;
            selectedSpan.classList.add('ring-2', 'ring-indigo-500');
        }
        
        if (e.target.name === 'size-choice') {
            // Remove selection styling from all size options
            document.querySelectorAll('input[name="size-choice"]:not(:disabled)').forEach(input => {
                const label = input.closest('label');
                label.classList.remove('bg-indigo-50', 'border-indigo-500');
                label.classList.add('bg-white');
            });
            
            // Add selection styling to selected size
            const selectedLabel = e.target.closest('label');
            selectedLabel.classList.add('bg-indigo-50', 'border-indigo-500');
            selectedLabel.classList.remove('bg-white');
        }
    });

    // Add to cart button
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            // Get product data
            const productData = JSON.parse(this.getAttribute('data-product'));
            
            // Get selected options
            const selectedSize = document.querySelector('input[name="size-choice"]:checked')?.value;
            const selectedColor = document.querySelector('input[name="color-choice"]:checked')?.value;
            
            // Validate selections
            if (!selectedSize) {
                showNotification('Please select a size', 'error');
                return;
            }
            
            if (!selectedColor) {
                showNotification('Please select a color', 'error');
                return;
            }
            
            // Create product object
            const product = {
                ...productData,
                size: selectedSize,
                color: selectedColor,
                quantity: 1
            };
            
            // Add to cart and update UI
            addToCart(product);
            updateCartCount();
            showNotification('Product added to cart!', 'success');
        });
    }
}

function addToCart(product) {
    let cart = getCartFromStorage();
    
    // Check if product already exists in cart
    const existingIndex = cart.findIndex(
        item => item.id === product.id && 
                item.size === product.size && 
                item.color === product.color
    );
    
    if (existingIndex >= 0) {
        // Increment quantity if exists
        cart[existingIndex].quantity += 1;
    } else {
        // Add new product
        cart.push(product);
    }
    
    // Save to storage
    saveCartToStorage(cart);
}

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
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

function updateCartCount() {
    const cart = getCartFromStorage();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notification.textContent = message;
    notification.style.transform = 'translateX(200%)';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Animate out after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(200%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}