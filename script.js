// ===================== CART =====================
// Persistent cart using localStorage
let cart = JSON.parse(localStorage.getItem('sifrutzola_cart')) || [];

// Delivery options
const DELIVERY_OPTIONS = [
    { id: 'regular', label: 'דואר רגיל', price: 20 },
    { id: 'courier',  label: 'משלוח שליחים', price: 50 }
];

// Current selected delivery (default: regular)
let selectedDelivery = 'regular';

// ---- Toggle drawer ----
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('overlay');
    if (!drawer) return;
    drawer.classList.toggle('open');
    overlay.style.display = drawer.classList.contains('open') ? 'block' : 'none';
}

// ---- Add item to cart ----
function addToCart(name, price) {
    cart.push({ id: Date.now(), name, price });
    saveCart();
    updateUI();
    toggleCart();
}

// ---- Remove item from cart ----
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateUI();
}

// ---- Select delivery method ----
function selectDelivery(id) {
    selectedDelivery = id;
    updateUI();
}

// ---- Save to localStorage ----
function saveCart() {
    localStorage.setItem('sifrutzola_cart', JSON.stringify(cart));
}

// ---- Calculate totals ----
function getTotals() {
    let itemsTotal = 0;
    cart.forEach(item => itemsTotal += item.price);
    const deliveryObj = DELIVERY_OPTIONS.find(d => d.id === selectedDelivery) || DELIVERY_OPTIONS[0];
    const deliveryPrice = cart.length > 0 ? deliveryObj.price : 0;
    return { itemsTotal, deliveryPrice, grandTotal: itemsTotal + deliveryPrice };
}

// ---- Render delivery options HTML ----
function deliveryOptionsHTML() {
    if (cart.length === 0) return '';
    return `
        <div class="delivery-section">
            <div class="delivery-label">בחרו את דרך המשלוח:</div>
            <div class="delivery-options">
                ${DELIVERY_OPTIONS.map(d => `
                    <label class="delivery-option ${selectedDelivery === d.id ? 'selected' : ''}" onclick="selectDelivery('${d.id}')">
                        <input type="radio" name="delivery" value="${d.id}" ${selectedDelivery === d.id ? 'checked' : ''}>
                        <span class="delivery-name">${d.label}</span>
                        <span class="delivery-price">₪${d.price}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}

// ---- Render cart item HTML ----
function cartItemHTML(item) {
    return `
        <div class="cart-item">
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">₪${item.price}</span>
            </div>
            <button class="cart-remove-btn" onclick="removeFromCart(${item.id})" title="הסר מהסל">×</button>
        </div>
    `;
}

// ---- Add item + show checkout popup ----
function addToCartPopup(name, price) {
    addToCart(name, price);
    showCheckoutPopup();
}

// ---- Show checkout popup ----
function showCheckoutPopup() {
    const popup = document.getElementById('checkout-popup');
    if (!popup) return;
    popup.style.display = 'flex';
}

// ---- Hide checkout popup ----
function hideCheckoutPopup() {
    const popup = document.getElementById('checkout-popup');
    if (popup) popup.style.display = 'none';
}

// ---- Main UI update ----
function updateUI() {
    const countEl = document.getElementById('cart-count');
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const deliveryEl = document.getElementById('cart-delivery');
    const grandTotalEl = document.getElementById('cart-grand-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (countEl) countEl.innerText = cart.length;

    if (!itemsEl) return;

    if (cart.length === 0) {
        itemsEl.innerHTML = '<p class="cart-empty">הסל ריק</p>';
        if (deliveryEl) deliveryEl.innerHTML = '';
        if (grandTotalEl) grandTotalEl.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (totalEl) totalEl.innerText = '₪0';
        return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    const { itemsTotal, deliveryPrice, grandTotal } = getTotals();

    let html = cart.map(item => cartItemHTML(item)).join('');
    html += deliveryOptionsHTML();

    itemsEl.innerHTML = html;

    if (totalEl) totalEl.innerText = `₪${itemsTotal}`;
    if (deliveryEl) {
        deliveryEl.innerHTML = `
            <div class="delivery-row">
                <span>משלוח (${DELIVERY_OPTIONS.find(d => d.id === selectedDelivery)?.label}):</span>
                <span>₪${deliveryPrice}</span>
            </div>
        `;
    }
    if (grandTotalEl) {
        grandTotalEl.style.display = 'flex';
        grandTotalEl.innerHTML = `<span>סה"כ לתשלום:</span><span>₪${grandTotal}</span>`;
    }
}

// ---- Init on page load ----
document.addEventListener('DOMContentLoaded', updateUI);
