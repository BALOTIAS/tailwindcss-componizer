// Required so that the CSS.escape function is available.
require('css.escape');

function twcIdentifierToCssSelector(twcIdentifier) {
  // eslint-disable-next-line no-undef
  return `.${CSS.escape(twcIdentifier)}`;
}

function transformComponentsToCss(components) {
  return Object.values(components)
    .filter(({ classes }) => classes.length > 0)
    .map(({ selector, classes }) => `${selector} { @apply ${classes.join(' ')}; }`)
    .join(' ')
    .trim();
}

function wrapCssWithComponentsLayer(css) {
  return `@layer components { ${css} }`;
}

module.exports = {
  twcIdentifierToCssSelector,
  transformComponentsToCss,
  wrapCssWithComponentsLayer,
};
