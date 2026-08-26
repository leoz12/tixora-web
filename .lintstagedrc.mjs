/** @type {import("lint-staged").Configuration} */
const config = {
  "*.{js,jsx,mjs,cjs,ts,tsx}": ["eslint --fix --max-warnings 0 --no-warn-ignored"],
};

export default config;
