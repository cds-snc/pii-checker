"use strict";
import { validateDeployment, requestScan, createIssue } from "./lib";
import { webhook } from "./__mocks__/deploymentWebhook";

export const localPayload = async () => {
  const event = await webhook;
  return handle(event);
};

const init = event => {
  const body = validateDeployment(event);
  return body;
};

const issueMessage =
  "Personally identifiable information check failed.  Please ensure the Google Analtics anonymize IP setting is set to true.";

export const handle = async event => {
  try {
    const body = init(event);
    const url = body.deployment.payload.web_url;
    const result = await requestScan(url);
    const msg = "Personally identifiable information check";

    if (!result) {
      // create issue
      await createIssue(body, issueMessage);
      return `${msg} failed`;
    }
    return `${msg} passed`;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};
