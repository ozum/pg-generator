/* eslint-disable class-methods-use-this */

import { PgGenerator, Context } from "../../../../../src";
import { getNunjucks } from "../utils/get-nunjucks";

const nunjucks = getNunjucks(__dirname);

export default class Useless extends PgGenerator {
  protected async render(templatePath: string, context: Context): Promise<string> {
    return nunjucks.render(templatePath, context);
  }
}
