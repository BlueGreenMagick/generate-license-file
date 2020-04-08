import { promisify } from "util";
import { readFileAsync, doesFolderExist } from "./utils/file.utils";
import { ILicense } from "./models/license.interface";
import { InitOpts, ModuleInfos, init } from "license-checker";

const initAsync: (options: InitOpts) => Promise<ModuleInfos> = promisify(init);
const UTF8: string = "utf-8";

/**
 * @param path  Directory containing the project's package.json (relative or absolute).
 * @returns Array of `ILicense`s each containing the license content and respective dependencies
 */
export async function getProjectLicenses(path: string): Promise<ILicense[]> {

  try {
    const dependencyLicenses: Map<string, ILicense> = new Map<string, ILicense>();

    if (!await doesFolderExist(path)) {
      throw new Error("Cannot find directory " + path);
    }

    const file: ModuleInfos = await initAsync({
      start: path,
      production: true
    });

    for (const [dependencyName, dependencyValue] of Object.entries(file)) {
      if (dependencyValue.licenseFile) {
        const license: string = await readFileAsync(dependencyValue.licenseFile, { encoding: UTF8 });

        if (!dependencyLicenses.has(license)) {
          dependencyLicenses.set(license, {
            content: license,
            dependencies: []
          });
        }

        dependencyLicenses.get(license)?.dependencies.push(dependencyName);
      }
    }

    return Array.from(dependencyLicenses.values());
  } catch (error) {
    console.error(error);
    return Promise.reject();
  }
}
