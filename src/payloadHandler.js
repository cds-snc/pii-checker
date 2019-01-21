"use strict";
import octokit, {
  validateDeployment,
  requestScan,
  createIssue,
  loadFromFirestore,
  saveToFirestore
} from "./lib";
import { webhook } from "./__mocks__/deploymentWebhook";

export const localPayload = async () => {
  const event = await webhook;
  const result = await handle(event);
  console.log(result);
  return result;
};

const init = event => {
  const body = validateDeployment(event);
  return body;
};

const issueTemplate = {
  title: "Personally identifiable information check failed",
  body: "Please ensure the Google Analtics anonymize IP setting is set to true."
};

export const handle = async event => {
  try {
    const body = init(event);
    const url = body.deployment.payload.web_url;
    const environment = body.deployment.environment;

    /* Check to see if issue has already been created */
    const repoName = body.repository.full_name;
    const issueResult = await loadFromFirestore(repoName, environment);

    if (issueResult.issue) {
      return `Personally identifiable information issue already posted`;
    }

    /* Perform the puppeteer scan */
    const result = await requestScan(url);
    const msg = "Personally identifiable information check";

    if (!result) {
      // create issue
      await createIssue(octokit, body, issueTemplate);
      // save to the DB
      await saveToFirestore({
        repo: repoName,
        issue: true,
        environment: environment
      });
      return `${msg} failed`;
    }
    return `${msg} passed`;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};
