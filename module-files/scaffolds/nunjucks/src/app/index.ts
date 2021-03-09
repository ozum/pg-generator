/* eslint-disable class-methods-use-this */
import { PgGenerator, Context } from "pg-generator";
import { getNunjucks } from "../utils/get-nunjucks";
import generatorContext from "./context";

const nunjucks = getNunjucks(__dirname);

/**
 * Example `pg-generator` generator which creates sequelize models.
 */
export default class App extends PgGenerator {
  /**
   * Returns a context data including sequelize data types and some other examples.
   */
  protected context(): Record<string, any> {
    return generatorContext;
  }

  /**
   * Render method which uses a nunjucks template. You can use any template engine.
   * `pg-generator` is template engine agnostic.
   */
  protected async render(templatePath: string, context: Context): Promise<string> {
    return nunjucks.render(templatePath, context);
  }
}
