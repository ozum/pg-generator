/* eslint-disable class-methods-use-this */
import { extname, join, relative, dirname, resolve } from "path";
import { promises as fs } from "fs";
import { chalk } from "meow-helper";
import { fdir as Fdir } from "fdir";
import merge from "lodash.merge";
import JSON5 from "json5";
import type { Context, GeneratorOptions, InternalOptions } from "./types/index";
import { getDbObjects, getTemplatePaths, resolvePath, augmentContext, composeWith } from "./utils";

const COLORS: Record<string, keyof typeof chalk> = {
  default: "green",
  delete: "yellow",
};

/**
 * Base abstract class for for pg-generator classes.
 */
export abstract class PgGenerator<O extends GeneratorOptions = GeneratorOptions> {
  #destinationRoot: string;
  #internalOptions: InternalOptions;
  protected fs: any;
  protected options: O & { envPrefix: string; context: Record<string, any> };

  /**
   * Creates an instance of PgGenerator.
   *
   * @param options are parameters for several options.
   * @param internalOptions are added by `pg-generator` functions and not for user.
   */
  public constructor(options: O, internalOptions: InternalOptions) {
    if (options.clear && !options.outDir) throw new Error("As a precaution, 'clear' option cannot be used without 'outDir' option.");
    this.options = { envPrefix: "DB", copy: true, context: {}, ...options };
    this.#internalOptions = internalOptions;
    this.#destinationRoot = resolve(internalOptions.cwd, this.options.outDir || "");
  }

  /**
   * Renders all templates in `[rootDir]/templates` directory with the render function using related context data,
   * and writes generated contents to the files in output directory. If render function returns `undefined`
   * for a template/database object pair no file is not written for that pair.
   *
   * Template file names may contain variables and basic filter functions to change names of generated files.
   *
   * Additionally copies all files in `[rootDir]/files` to the output directory.
   */
  public async generate(): Promise<void> {
    if (this.options.clear) await this.clear();

    const templatePaths = await getTemplatePaths(this.#internalOptions.templateDir);
    const context = await this.fetchContext();

    // Generate templates. Provide absolute outdir. Don't copy files, because you should use Yeoman's `mem-fs-editor` API.
    await Promise.all(
      templatePaths.flatMap((path) =>
        getDbObjects(this.#internalOptions.db, path).map(async (dbObject) => {
          const destinationPath = resolvePath(path, dbObject); // e.g. {name#dashcase}.js -> member-option.js
          const content = await this.render(path, augmentContext(dbObject, context));
          if (content !== undefined && content.replace(/\s/g, "") !== "") await this.process(destinationPath, content);
        })
      )
    );

    await this.copyDir("files");
  }

  //
  // ────────────────────────────────────────────────────────── I ──────────
  //   :::::: L I F E C Y C L E : :  :   :    :     :        :          :
  // ────────────────────────────────────────────────────────────────────
  //
  // Methods below are lifecycle methods and most probably would be extended
  // by child classes for custom behavior. Providing `render` is mandatory.
  // Flow: clear -> context -> render -> process

  /**
   * If clear option is true, this method is called. It deletes destination path.
   * User may override this method to tailor clear operation according to generator's
   * purposes.
   */
  protected async clear(): Promise<void> {
    await this.deleteDestination();
  }

  /**
   * Provides generator specific extra context to templates. This data is deeply merged with
   * context provided by user.
   *
   * @returns generator spesific extra context data.
   */
  protected context(): Promise<Record<string, any>> | Record<string, any> {
    return {};
  }

  /**
   * Generates content from the template with provided path using the context.
   *
   * @param templatePath is the path of the template file to generate content.
   * @param context is the data to be used for generating content.
   * @returns generated content.
   */
  protected abstract render(templatePath: string, context: Context): Promise<void | string> | void | string;

  /**
   * Writes generated content from [[render]] to the destination file.
   *
   * @param destination is the destionation path of the file to be cerated..
   * @param content is the content to process.
   */
  protected process(destination: string, content: string): Promise<any> | any {
    return this.writeTemplate(destination, content);
  }

  //
  // ────────────────────────────────────────────────────── I ──────────
  //   :::::: U T I L I T Y : :  :   :    :     :        :          :
  // ────────────────────────────────────────────────────────────────
  //

  // Protected methods below are utility methods to be used by child classes.

  /**
   * Logs given messsage if `options.log` is true.
   *
   * @param title is the title of the log.
   * @param message is the nessage to log.
   * @param options are options.
   */
  protected log(title: string, { message, source, destination }: { message?: string; source?: string; destination?: string }): void {
    if (!this.options.log) return;
    const titleColor = COLORS[title] ?? COLORS.default;
    const colorizeTitle = chalk[titleColor] as (input: string) => string;
    const logTitle = colorizeTitle(title);
    const messageSpace = message && source && destination ? ": " : " ";
    const logMessage = message === undefined ? "" : ` ${message}${messageSpace}`;
    const logSource = source ? `${source}${destination ? " ➔ " : ""}` : "";
    const logDestination = destination ? join(this.options.outDir || "", destination) : "";
    console.log(`   ${logTitle} ${logMessage}${logSource}${logDestination}`); // eslint-disable-line no-console
  }

  /**
   * Returns abosulte path for the given path relative to output directory.
   *
   * @param path is the path relative to output directory.
   * @returns the absolute path.
   */
  protected destinationPath(path = ""): string {
    return resolve(this.#destinationRoot, path);
  }

  /**
   * Returns abosulte path for the given path relative to template root.
   *
   * @param path is the path relative to template root.
   * @returns the absolute path.
   */
  protected templatePath(path = ""): string {
    return resolve(this.#internalOptions.templateDir, path);
  }

  //
  // ──────────────────────────────────────────────────────── I ──────────
  //   :::::: I N T E R N A L : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────
  //

  // Private methods below are for internal usage.

  /**
   * Executes the default sub-generator `app` from a generator. If options are provided, they are combined with current options.
   *
   * @param generator is the name or path of the generator. If it is a local path, use `require.resolve` or provide an absolute path.
   * @param options are the new options added on top of curent options.
   *
   * @throws error if generator can not be found.
   *
   * @example
   * this.composeWith("generator-from-npm");
   * this.composeWith("generator-from-npm", options);
   * this.composeWith(require.resolve("./local-generator"), options);
   */
  protected async composeWith(generator: string, options?: GeneratorOptions): Promise<void>;
  /**
   * Executes a sub-generator from a generator. If options are provided, they are combined with current options.
   *
   * @param generator is the name or path of the generator. If it is a local path, use `require.resolve` or provide an absolute path.
   * @param subGeneratorName is the name of the sub-generator to be executed.
   * @param options are the new options added on top of curent options.
   *
   * @throws error if generator or sub-generator can not be found.
   *
   * @example
   * this.composeWith("generator-from-npm", "sub-generator");
   * this.composeWith(require.resolve("./local-generator"), "sub-generator", options);
   */
  protected async composeWith(generator: string, subGeneratorName?: string, options?: GeneratorOptions): Promise<void>;
  protected async composeWith(generator: string, subOrOptions?: string | GeneratorOptions, maybeOptions?: GeneratorOptions): Promise<void> {
    const [options = {}, generatorName = "app"] = typeof subOrOptions === "string" ? [maybeOptions, subOrOptions] : [maybeOptions];
    return composeWith(generator, generatorName, { ...this.options, ...options }, this.#internalOptions.db, this.#destinationRoot);
  }

  /**
   * Writes given content to the file after creating it's directory.
   *
   * @param destinantion is the path to write file.
   * @param content is the content to write.
   */
  private async writeTemplate(destination: string, content: string): Promise<void> {
    const destinationPath = this.destinationPath(destination);
    await fs.mkdir(dirname(destinationPath), { recursive: true });
    await fs.writeFile(destinationPath, content, { encoding: "utf8" });
    this.log("create", { destination });
  }

  /**
   * Copy the source file to the destination. Also creates the destination directory if it does not exist.
   *
   * @param source is the source file to copy.
   * @param destination is the destination file to be created.
   */
  private async copyTemplate(source: string, destination: string): Promise<void> {
    await fs.mkdir(dirname(this.destinationPath(destination)), { recursive: true });
    await fs.copyFile(this.templatePath(source), this.destinationPath(destination));
    this.log("create", { destination });
  }

  /**
   * If source directory exists, copies all files recursively from the source directory to the destination directory.
   * Also creates the destination directory if it does not exist.
   *
   * @param source is the source directory to copy files from.
   * @param destination is the destination directory to copy files to.
   */
  private async copyDir(source = "", destination = ""): Promise<any[]> {
    const absSource = this.templatePath(source);
    const paths = ((await new Fdir().withBasePath().crawl(absSource).withPromise()) as string[]).map((p) => relative(absSource, p));
    return Promise.all(paths.map((path) => this.copyTemplate(join(source, path), join(destination, path))));
  }

  /**
   * Removes file or directory (and it's contents() from destination. If destination is equal to `cwd()`
   * it throws error and aborts operation for a safety measure. Most probably `cwd()` contains other files too.
   *
   * @param path is the path relative to the destination root.
   */
  private async deleteDestination(path = ""): Promise<void> {
    const destination = this.destinationPath(path);
    const isRoot = resolve(this.#internalOptions.cwd) === resolve(destination);
    if (isRoot) throw new Error("Root is not deleted, because it may be a mistake. Probably it would contain other files.");

    try {
      await fs.rmdir(this.destinationPath(path), { recursive: true });
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      else if (error.code === "ENOTDIR") await fs.unlink(this.destinationPath(path));
    }
    this.log("delete", { destination: path || "." });
  }

  /**
   * Fetches and merges context data from `pg-generator` instance, context file and options.
   * The context file may be a JSON5 data file (may contain comments etc.) or a JavaScript file
   * with a default export of object or a function. If it is a function, it is passed
   * `pg-structure` db instance.
   *
   * Merge priorities are: `options.context` > context file > `context()` method.
   *
   * @param contextFile is the file to read from.
   * @param context is the context data.
   * @returns merged context data.
   */
  private async fetchContext(): Promise<Record<string, any>> {
    let contextFromFile = {};

    if (this.options.contextFile !== undefined) {
      const contextFile = resolve(this.options.contextFile);
      const fileContent =
        extname(contextFile) === ".json"
          ? JSON5.parse(await fs.readFile(contextFile, { encoding: "utf8" }))
          : (await import(contextFile)).default;
      contextFromFile = typeof fileContent === "function" ? fileContent(this.#internalOptions.db) : fileContent;

      this.log("context", { destination: contextFile });
    }

    return merge(await this.context(), contextFromFile, this.options.context);
  }
}
