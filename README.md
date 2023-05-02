# TailwindCSS Componizer ♪♪ ヽ(ˇ∀ˇ )ゞ

[![Downloads](https://img.shields.io/npm/dt/tailwindcss-componizer.svg)](https://www.npmjs.com/package/tailwindcss-componizer)
[![Latest Release](https://img.shields.io/npm/v/tailwindcss-componizer)](https://www.npmjs.com/package/tailwindcss-componizer)
[![License](https://img.shields.io/npm/l/tailwindcss-componizer)](https://github.com/balotias/tailwindcss-componizer/blob/master/LICENSE)

TWC is a [PostCSS](https://github.com/postcss/postcss) plugin which allows you to write TailwindCSS components directly in your template without the need to create or modify separate CSS files or plugins.

Why? Because of convenience. It's much simpler to care about the styling of a component within the template itself rather than in a separate file.

Suppose you have the following component:

```html
<button class="twc/button twc/button:bg-blue-500 twc/button:text-white twc/button:p-4 twc/button:rounded">Button Component</button>
```

The plugin will output this CSS by appending or prepending it to a TailwindCSS entry file:

```scss
@layer components {
  /* ...other components... */
  .twc\/button { @apply bg-blue-500 text-white p-4 rounded; }
  /* ...other components... */
}
```

---

## Recommended usage

Read TailwindCSS's recommendation on creating components using `@layer components`:
* [Extracting classes with @apply](https://tailwindcss.com/docs/reusing-styles#extracting-classes-with-apply)
* [Avoiding Premature Abstraction](https://tailwindcss.com/docs/reusing-styles#avoiding-premature-abstraction)

> If you start using `@apply` for everything, you are basically just writing CSS again and throwing away all of the workflow and maintainability advantages Tailwind gives you, for example:
>
> - **You have to think up class names all the time** — nothing will slow you down or drain your energy like coming up with a class name for something that doesn’t deserve to be named.
>
> - **You have to jump between multiple files to make changes** — which is a way bigger workflow killer than you’d think before co-locating everything together.
>
> - **Changing styles is scarier** — CSS is global, are you _sure_ you can change the min-width value in that class without breaking something in another part of the site?
>
> - **Your CSS bundle will be bigger** — oof.

---

## Quirks

### Avoid using `group` and `peer` class name markings

This plugin will interpret **all classes** as TailwindCSS classes and will create TailwindCSS components by using `@layer components` and the `@apply` directive on them.

Avoid using the `group` and `peer` class name markings and their arbitrary versions, like `group/example` and `peer/example` as TailwindCSS can't apply them!
So instead of: `twc/button:group/button`, use it alongside the component: `twc/button group/button`. Side note: something like `twc/button:group-hover/button` will work just fine.

A rule of thumb would be: If it doesn't work when using `@apply` natively in CSS, it won't work with TWC either. My suggestion is: The simpler - the better.

Read more about the `@apply` directive here as it will help you a ton, especially when it comes to how & when you want to use this:
* https://tailwindcss.com/docs/functions-and-directives#apply
* https://tailwindcss.com/docs/reusing-styles#extracting-classes-with-apply

---

## Installation & Usage

### Install TailwindCSS Componizer

```
npm install -D tailwindcss-componizer
```

```
yarn add -D tailwindcss-componizer
```

or pick your package manager of choice <:9

### Update your PostCSS config

```js
// postcss.config.js
module.exports = {
  plugins: [
    // ...
    require('tailwindcss-componizer'),
    require('tailwindcss'),
    require('autoprefixer'),
    // ...
  ]
}
```

By default, it will use the content option from `tailwind.config.js`.

### Start creating components in your templates now!

```html
<button class="twc/button twc/button:bg-blue-600">...</button>
```

---

## Options

Here are all available options with their default values:

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('tailwindcss-componizer', {
      // content: fast-glob string or array
      // default: tailwindcss.config.js content, it will require the config file from the current working directory

      // scrapeComponents: function which is used to scrape components from the content
      // default: utils/components.js#scrapeComponents

      // scrapeComponentsFunctionOptions: object which is passed to the scrapeComponents function,
      // default: {
      //   twcPattern: /(twc\/[^\s`'":]+)(?::([^\s`'"]+))?/g, regex which is used to find TWC components
      //   twcIdentifierToSelector: utils/css.js#twcIdentifierToSelector, function which transforms a TWC identifier to a CSS selector
      // }

      // transformComponentsToCssFunction: function which is used to transform the extracted components to CSS
      // default: utils/css.js#transformComponentsToCss

      // appendCss: boolean which determines if the CSS should be appended to the TailwindCSS entry file
      // default: false -> the components will be prepended
    })
  ]
}
```

---

## FAQ

### Why don't you support all layer directives?

I don't see any benefit in creating TailwindCSS base styles or utility classes within template files directly, as these aren't really template specific.

The main pain point for me was the inability to create TailwindCSS components directly within their template files. I'm open for feedback! :D

### Why is option a/b/c missing?

Open an issue and let me know! :))

### How can I contribute?

Check out the [contributing guidelines](CONTRIBUTING.md)!
