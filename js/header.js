document.write(`
<header class="site-header">
    <div class="header-container">

        <div class="logo">
            <a href="index.html">
                <img src="images/logo.png" alt="ספרות זולה"/>
            </a>
        </div>

        <nav class="main-menu">
            <a href="index.html">דף הבית</a>
            <a href="about.html">אודות דוד אור־אל</a>
            <a href="perek.html">לקריאת פרק מהספר</a>
            <a href="news.html">עדכונים וחדשות</a>
            <a href="contact.html">צרו קשר</a>
        </nav>

        <div class="cart-area" id="cart-area" onclick="toggleCart()">
            <img src="images/cart.png" alt="סל קניות" class="cart-icon">
            <span class="cart-label">סל</span>
            <span class="cart-badge" id="cart-count">0</span>
            <span class="secure-badge">
                <img src="images/credit_card.png" alt="תשלום מאובטח" class="payment-icon">
            </span>
        </div>

    </div>
</header>
`);
