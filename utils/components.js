const { twcIdentifierToCssSelector } = require('./css');

function extractTwcIdentifierFromFullClassMatch(fullClassMatch) {
  return fullClassMatch.split(':')[0];
}

function applyOptions(options = {}) {
  const twcIdentifierPattern = options.twcIdentifierPattern || /twc\/[^:\s]*(?![^:\s]*:)[^`'"\s]/g;
  const twcClassPattern = options.twcClassPattern || /twc\/\S+:([^:\s]*[^\s`'"])/g;

  // Selector representation for the twc identifier, default: .twc/identifier
  // eslint-disable-next-line no-undef
  const twcIdentifierToSelector = options.twcIdentifierToSelector || twcIdentifierToCssSelector;

  // Function to extract the twc identifier from the twc class,
  // default (splits up at ":"): twc/identifier:class => twc/identifier
  const twcIdentifierFromFullClassMatch = options.twcIdentifierFromFullClassMatch
    || extractTwcIdentifierFromFullClassMatch;

  return {
    twcIdentifierPattern,
    twcClassPattern,
    twcIdentifierToSelector,
    twcIdentifierFromFullClassMatch,
  };
}

/**
 * Scrape all components from content.
 * 1. Find all twc identifiers.
 * 2. Find all twc classes.
 * 3. Walk through and extract components from the twc identifiers and applies classes to them.
 *  3.1. If the component object does not exist yet, create it, otherwise warn about duplicates.
 *       Also convert the twc identifier to a valid CSS selector.
 *  3.2. Append the classes which will be applied to the component.
 * 4. Return the components object.
 * @param file
 * @param content
 * @param components
 * @param options
 * @returns {{}}
 */
function scrapeComponents(file, content, components = {}, options = {}) {
  const extractedComponents = components;
  const {
    twcIdentifierPattern,
    twcClassPattern,
    twcIdentifierToSelector,
    twcIdentifierFromFullClassMatch,
  } = applyOptions(options);

  // Find all twc identifiers, e.g. twc/identifier
  const allTwcIdentifierMatches = [...content.matchAll(twcIdentifierPattern)];

  // Find all twc classes, e.g. twc/identifier:class
  const allTwcClassMatches = [...content.matchAll(twcClassPattern)];

  // 3. Walk through and extract components from the twc identifiers and applies classes to them.
  allTwcIdentifierMatches.forEach((twcIdentifierMatch) => {
    const [twcIdentifier] = twcIdentifierMatch;

    // 3.1. Extracts the components from the twc identifiers
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

    // 3.2. Append the classes which will be applied to the component.
    allTwcClassMatches.forEach((twcClassMatch) => {
      const fullClassMatch = twcClassMatch[0];
      const classToApply = twcClassMatch[1];

      if (twcIdentifier === twcIdentifierFromFullClassMatch(fullClassMatch)) {
        extractedComponents[twcIdentifier].classes.push(classToApply);
      }
    });
  });

  return components;
}

function logIssuesOfComponents(components) {
  Object.keys(components).forEach((twcIdentifier) => {
    const component = components[twcIdentifier];

    if (components.classes.length === 0) {
      console.warn(
        `[TWC] Component "${twcIdentifier}" found without any applied classes.`,
        component.file,
      );
    }

    if (component.duplicatedInFiles.length > 0) {
      console.error(
        `[TWC] Duplicated component identifier "${twcIdentifier}" found within:`,
        component.file,
        ...component.duplicatedInFiles,
      );
    }
  });
}

module.exports = {
  scrapeComponents,
  logIssuesOfComponents,
};
