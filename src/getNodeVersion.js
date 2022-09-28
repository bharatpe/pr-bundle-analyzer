import fs from 'fs';
import { join } from 'path';

export const findPackageJson = (path) => {
  return fs.readFileSync(join(path, 'package.json')).toString();
};

export const getNodeVersion = (path) => {
  const packageJson = findPackageJson(path);

  return JSON.parse(packageJson).engines.node;
};