import { Client } from "pg"; // eslint-disable-line import/no-extraneous-dependencies
import { getDb } from "../../src/utils";

const OPTIONS = { database: "pg-generator-test", user: "user", password: "password" };

describe("getDb", () => {
  it("should get database using client options.", async () => {
    const db = await getDb(OPTIONS);
    expect(db.schemas.length).toBe(2);
  });

  it("should get database using clients.", async () => {
    const client = new Client(OPTIONS);
    const db = await getDb({ client });
    expect(db.schemas.length).toBe(2);
  });
});
