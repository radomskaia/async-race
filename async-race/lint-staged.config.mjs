export default {
  "*": ["prettier --write --ignore-unknown"],
  "*.css": ["stylelint --fix"],
  "*.{js,mjs,ts,jsx,tsx}": ["eslint --max-warnings 0"],
};
