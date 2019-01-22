// import { requestScan } from "../../lib/requestScan";
import {
  RequestInterceptor,
  RequestSpy,
  ResponseFaker
} from "puppeteer-request-spy";

import { getFile } from "../../lib/getFile";
import path from "path";

const filePath = (filename = "withGA.html") => {
  return path.resolve(__dirname, `../../__mocks__/${filename}`);
};

const matcher = (testee, keyword) => {
  console.log("testee", testee, "keyword", keyword);
  return testee.indexOf(keyword) > -1;
};

let requestInterceptor = "";

/*
const checkTrackers = async () => {
  console.log("here");
  return new Promise((resolve, reject) => {
    try {
      resolve(`Nice ${window.test}`);
    } catch (e) {
      resolve(" ¯_(ツ)_/¯");
    }
  });
};
*/

describe("getFile", () => {
  beforeEach(async () => {
    requestInterceptor = new RequestInterceptor(matcher, console);
  });

  it("can find ga", async () => {
    const htmPath = filePath();
    const fileResult = await getFile(htmPath);
    const htm = fileResult.toString("utf8");

    let imageSpy = new RequestSpy("/img/cds/");
    requestInterceptor.addSpy(imageSpy);

    const htmlResponseFaker = new ResponseFaker("https://digital.canada.ca", {
      status: 200,
      contentType: "text/html",
      body: htm
    });
    requestInterceptor.addFaker(htmlResponseFaker);

    page.setRequestInterception(true);
    page.on("request", requestInterceptor.intercept.bind(requestInterceptor));

    // const result = await requestScan("https://digital.canada.ca");
    // console.log(result);
    // expect(result).toEqual(true);

    await page.goto("https://digital.canada.ca");

    let content = await page.evaluate(() => {
      return window.test;
      // return document.getElementById("some-id").innerHTML;
    });

    console.log("content", content);

    // const testVar = await page.evaluate(checkTrackers);
    // console.log("TEST VAR ===============", testVar);

    const result = imageSpy.hasMatch() && imageSpy.getMatchCount() > 0;
    console.log("count", imageSpy.getMatchCount());
    expect(result).toEqual(true);
  });
});
