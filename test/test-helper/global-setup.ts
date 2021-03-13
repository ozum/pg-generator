import { promises as fs, existsSync } from "fs";
import { join } from "path";
import PgTestUtil from "pg-test-util";

module.exports = async () => {
  const envPath = join(__dirname, "../../.env");
  const githubEnvPath = join(__dirname, "../../.github/workflows/github.env");
  if (!existsSync(envPath)) await fs.copyFile(githubEnvPath, envPath);

  const pgTestUtil = new PgTestUtil({ connection: { connectionString: "postgresql://user:password@127.0.0.1:5432/template1" } });
  await pgTestUtil.createDatabase({ drop: true, name: "pg-generator-test", file: `${__dirname}/ddl/main.sql` });
  (global as any).pgTestUtil = pgTestUtil;
};
