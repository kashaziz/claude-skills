const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const screenshotsDir = path.join(__dirname, 'screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function captureScreenshots() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set viewport to iPhone 14 Pro dimensions
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 3
  });

  try {
    console.log('Navigating to app...');
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });

    // Wait a bit for any animations
    await wait(1000);

    // Screenshot 1: Homepage
    console.log('Capturing homepage...');
    await page.screenshot({
      path: path.join(screenshotsDir, 'manual-search-01-homepage.png'),
      fullPage: false
    });

    // Navigate to E-codes Database page
    console.log('Navigating to database page...');
    await page.goto('http://localhost:8080/ecodes-database', { waitUntil: 'networkidle0' });
    await wait(1000);

    // Close the voice search banner to get more screen space
    try {
      console.log('Closing voice search banner...');
      const closeButton = await page.$('button[aria-label="Dismiss banner"]');
      if (closeButton) {
        await closeButton.click();
        await wait(500);
        console.log('Voice banner closed successfully');
      }
    } catch (err) {
      console.log('Could not close voice banner, continuing...');
    }

    // Screenshot 2: Database page - empty state (with voice banner closed)
    console.log('Capturing database page (empty)...');
    await page.screenshot({
      path: path.join(screenshotsDir, 'manual-search-02-empty.png'),
      fullPage: false
    });

    // Search for HALAL E-code (E100 - Curcumin)
    console.log('Searching for halal E-code (E100)...');
    const searchInput = await page.waitForSelector('input[type="text"], input[placeholder*="Search"], input[placeholder*="E-code"]', { timeout: 5000 });
    await searchInput.click();
    await wait(500);

    // Screenshot 3: Search input focused
    console.log('Capturing search input focused...');
    await page.screenshot({
      path: path.join(screenshotsDir, 'manual-search-03-focused.png'),
      fullPage: false
    });

    // Type E100
    await searchInput.type('E100', { delay: 100 });
    await wait(1000);

    // Screenshot 4: Typing E100
    console.log('Capturing typing E100...');
    await page.screenshot({
      path: path.join(screenshotsDir, 'manual-search-04-typing-halal.png'),
      fullPage: false
    });

    // Wait for results to appear
    await wait(1500);

    // Screenshot 5: Halal results
    console.log('Capturing halal results...');
    await page.screenshot({
      path: path.join(screenshotsDir, 'manual-search-05-halal-results.png'),
      fullPage: false
    });

    // Try to click on E100 if available to see detail page
    try {
      const e100Link = await page.$('a[href*="E100"]');
      if (e100Link) {
        console.log('Clicking E100 for detail page...');
        await e100Link.click();
        await wait(1500);

        // Screenshot 6: Halal detail page
        console.log('Capturing halal detail page...');
        await page.screenshot({
          path: path.join(screenshotsDir, 'manual-search-06-halal-detail.png'),
          fullPage: false
        });

        // Go back to database
        await page.goBack();
        await wait(1000);
      }
    } catch (err) {
      console.log('Could not navigate to E100 detail, continuing...');
    }

    // Clear search and search for HARAM E-code (E120 - Cochineal)
    console.log('Clearing search and searching for haram E-code (E120)...');
    const searchInput2 = await page.waitForSelector('input[type="text"], input[placeholder*="Search"], input[placeholder*="E-code"]', { timeout: 5000 });
    await searchInput2.click({ clickCount: 3 }); // Select all
    await page.keyboard.press('Backspace');
    await wait(500);

    // Screenshot 7: Search cleared
    console.log('Capturing search cleared...');
    await page.screenshot({
      path: path.join(screenshotsDir, 'manual-search-07-cleared.png'),
      fullPage: false
    });

    // Type E120
    await searchInput2.type('E120', { delay: 100 });
    await wait(1000);

    // Screenshot 8: Typing E120
    console.log('Capturing typing E120...');
    await page.screenshot({
      path: path.join(screenshotsDir, 'manual-search-08-typing-haram.png'),
      fullPage: false
    });

    // Wait for results to appear
    await wait(1500);

    // Screenshot 9: Haram results
    console.log('Capturing haram results...');
    await page.screenshot({
      path: path.join(screenshotsDir, 'manual-search-09-haram-results.png'),
      fullPage: false
    });

    // Try to click on E120 if available to see detail page
    try {
      const e120Link = await page.$('a[href*="E120"]');
      if (e120Link) {
        console.log('Clicking E120 for detail page...');
        await e120Link.click();
        await wait(1500);

        // Screenshot 10: Haram detail page
        console.log('Capturing haram detail page...');
        await page.screenshot({
          path: path.join(screenshotsDir, 'manual-search-10-haram-detail.png'),
          fullPage: false
        });
      }
    } catch (err) {
      console.log('Could not navigate to E120 detail, continuing...');
    }

    // Search for MUSHBOOH E-code (E471 - Mono- and diglycerides)
    console.log('Navigating back to database...');
    await page.goto('http://localhost:8080/ecodes-database', { waitUntil: 'networkidle0' });
    await wait(1000);

    const searchInput3 = await page.waitForSelector('input[type="text"], input[placeholder*="Search"], input[placeholder*="E-code"]', { timeout: 5000 });
    await searchInput3.click();
    await searchInput3.type('E471', { delay: 100 });
    await wait(1500);

    // Screenshot 11: Mushbooh results
    console.log('Capturing mushbooh results...');
    await page.screenshot({
      path: path.join(screenshotsDir, 'manual-search-11-mushbooh-results.png'),
      fullPage: false
    });

    console.log('\n✅ All screenshots captured successfully!');
    console.log(`📁 Saved to: ${screenshotsDir}`);

  } catch (error) {
    console.error('Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
}

captureScreenshots();
