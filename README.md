# hyperlinks

Extension for [HyperTerm](https://hyperterm.org) that automatically links URLs.

![Demo](https://cloud.githubusercontent.com/assets/775227/16927068/a27b80ca-4d66-11e6-8547-c9d3c9311d8f.gif)

## How to use

[Install HyperTerm](https://hyperterm.org/#installation) and add `hyperlinks` to `plugins`
in `~/.hyperterm.js`.

- `Ctrl + C` to abort opening url.
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
