"use strict";
import octokit, { validateDeployment, requestScan, createIssue } from "./lib";
import { webhook } from "./__mocks__/deploymentWebhook";

export const localPayload = async () => {
  const event = await webhook;
  return handle(event);
};

const init = event => {
  const body = validateDeployment(event);
  return body;
};

export const handle = async event => {
  try {
    const body = init(event);
    const url = body.deployment.payload.web_url;
    const result = await requestScan(url);

    if (!result) {
      //create issue
      await createIssue(body);
    }

    const msg = "Personally identifiable information check passed";
    return msg;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};
