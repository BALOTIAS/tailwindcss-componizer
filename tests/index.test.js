const postcss = require('postcss');

const plugin = require('../index');

async function run(input, output, opts = { }) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

it('does something', async () => {
  await run('a{ }', 'a{ }', { content: './tests/dummy/**/*.{html,js}' });
});

it('does something', async () => {
  const tailwindCSSEntry = `
    @tailwindcss base;
    @tailwindcss components;
    @tailwindcss utilities;
  `;

  await run(tailwindCSSEntry, tailwindCSSEntry, { content: './tests/dummy/**/*.{html,js}' });
});
