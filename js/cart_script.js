// ===================== CART & UPAY (גרסה סופית: שמירה קבועה + איסוף עצמי) =====================

let cart = JSON.parse(localStorage.getItem('sifrutzola_cart')) || [];
const DELIVERY_OPTIONS = [
    { id: 'regular', label: 'דואר רגיל', price: 20 },
    { id: 'courier', label: 'משלוח שליחים', price: 50 },
    { id: 'pickup', label: 'איסוף עצמי', price: 0 }
];
let selectedDelivery = 'regular';

// טעינת פרטי לקוח שמורים מהדפדפן (אם קיימים)
let tempCustomerData = JSON.parse(localStorage.getItem('sifrutzola_customer')) || { name: '', email: '', phone: '', address: '' };

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('overlay');
    if (!drawer) return;
    drawer.classList.toggle('open');
    if (overlay) overlay.style.display = drawer.classList.contains('open') ? 'block' : 'none';
}

function addToCart(name, price) {
    cart.push({ id: Date.now(), name, price });
    saveCart();
    updateUI();
}

function addToCartPopup(name, price) {
    addToCart(name, price);
    const popup = document.getElementById('checkout-popup');
    if (popup) popup.style.display = 'flex';
}

function hideCheckoutPopup() {
    const popup = document.getElementById('checkout-popup');
    if (popup) popup.style.display = 'none';
    toggleCart(); 
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateUI();
}

function selectDelivery(id) {
    saveCurrentInputs(); // שמירה לפני החלפת מצב
    selectedDelivery = id;
    updateUI();
}

function saveCart() {
    localStorage.setItem('sifrutzola_cart', JSON.stringify(cart));
}

// פונקציה ששומרת את הנתונים גם במשתנה וגם ב-LocalStorage
function saveCurrentInputs() {
    tempCustomerData.name = document.getElementById('cust-name')?.value || '';
    tempCustomerData.email = document.getElementById('cust-email')?.value || '';
    tempCustomerData.phone = document.getElementById('cust-phone')?.value || '';
    tempCustomerData.address = document.getElementById('cust-address')?.value || '';
    localStorage.setItem('sifrutzola_customer', JSON.stringify(tempCustomerData));
}

function getTotals() {
    let itemsTotal = 0;
    cart.forEach(item => itemsTotal += item.price);
    const deliveryObj = DELIVERY_OPTIONS.find(d => d.id === selectedDelivery) || DELIVERY_OPTIONS[0];
    const deliveryPrice = cart.length > 0 ? deliveryObj.price : 0;
    return { itemsTotal, deliveryPrice, grandTotal: itemsTotal + deliveryPrice };
}

function customerFieldsHTML() {
    if (cart.length === 0) return '';
    const isAddressRequired = selectedDelivery !== 'pickup';
    return `
        <div class="customer-info" style="margin-top:15px; padding:10px; background:#f4f4f4; border-radius:8px;">
            <div style="font-weight:bold; margin-bottom:8px;">פרטים למשלוח וקבלה:</div>
            <input type="text" id="cust-name" placeholder="שם מלא (חובה)" value="${tempCustomerData.name}" oninput="saveCurrentInputs()" style="width:100%; padding:8px; margin-bottom:8px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
            <input type="email" id="cust-email" placeholder="אימייל (חובה)" value="${tempCustomerData.email}" oninput="saveCurrentInputs()" style="width:100%; padding:8px; margin-bottom:8px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
            <input type="tel" id="cust-phone" placeholder="טלפון נייד (חובה)" value="${tempCustomerData.phone}" oninput="saveCurrentInputs()" style="width:100%; padding:8px; margin-bottom:8px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
            ${isAddressRequired ? `<input type="text" id="cust-address" placeholder="כתובת מלאה (עיר, רחוב, בית)" value="${tempCustomerData.address}" oninput="saveCurrentInputs()" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">` : ''}
            <div id="validation-msg" style="color:red; font-size:12px; margin-top:8px; display:none; font-weight:bold;"></div>
        </div>
    `;
}

function validateAndPay() {
    saveCurrentInputs();
    const { grandTotal } = getTotals();
    const { name, email, phone, address } = tempCustomerData;

    if (cart.length === 0 || grandTotal <= 0) { alert("הסל ריק"); return; }
    if (!name || name.length < 2) { showError("נא להזין שם מלא"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError("נא להזין אימייל תקין"); return; }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 9 || cleanPhone.length > 10) { showError("נא להזין טלפון תקין"); return; }
    if (selectedDelivery !== 'pickup' && (!address || address.length < 5)) { showError("נא להזין כתובת מלאה"); return; }

    const BASE_URL = "https://app.upay.co.il";
    const deliveryLabel = DELIVERY_OPTIONS.find(d => d.id === selectedDelivery).label;
    const desc = `ספרות זולה: ${cart.map(i => i.name).join(', ')} | משלוח: ${deliveryLabel} ${address || ''}`;
    window.location.href = `${BASE_URL}&amount=${grandTotal}&contact=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(cleanPhone)}&description=${encodeURIComponent(desc)}`;
}

function showError(msg) {
    const errorEl = document.getElementById('validation-msg');
    if (errorEl) { errorEl.innerText = msg; errorEl.style.display = 'block'; }
}

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
        itemsEl.innerHTML = '<p style="text-align:center; padding:20px; color:#888;">הסל ריק</p>';
        if (totalEl) totalEl.parentElement.style.display = 'flex';
        if (totalEl) totalEl.parentElement.style.justifyContent = 'space-between';
        if (totalEl) totalEl.parentElement.innerHTML = '<span>סכום ההזמנה:</span> <span id="cart-total">₪0</span>';
        if (deliveryEl) deliveryEl.innerHTML = '';
        if (grandTotalEl) grandTotalEl.style.display = 'none';
        if (checkoutBtn) { checkoutBtn.disabled = true; checkoutBtn.style.opacity = "0.5"; }
        return;
    }

    const { itemsTotal, deliveryPrice, grandTotal } = getTotals();

    let html = cart.map(item => `
        <div class="cart-item" style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
            <span>${item.name}</span>
            <span>₪${item.price} <button onclick="removeFromCart(${item.id})" style="color:red; border:none; background:none; cursor:pointer;">×</button></span>
        </div>
    `).join('');

    html += `
        <div style="margin-top:10px; font-size:14px; background:#f9f9f9; padding:10px; border-radius:5px;">
            <strong>אופן קבלת הספר:</strong><br>
            ${DELIVERY_OPTIONS.map(d => `
                <label style="display:flex; justify-content:space-between; align-items:center; margin:5px 0; cursor:pointer;">
                    <span><input type="radio" name="del" onchange="selectDelivery('${d.id}')" ${selectedDelivery === d.id ? 'checked' : ''}> ${d.label}</span>
                    <span>${d.price > 0 ? '₪' + d.price : 'חינם'}</span>
                </label>
            `).join('')}
        </div>
    `;

    html += customerFieldsHTML();
    itemsEl.innerHTML = html;

    if (totalEl) {
        totalEl.parentElement.style.display = 'flex';
        totalEl.parentElement.style.justifyContent = 'space-between';
        totalEl.parentElement.innerHTML = `<span>סכום ההזמנה:</span> <span id="cart-total">₪${itemsTotal}</span>`;
    }
    
    if (deliveryEl) {
        const delObj = DELIVERY_OPTIONS.find(d => d.id === selectedDelivery);
        deliveryEl.style.display = 'flex';
        deliveryEl.style.justifyContent = 'space-between';
        deliveryEl.innerHTML = `<span>משלוח (${delObj.label}):</span> <span>₪${deliveryPrice}</span>`;
    }

    if (grandTotalEl) {
        grandTotalEl.style.display = 'flex';
        grandTotalEl.style.justifyContent = 'space-between';
        grandTotalEl.style.fontWeight = 'bold';
        grandTotalEl.style.borderTop = '2px solid #eee';
        grandTotalEl.style.paddingTop = '10px';
        grandTotalEl.innerHTML = `<span>סה"כ לתשלום:</span> <span>₪${grandTotal}</span>`;
    }

    if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = "1";
        checkoutBtn.onclick = validateAndPay;
    }
}

document.addEventListener('DOMContentLoaded', updateUI);
