// ============================================
// PRODUCT DATABASE
// ============================================
const products = [
    { id: 1, name: "🍫 Chocolate Truffle Cake", price: 549, icon: "fa-cake-candles" },
    { id: 2, name: "🥐 Almond Butter Croissant", price: 149, icon: "fa-croissant" },
    { id: 3, name: "🍪 Dark Chocolate Cookies", price: 229, icon: "fa-cookie" },
    { id: 4, name: "🫐 Blueberry Cheesecake", price: 459, icon: "fa-cheese" },
    { id: 5, name: "❤️ Red Velvet Dream", price: 599, icon: "fa-cake" },
    { id: 6, name: "🥖 Rustic Garlic Bread", price: 119, icon: "fa-bread-slice" }
];

// ============================================
// CART STATE
// ============================================
let cart = [];

// ============================================
// LOAD CART FROM LOCAL STORAGE (Database)
// ============================================
function loadCart() {
    const savedCart = localStorage.getItem('bloomBakeryCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        renderCart();
    }
}

// ============================================
// SAVE CART TO LOCAL STORAGE
// ============================================
function saveCart() {
    localStorage.setItem('bloomBakeryCart', JSON.stringify(cart));
}

// ============================================
// RENDER PRODUCTS
// ============================================
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-icon">
                <i class="fas ${product.icon}"></i>
            </div>
            <h3>${product.name}</h3>
            <div class="product-price">₹${product.price}</div>
            <button class="btn-add" onclick="addToCart(${product.id})">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
        </div>
    `).join('');
}

// ============================================
// ADD TO CART
// ============================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price
        });
        renderCart();
        saveCart();
        showNotification(`${product.name} added to your basket! 🎉`, 'success');
    }
}

// ============================================
// REMOVE FROM CART
// ============================================
function removeFromCart(index) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    renderCart();
    saveCart();
    showNotification(`${removedItem.name} removed from basket`, 'info');
}

// ============================================
// RENDER CART UI
// ============================================
function renderCart() {
    const cartList = document.getElementById('cartList');
    const totalSpan = document.getElementById('totalAmount');
    
    if (!cartList) return;
    
    if (cart.length === 0) {
        cartList.innerHTML = `
            <li class="empty-cart-message">
                <i class="fas fa-heart"></i>
                Your basket is empty
                <i class="fas fa-heart"></i>
            </li>
        `;
        totalSpan.innerText = '0';
        return;
    }
    
    let total = 0;
    cartList.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <li>
                <span><i class="fas fa-candy-cane"></i> ${item.name} - ₹${item.price}</span>
                <button class="remove-item" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash-alt"></i> Remove
                </button>
            </li>
        `;
    }).join('');
    
    totalSpan.innerText = total;
}

// ============================================
// PLACE ORDER (Save to Database)
// ============================================
function placeOrder() {
    if (cart.length === 0) {
        showNotification('❌ Your basket is empty! Add some treats first.', 'error');
        return false;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const order = {
        orderId: 'BLOOM-' + Date.now(),
        items: [...cart],
        total: total,
        date: new Date().toLocaleString(),
        status: 'Confirmed'
    };
    
    // Save to localStorage Database
    let orders = localStorage.getItem('bloomOrders');
    let ordersArray = orders ? JSON.parse(orders) : [];
    ordersArray.push(order);
    localStorage.setItem('bloomOrders', JSON.stringify(ordersArray));
    
    showNotification(`✅ Order placed! Order ID: ${order.orderId}\nTotal: ₹${total}`, 'success');
    
    // Clear cart
    cart = [];
    renderCart();
    saveCart();
    
    // Log database info
    console.log('📦 Orders Database:', ordersArray);
    return true;
}

// ============================================
// CONTACT FORM VALIDATION & STORAGE
// ============================================
function submitContact() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    
    // Validation
    if (name === '') {
        showNotification('⚠️ Please enter your name', 'error');
        return false;
    }
    
    if (email === '') {
        showNotification('⚠️ Please enter your email', 'error');
        return false;
    }
    
    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showNotification('📧 Please enter a valid email address', 'error');
        return false;
    }
    
    if (message === '') {
        showNotification('💬 Please write your message', 'error');
        return false;
    }
    
    // Save to localStorage Database
    const contactData = {
        name: name,
        email: email,
        message: message,
        date: new Date().toLocaleString()
    };
    
    let contacts = localStorage.getItem('bloomContacts');
    let contactsArray = contacts ? JSON.parse(contacts) : [];
    contactsArray.push(contactData);
    localStorage.setItem('bloomContacts', JSON.stringify(contactsArray));
    
    showNotification(`✨ Thank you ${name}! Your message has been sent.`, 'success');
    
    // Clear form
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactMessage').value = '';
    
    console.log('📧 Contacts Database:', contactsArray);
    return true;
}

// ============================================
// NOTIFICATION SYSTEM (Toast)
// ============================================
function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.innerHTML = message.replace(/\n/g, '<br>');
    
    let bgColor = '#d4837a';
    if (type === 'error') bgColor = '#c96f65';
    if (type === 'info') bgColor = '#e08a7a';
    if (type === 'success') bgColor = '#2e7d32';
    
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: ${bgColor};
        color: white;
        padding: 14px 28px;
        border-radius: 50px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        font-size: 0.9rem;
        text-align: center;
        max-width: 90%;
        animation: slideUp 0.3s ease;
        font-family: 'Poppins', sans-serif;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ============================================
// SCROLL TO PRODUCTS
// ============================================
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// INITIALIZE PAGE
// ============================================
function init() {
    renderProducts();
    loadCart();
    
    // Attach event listeners
    const orderBtn = document.getElementById('placeOrderBtn');
    if (orderBtn) {
        orderBtn.addEventListener('click', placeOrder);
    }
    
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', submitContact);
    }
    
    // Handle enter key on contact form
    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                submitContact();
            }
        });
    });
    
    // Log database info
    console.log('🍰 Bloom Bakery Loaded');
    const orders = localStorage.getItem('bloomOrders');
    const contacts = localStorage.getItem('bloomContacts');
    console.log('📦 Orders:', orders ? JSON.parse(orders).length : 0);
    console.log('📧 Messages:', contacts ? JSON.parse(contacts).length : 0);
}

// Add animation keyframes if not present
if (!document.querySelector('#toast-keyframes')) {
    const style = document.createElement('style');
    style.id = 'toast-keyframes';
    style.textContent = `
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Run init when page loads
window.onload = init;