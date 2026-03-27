// Header component with hamburger menu
document.write(`
<nav class="navbar">
    <div class="logo"><img src="images/logo.png" alt="ספרות זולה"></div>

    <!-- Hamburger button for mobile -->
    <button class="hamburger" onclick="toggleMobileMenu()" aria-label="תפריט">
        <span></span>
        <span></span>
        <span></span>
    </button>

    <!-- Desktop menu -->
    <div class="nav-center" id="nav-menu">
        <a href="index.html">דף הבית</a>
        <a href="about.html">אודות דוד אור־אל</a>
        <a href="perek.html">לקריאת פרק מהספר</a>
        <a href="news.html">עדכונים וחדשות</a>
        <a href="contact.html">צרו קשר</a>
    </div>

    <div class="nav-left">
        <span class="secure-badge">
            🔒
            <img src="images/credit_card.png" alt="Visa" class="payment-icon">
        </span>
        
        <div class="cart-area" onclick="toggleCart()" id="cart-area">
            <img src="images/cart.png" alt="סל קניות" class="cart-icon">
            <span class="cart-label">סל</span>
            <span class="cart-badge" id="cart-count">0</span>
        </div>
    </div>
</nav>
`);

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('nav-menu');
    const hamburger = document.querySelector('.hamburger');
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (menu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close mobile menu when clicking a link
document.addEventListener('DOMContentLoaded', function() {
    const menuLinks = document.querySelectorAll('.nav-center a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            const menu = document.getElementById('nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
});
