# hyperlinks

Extension for [Hyper](https://hyper.is) that automatically links URLs.

![Demo](https://cloud.githubusercontent.com/assets/775227/16933009/4fd309a0-4d85-11e6-99b5-720185f4b7d8.gif)

## Usage

[Install Hyper](https://hyper.is/#installation) and add `hyperlinks` to `plugins`
in `~/.hyper.js`.

- Focus on the Hyper window and `Ctrl + C` to abort opening url.
- Hold `Command` key and click a link to open it within Hyper (instead of in your default browser).

### Customizing styles

Add custom styles to `termCSS` in your `~/.hyper.js`.

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

## Configuration

### Setting for open a link in default browser

Open in default browser when click a link.
If holding Meta(Command) key then a link open in the Hyper.

Default is `true`.

### e.g.) Add below config to the `.hyper`.

```js
config: {
  hyperlinks: {
    defaultBrowser: false
  }
}
```
