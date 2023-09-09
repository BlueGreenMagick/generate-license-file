import { getLicenseFileText } from "generate-license-file";

export const devImplementation: typeof getLicenseFileText = () =>
  Promise.resolve(`In a production build this file will contain the licenses of your production dependencies.

For dev builds it only contains this text for the sake of build speed.`);
