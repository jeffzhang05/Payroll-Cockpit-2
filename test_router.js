import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'screenshot_dashboard.png' });
    console.log("Screenshot saved to screenshot_dashboard.png");
    await browser.close();
})();
