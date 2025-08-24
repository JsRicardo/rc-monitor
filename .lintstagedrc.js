module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    'cspell --no-progress --no-summary'
  ],
  '*.{json,md,yml,yaml}': [
    'prettier --write'
  ],
  '*.{css,scss,less}': [
    'prettier --write'
  ]
};