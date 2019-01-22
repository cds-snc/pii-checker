const admin = require("firebase-admin");

let db;
const collection = "anonymize-ip";

switch (process.env.NODE_ENV) {
  case "dev":
    const serviceAccount = require("../../firestore.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIRESTORE_URL
    });

    db = admin.firestore();
    break;
  case "test":
    const MockCloudFirestore = require("mock-cloud-firestore");
    const { fixtureData } = require("../__mocks__/firestore.js");
    let firebase = new MockCloudFirestore(fixtureData);
    db = firebase.firestore();
    break;
  default:
    const functions = require("firebase-functions");
    admin.initializeApp(functions.config().firebase);
    db = admin.firestore();
}

const defaultPayload = { repo: "", issue: false, timestamp: null };

module.exports.loadFromFirestore = async (repo, environment) => {
  const reposRef = db.collection(collection);
  const branchQuery = reposRef
    .where("repo", "==", repo)
    .where("environment", "==", environment)
    .limit(1);

  const branchCollection = await branchQuery.get();
  let branchItems = [];
  branchCollection.forEach(r => branchItems.push(r.data()));

  const defaultResult = { data: defaultPayload };

  return branchItems.length > 0 ? branchItems[0] : defaultResult;
};

module.exports.saveToFirestore = async (payload = defaultPayload) => {
  payload["timestamp"] = Date.now();
  return db
    .collection(collection)
    .add(payload)
    .then(() => true)
    .catch(() => false);
};
