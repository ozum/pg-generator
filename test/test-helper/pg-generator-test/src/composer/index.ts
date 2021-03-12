/* eslint-disable class-methods-use-this */

import { join } from "path";
import { PgGenerator } from "../../../../../src";

export default class Composer extends PgGenerator {
  protected async init(): Promise<any> {
    await this.composeWith(join(__dirname, "../app"));
    await this.composeWith(join(__dirname, "../"), "useless");
  }
}
