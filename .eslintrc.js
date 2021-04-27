module.exports = {
  ignorePatterns: ['.eslintrc.js'],
  extends: ['airbnb-typescript-prettier'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
};
