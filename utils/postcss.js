function shouldPrependCss(root) {
  let tailwindComponentsDirectiveApplied = false;
  root.walkAtRules((atRule) => {
    if (atRule.name === 'tailwind' && atRule.params === 'components') {
      tailwindComponentsDirectiveApplied = true;
    }
  });
  return tailwindComponentsDirectiveApplied;
}

module.exports = {
  shouldPrependCss,
};
