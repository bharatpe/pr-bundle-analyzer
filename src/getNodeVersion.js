import fs from 'fs';
export const findPackageJson = () => {
  return fs.readFileSync('package.json').toString();
};

export const getNodeVersion = (path) => {
  const packageJson = findPackageJson(path);
  return JSON.parse(packageJson).dependencies;
};