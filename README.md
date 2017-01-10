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

### Change link target
`defaultBrowser` (`boolean`)
Sets the location to open a clicked link. Holding the meta key while clicking will use the alternate target.

- true - <default> open links in the default browser
- false - opens link in the current Hyper pane

### Change click action
`clickAction` (`string`)
Changes the action performed when clicking on a link
If set, holding the meta key while clicking will open the link based on the defaultBrowser value.

- 'open' - <default> opens the link
- 'copy' - pastes the link to your clipboard
- 'ignore' - ignore non-Meta clicks on links

```js
module.exports = {
  ...
    config: {
    ...
    hyperlinks: {
      clickAction: 'ignore',
      defaultBrowser: false
    }
    ...
  }
  ...
}
```
