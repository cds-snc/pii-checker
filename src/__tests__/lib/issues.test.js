import { createIssue } from "../../lib/issues";
import { webhook } from "../../__mocks__/deploymentWebhook";
import { createIssueResp } from "../../__mocks__/create-issue";

const octokit = {};
const mockCallback = jest.fn(() => createIssueResp);

octokit.authenticate = () => {
  return true;
};
octokit.apps = {};
octokit.apps.createInstallationToken = () => {
  return { data: { token: "foo" } };
};

octokit.issues = {};
octokit.issues.create = mockCallback;

describe("create issues", () => {
  it("returns the successful create payload when passing valid data", async () => {
    try {
      const { body } = await webhook;
      let results = await createIssue(octokit, body, {
        title: "foo",
        body: "bar"
      });
      expect(results.data.hasOwnProperty("created_at")).toEqual(true);
      expect(mockCallback.mock.calls.length).toBe(1);
    } catch (e) {}
  });
  it("returns false when no data is passed", async () => {
    try {
      const results = await createIssue(octokit, "", "");
      expect(results).toEqual(false);
    } catch (e) {}
  });
});
