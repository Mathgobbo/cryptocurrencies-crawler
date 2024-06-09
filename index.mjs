import puppeteer from "puppeteer";
import { extractFromCoingecko } from "./coingecko.mjs";

// ========== MAIN FUNCTION ============
const main = async () => {
  const browser = await puppeteer.launch({ headless: false });

  await extractFromCoingecko(browser);

  // TO DO
  // Create a function for each website and get the data

  await browser.close();
};

// Executing the main function
main()
  .then(() => {
    console.log("Successfully executed the crawler!");
    process.exit(0);
  })
  .catch((reason) => {
    console.log(reason);
    process.exit(1);
  });
