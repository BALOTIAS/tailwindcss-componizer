const { twcIdentifierToCssSelector } = require('./css');

function applyOptions(options = {}) {
  const twcPattern = options.twcPattern || /(twc\/[^\s`'":]+)(?::([^\s`'"]+))?/g;

  // Selector representation for the twc identifier, default: .twc/identifier
  // eslint-disable-next-line no-undef
  const twcIdentifierToSelector = options.twcIdentifierToSelector || twcIdentifierToCssSelector;

  return {
    twcPattern,
    twcIdentifierToSelector,
  };
}

/**
 * @typedef {Object} TWComponent
 * @property {string} selector
 * @property {string[]} classes
 * @property {string} file
 * @property {string[]} duplicatedInFiles
 */

/**
 * Scrape all components from content.
 * 1. Find all twc identifier/classes.
 * 2. Walk through and extract components from the twc identifiers and applies classes to them.
 *  2.1. If the component object does not exist yet, create it, otherwise warn about duplicates.
 *       Also convert the twc identifier to a valid CSS selector.
 *  2.2. Append the classes which will be applied to the component.
 * 3. Return the components object.
 *
 * @param file
 * @param content
 * @param components
 * @param options
 * @returns {[TWComponent, TWComponent, TWComponent, TWComponent]}
 */
function scrapeComponents(file, content, components = {}, options = {}) {
  const extractedComponents = components;
  const {
    twcPattern,
    twcIdentifierToSelector,
  } = applyOptions(options);

  // 1. Find all twc usages, e.g. twc/identifier or twc/identifier:classToApply
  const allTwcMatches = [...content.matchAll(twcPattern)];

  // 2. Walk through and extract components from the twc identifiers and applies classes to them.
  allTwcMatches.forEach((twcIdentifierMatch) => {
    // eslint-disable-next-line no-unused-vars
    const [fullMatch, twcIdentifier, classToApply] = twcIdentifierMatch;

    if (!classToApply) {
      // 2.1. Extracts the components from the twc identifiers
      if (!extractedComponents[twcIdentifier]) {
        extractedComponents[twcIdentifier] = {
          // Set the selector that will be used to identify the component in the CSS.
          selector: twcIdentifierToSelector(twcIdentifier),
          classes: [],
          file,
          duplicatedInFiles: [],
        };
      } else {
        extractedComponents[twcIdentifier].duplicatedInFiles = [
          ...extractedComponents[twcIdentifier].duplicatedInFiles,
          file,
        ];
      }
    } else {
      // 2.2. Append the classes which will be applied to the component.
      extractedComponents[twcIdentifier].classes.push(classToApply);
    }
  });

  return components;
}

function warnComponentIssues({ result }, components) {
  Object.keys(components).forEach((twcIdentifier) => {
    const component = components[twcIdentifier];

    if (component.classes.length === 0) {
      result.warn(
        `[TWC] Component "${twcIdentifier}" found without any applied classes: ${component.file}`,
      );
    }

    if (component.duplicatedInFiles.length > 0) {
      const duplicatedInFiles = [
        component.file,
        ...component.duplicatedInFiles,
      ].join(', ');
      result.warn(
        `[TWC] Duplicated component identifier "${twcIdentifier}" found within: ${duplicatedInFiles}`,
      );
    }
  });
}

module.exports = {
  scrapeComponents,
  warnComponentIssues,
};
