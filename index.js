const fs = require('fs');
const { resolve } = require('path');
const fastGlob = require('fast-glob');
const { scrapeComponents, logIssuesOfComponents } = require('./utils/components');
const { transformComponentsToCss, wrapCssWithComponentsLayer } = require('./utils/css');
const { shouldPrependCss } = require('./utils/postcss');

function applyOptions(options = {}) {
  const tailwindCSSConfigPath = resolve(process.cwd(), options.tailwindCSSConfigPath || 'tailwind.config.js');
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const content = options.content || require(tailwindCSSConfigPath).content;

  const scrapeComponentsFunction = options.scrapeComponents || scrapeComponents;
  const scrapeComponentsFunctionOptions = options.scrapeComponentsFunctionOptions || {};

  const transformComponentsToCssFunction = options.transformComponentsToCssFunction
    || transformComponentsToCss;

  return {
    content,
    scrapeComponentsFunction,
    scrapeComponentsFunctionOptions,
    transformComponentsToCssFunction,
  };
}

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (options = {}) => {
  const {
    content,
    scrapeComponentsFunction,
    scrapeComponentsFunctionOptions,
    transformComponentsToCssFunction,
  } = applyOptions(options);

  function scrapeAllComponents() {
    const filesToScrapeComponentsFrom = fastGlob.sync(content);
    let scrapedComponents = {};

    filesToScrapeComponentsFrom.forEach((file) => {
      const fileContent = fs.readFileSync(file, 'utf-8');
      scrapedComponents = scrapeComponentsFunction(
        file,
        fileContent,
        scrapedComponents,
        scrapeComponentsFunctionOptions,
      );
    });

    logIssuesOfComponents(scrapedComponents);

    return scrapedComponents;
  }

  return {
    postcssPlugin: 'tailwindcss-componizer',
    /**
     * 1. Only run the TailwindCSS Componizer if the root css is a main TailwindCSS entry file.
     * 2. Scrape all components from the files specified in the content option.
     * 3. Transform the components to css.
     * 4. Prepend the css to the root css.
     * 5. ???
     * 6. Profit!
     *
     * @param root
     * @constructor
     */
    Once(root) {
      // Only run the TailwindCSS Componizer if the root css is a main TailwindCSS entry file,
      // otherwise we might duplicate the components.
      if (!shouldPrependCss(root)) {
        return;
      }

      const scrapedComponents = scrapeAllComponents();
      const css = transformComponentsToCssFunction(scrapedComponents);

      if (css) {
        root.prepend(wrapCssWithComponentsLayer(css));
      }
    },
  };
};

module.exports.postcss = true;
