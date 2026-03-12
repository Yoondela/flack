import config from '../../eslint.config.js';

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
    ],
  },
  ...config,
  {
    files: ['src/**/*.ts'],
  },
];
