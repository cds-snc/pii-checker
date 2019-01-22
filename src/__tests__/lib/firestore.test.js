import { loadFromFirestore, saveToFirestore } from "../../lib/firestore";

describe("loadFromFirestore", () => {
  it("returns data for a specific sha abd tge last master", async () => {
    let result = await loadFromFirestore(
      "cds-snc/bundle-size-tracker-demo-app",
      "bundle-size-tracker-demo-pr-21"
    );
    expect(result.issue).toEqual(true);
  });

  it("returns an array of empty object with no data if nothing exists", async () => {
    let result = await loadFromFirestore("cds-snc/what", "ijkl");
    expect(result).toEqual({
      data: { repo: "", issue: false, timestamp: null }
    });
  });
});

describe("saveToFirestore", () => {
  it("saves an object to Firestore", async () => {
    let payload = {
      repo: "cds-snc/bundle-size-tracker-demo-app",
      issue: "true",
      environment: "ijkl"
    };
    let results = await saveToFirestore(payload);
    expect(results).toEqual(true);
  });
});
