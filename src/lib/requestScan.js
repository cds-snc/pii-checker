const puppeteer = require("puppeteer");

const checkTrackers = async () => {
  return new Promise((resolve, reject) => {
    try {
      const trackers = ga.getAll(); // eslint-disable-line no-undef
      const aips = [];
      trackers.forEach(tracker => {
        const aip = tracker.get("anonymizeIp");
        aips.push(aip);
      });
      resolve(aips);
    } catch (e) {
      // todo determine how to handle GA not being setup
      resolve("something happened", e.message);
    }
  });
};

const allTrue = result => {
  if (!Array.isArray(result)) {
    return false;
  }

  if (
    result.every(currentValue => {
      return currentValue === true;
    })
  ) {
    return true;
  }

  return false;
};

export const requestScan = async url => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8"
    });

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36"
    );

    await page.goto(url);
    const result = await page.evaluate(checkTrackers);
    await browser.close();
    return allTrue(result);
  } catch (e) {
    console.log("something happened");
    console.log(e.message);
    return false;
  }
};
