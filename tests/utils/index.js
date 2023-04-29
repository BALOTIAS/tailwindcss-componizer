const postcss = require("postcss");
const plugin = require("../../index");
const tailwindCSSEntry = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

const expectedDummyButtonOutput = '.twc\\/button { @apply bg-blue-600 text-white p-2; }';
const expectedDummyCardOutput = '.twc\\/card { @apply bg-white rounded-md text-black; }';
const expectedDummyInputOutput = '.twc\\/input { @apply border-2 bg-white rounded-md; }';

function twcCssToExpect(twcCssOutputs = []) {
  return `@layer components { ${twcCssOutputs.join(' ')} }`;
}

function cssToExpect(entryCss, twcCssOutputs = [], appendCss = false) {
  if (appendCss) {
    return `${entryCss}${twcCssToExpect(twcCssOutputs)}`;
  }

  return `${twcCssToExpect(twcCssOutputs)}${entryCss}`;
}

async function runPostCss(input, output, options = {}) {
  return postcss([plugin(options)]).process(input, { from: undefined });
}

async function expectCssOutput(input, output, options = {}) {
  const result = await runPostCss(input, output, options);

  expect(result.css.trim()).toEqual(output.trim());
  expect(result.warnings()).toHaveLength(0);

  return result;
}

module.exports = {
  tailwindCSSEntry,
  expectedDummyButtonOutput,
  expectedDummyCardOutput,
  expectedDummyInputOutput,
  twcCssToExpect,
  cssToExpect,
  runPostCss,
  expectCssOutput,
};
