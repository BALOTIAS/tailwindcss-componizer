# Contributing

This project adheres to [Semantic Versioning](http://semver.org/).

Thanks for your interest in contributing to TailwindCSS Componizer! Please take a moment to review this document before submitting a pull request.

## Pull requests
Please ask first before starting work on any significant new features.

It's never a fun experience to have your pull request declined after investing a lot of time and effort into a new feature. To avoid this from happening, we request that contributors create an issue to first discuss any significant new ideas. This includes things like adding new behaviors, etc.

## Coding standards
Our code formatting rules are defined in `.eslintrc`. You can check your code against these standards by running:
```
npm run style
```
To automatically fix any style violations in your code, you can run:
```
npm run style -- --fix
```
## Running tests
You can run the test suite using the following commands:
```
npm run build && npm test
```
Please ensure that the tests are passing when submitting a pull request. If you're adding new features to TailwindCSS Componizer, please include tests.
