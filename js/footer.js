// footer.js

// 1. Render the footer HTML
document.write(`
<footer class="site-footer">
    <div class="footer-content">
        <div class="footer-links">
            <a href="sifrutzola.html">ספרות זולה</a>
            <span class="footer-sep">|</span>
            <a href="policy.html">תקנון האתר</a>
        </div>
        <div class="footer-text">
            © ספרות זולה | כל הזכויות שמורות
        </div>
    </div>
</footer>
`);

// 2. Dynamically add the Enable Accessibility script
var enableScript = document.createElement('script');
enableScript.src = "https://cdn.enable.co.il/licenses/enable-L54576n9sqzi9jeh-0326-80874/init.js";
enableScript.defer = true;  // optional: ensures it runs after parsing
document.body.appendChild(enableScript);
