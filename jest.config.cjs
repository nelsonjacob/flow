/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  roots: ['<rootDir>/tests'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: {
          esModuleInterop: true,
          isolatedModules: true,
          jsx: 'react-jsx',
          module: 'CommonJS',
          moduleResolution: 'node',
          target: 'ES2020',
        },
      },
    ],
  },
};
