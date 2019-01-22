// import { requestScan } from "../../lib/requestScan";
import {
  RequestInterceptor,
  RequestSpy,
  ResponseFaker
} from "puppeteer-request-spy";

const matcher = (testee, keyword) => {
  console.log("testee", testee, "keyword", keyword);
  return testee.indexOf(keyword) > -1;
};

let requestInterceptor = "";

describe("getFile", () => {
  beforeEach(async () => {
    requestInterceptor = new RequestInterceptor(matcher);
  });

  it("can find ga", async () => {
    let imageSpy = new RequestSpy("/img/cds/");
    requestInterceptor.addSpy(imageSpy);

    const htmlResponseFaker = new ResponseFaker("https://digital.canada.ca", {
      status: 200,
      contentType: "text/html",
      body: "<div>some static html <img src='/img/cds/test.jpg'></div>"
    });
    requestInterceptor.addFaker(htmlResponseFaker);

    page.setRequestInterception(true);
    page.on("request", requestInterceptor.intercept.bind(requestInterceptor));

    await page.goto("https://digital.canada.ca");

    const result = imageSpy.hasMatch() && imageSpy.getMatchCount() > 0;
    console.log("count", imageSpy.getMatchCount());
    expect(result).toEqual(true);
  });
});
