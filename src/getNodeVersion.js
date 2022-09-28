import fs from 'fs';
import { join } from 'path';

export const findPackageJson = () => {
  return fs.readFileSync('package.json').toString();
};

export const getNodeVersion = (path) => {
  const packageJson = findPackageJson(path);
  console.log('-----------packajsn-----', packageJson);

  return JSON.parse(packageJson).engines.node;
};