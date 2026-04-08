
// Dynamically add the Enable Accessibility script
document.addEventListener("DOMContentLoaded", function () {
    var enableScript = document.createElement('script');
    enableScript.src = "https://cdn.enable.co.il/licenses/enable-L54576n9sqzi9jeh-0326-80874/init.js";
    enableScript.defer = true;
    document.body.appendChild(enableScript);
});