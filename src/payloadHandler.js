"use strict";
import octokit, { validateDeployment, requestScan, notify } from "./lib";
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
    const url = "https://digital.canada.ca";
    const result = await requestScan(url);

    if (!result) {
      await notify(body, octokit, {
        state: "error",
        description: "Failed to validate Personally identifiable information"
      });
    }

    const msg = "Personally identifiable information check passed";
    return msg;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};
