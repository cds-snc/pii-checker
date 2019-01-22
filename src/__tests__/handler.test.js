import { handle } from "../payloadHandler";
import { webhook } from "../__mocks__/deploymentWebhook";
import { createIssue } from "../lib/issues";
import { loadFromFirestore, saveToFirestore } from "../lib/firestore";
import { requestScan } from "../lib/requestScan";

jest.mock("../lib/firestore", () => ({
  loadFromFirestore: jest.fn((repoName, environment) => {
    return { repo: "", issue: false, timestamp: null };
  }),
  saveToFirestore: jest.fn(payload => {
    return true;
  })
}));

jest.mock("../lib/requestScan", () => ({
  requestScan: jest.fn(url => {
    if (url === "fail_url") {
      return false;
    } else {
      return true;
    }
  })
}));

jest.mock("../lib/issues", () => ({
  createIssue: jest.fn((body, issue) => {
    return true;
  })
}));

describe("handle", () => {
  it("returns a passed message if the check passes", async () => {
    const event = await webhook;
    const result = await handle(event);
    expect(requestScan).toHaveBeenCalledTimes(1);
    expect(loadFromFirestore).toHaveBeenCalledTimes(1);
    expect(result).toMatch(/passed/);
  });

  it("returns a passed message if the check fails", async () => {
    const event = await webhook;
    let copy = { ...event };
    copy.body.deployment.payload.web_url = "fail_url";
    const result = await handle(copy);
    expect(createIssue).toHaveBeenCalledTimes(1);
    expect(requestScan).toHaveBeenCalledTimes(1);
    expect(loadFromFirestore).toHaveBeenCalledTimes(1);
    expect(saveToFirestore).toHaveBeenCalledTimes(1);
    expect(result).toMatch(/failed/);
  });
});
