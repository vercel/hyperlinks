# hyperlinks

Extension for [HyperTerm](https://hyperterm.org) that automatically links URLs.

![Demo](https://cloud.githubusercontent.com/assets/775227/16933009/4fd309a0-4d85-11e6-99b5-720185f4b7d8.gif)

## How to use

[Install HyperTerm](https://hyperterm.org/#installation) and add `hyperlinks` to `plugins`
in `~/.hyperterm.js`.

- focus on the HyperTerm window and `Ctrl + C` to abort opening url.
- hold `Command` key and click a link to open it in your default browser.

## Customizing styles

Add cutome styles to `termCSS` in your `~/.hyperterm.js`.

```js
termCSS: `
  x-screen a {
    color: blue;
  }

  x-screen a.hover {
    text-decoration: none;
  }
`
```


## License

MIT
