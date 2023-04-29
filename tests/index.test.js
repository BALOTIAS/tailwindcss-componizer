const {
  tailwindCSSEntry,
  expectedDummyButtonOutput,
  expectedDummyCardOutput,
  expectedDummyInputOutput,
  cssToExpect,
  expectCssOutput,
  runPostCss,
} = require('./utils');

describe('TWC extracts and adds components as expected', () => {
  it('should run only on files specified in the content option', async () => {
    const result = await expectCssOutput(
      tailwindCSSEntry,
      cssToExpect(
        tailwindCSSEntry,
        [expectedDummyCardOutput, expectedDummyInputOutput],
      ),
      {
        content: './tests/dummy/components/**/*.{html,vue}',
      },
    );

    expect(result.css).not.toContain(expectedDummyButtonOutput);
  });

  it('should prepend the custom twc to the main entry css', async () => {
    await expectCssOutput(
      tailwindCSSEntry,
      cssToExpect(
        tailwindCSSEntry,
        [expectedDummyButtonOutput, expectedDummyCardOutput, expectedDummyInputOutput],
      ),
      {
        content: './tests/dummy/components/**/*.{html,jsx,vue}',
      },
    );
  });

  it('should append the custom twc to the main entry css', async () => {
    await expectCssOutput(
      tailwindCSSEntry,
      cssToExpect(
        tailwindCSSEntry,
        [expectedDummyButtonOutput, expectedDummyCardOutput, expectedDummyInputOutput],
        true,
      ),
      {
        content: './tests/dummy/components/**/*.{html,jsx,vue}',
        appendCss: true,
      },
    );
  });
});

describe('TWC warns about issues', () => {
  it('should throw a warning when duplicated identifiers are found', async () => {
    const result = await runPostCss(
      tailwindCSSEntry,
      cssToExpect(
        tailwindCSSEntry,
        [expectedDummyCardOutput, expectedDummyInputOutput],
      ),
      {
        content: [
          './tests/dummy/components/**/*.{html,jsx,vue}',
          './tests/dummy/duplicated/**/*.{html,jsx,vue}',
        ],
      },
    );

    const warnings = result.warnings();
    expect(warnings).toHaveLength(1);

    const [warning] = warnings;
    expect(warning.text).toEqual('[TWC] Duplicated component identifier "twc/button" found within: ./tests/dummy/components/button.jsx, ./tests/dummy/duplicated/button.jsx');
  });

  it('should throw a warning when identifiers without applied classes are found', async () => {
    const result = await runPostCss(
      tailwindCSSEntry,
      cssToExpect(
        tailwindCSSEntry,
        [expectedDummyCardOutput, expectedDummyInputOutput],
      ),
      {
        content: [
          './tests/dummy/components/**/*.{html,jsx,vue}',
          './tests/dummy/issues/**/*.{html,jsx,vue}',
        ],
      },
    );

    const warnings = result.warnings();
    expect(warnings).toHaveLength(1);

    const [warning] = warnings;
    expect(warning.text).toEqual('[TWC] Component "twc/other" found without any applied classes: ./tests/dummy/issues/other.jsx');
  });

  it('should throw all warnings when all issues are found', async () => {
    const result = await runPostCss(
      tailwindCSSEntry,
      cssToExpect(
        tailwindCSSEntry,
        [expectedDummyCardOutput, expectedDummyInputOutput],
      ),
      {
        content: [
          './tests/dummy/components/**/*.{html,jsx,vue}',
          './tests/dummy/duplicated/**/*.{html,jsx,vue}',
          './tests/dummy/issues/**/*.{html,jsx,vue}',
        ],
      },
    );

    const warnings = result.warnings();
    expect(warnings).toHaveLength(2);

    const [duplicatedWarning, noAppliedClassWarning] = warnings;
    expect(duplicatedWarning.text).toEqual('[TWC] Duplicated component identifier "twc/button" found within: ./tests/dummy/components/button.jsx, ./tests/dummy/duplicated/button.jsx');
    expect(noAppliedClassWarning.text).toEqual('[TWC] Component "twc/other" found without any applied classes: ./tests/dummy/issues/other.jsx');
  });
});
