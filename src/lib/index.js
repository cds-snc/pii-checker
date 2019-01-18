import octokit from "@octokit/rest";
export { requestScan } from "./requestScan";
export { validateDeployment } from "./validate";
export { createIssue } from "./issues";
export default octokit();
