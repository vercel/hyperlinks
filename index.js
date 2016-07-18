const { shell } = require('electron');
const escapeHTML = require('escape-html');
const emailRegex = require('email-regex');
const urlRegex = require('./url-regex');

const emailRe = emailRegex({ exact: true });

exports.getTermProps = function (uid, parentProps, props) {
  return Object.assign(props, { uid });
};

exports.decorateTerm = function (Term, { React }) {
  return class extends React.Component {
    constructor (props, context) {
      super(props, context);
      this.onTerminal = this.onTerminal.bind(this);
    }

    onTerminal (term) {
      if (this.props.onTerminal) {
        this.props.onTerminal(term);
      }

      const { screen_ } = term;
      const Screen = screen_.constructor;
      this.overrideScreen(Screen);

      const self = this;
      const { onTerminalReady } = term;
      term.onTerminalReady = function () {
        onTerminalReady.apply(this, arguments);

        const screenNode = term.scrollPort_.getScreenNode();
        screenNode.addEventListener('click', self.onLinkClick.bind(self));
      }
    }

    overrideScreen (Screen) {
      if (Screen._autolink) return;
      Screen._autolink = true;

      const self = this;

      const { insertString, deleteChars } = Screen.prototype;

      Screen.prototype.insertString = function () {
        const result = insertString.apply(this, arguments);
        self.autolink(this);
        return result;
      };

      Screen.prototype.deleteChars = function () {
        const result = deleteChars.apply(this, arguments);
        self.autolink(this);
        return result;
      };
    }

    autolink (screen) {
      let lastAnchor;

      const cursorRowNode = screen.cursorRowNode_;
      const previousCursorRowNode = cursorRowNode.previousSibling;
      if (previousCursorRowNode &&
        previousCursorRowNode.getAttribute('line-overflow') &&
        previousCursorRowNode.lastChild &&
        previousCursorRowNode.lastChild.lastChild &&
        'A' === previousCursorRowNode.lastChild.lastChild.nodeName) {
        // get last anchor from previous row
        lastAnchor = previousCursorRowNode.lastChild.lastChild;
      }

      const textContent = (lastAnchor ? lastAnchor.textContent : '')
        + screen.cursorNode_.textContent;

      let re = urlRegex();
      let autolinked = '';
      let lastIndex = 0;
      let match;

      while (match = re.exec(textContent)) {
        const url = match[0];
        const absoluteUrl = this.getAbsoluteUrl(url);
        const index = re.lastIndex - url.length;
        autolinked += escapeHTML(textContent.slice(lastIndex, index));
        lastIndex = re.lastIndex;

        let text;
        if (0 === index && lastAnchor) {
          text = url.slice(lastAnchor.textContent.length);
          lastAnchor.href = absoluteUrl;
        } else {
          text = url;
        }
        autolinked += `<a class="autolink"
href="${escapeHTML(absoluteUrl)}">${escapeHTML(text)}</a>`;
      }

      autolinked += escapeHTML(textContent.slice(lastIndex));

      let cursorNode = screen.cursorNode_;
      if ('#text' === cursorNode.nodeName) {
        // replace text node to element
        cursorNode = document.createElement('span');
        cursorRowNode.replaceChild(cursorNode, screen.cursorNode_);
        screen.cursorNode_ = cursorNode;
      }

      cursorNode.innerHTML = autolinked;
    }

    getAbsoluteUrl (url) {
      if (/^[a-z]+:\/\//.test(url)) return url;
      if (0 === url.indexOf('//')) return `http${url}`
      if (emailRe.test(url)) return `mailto:${url}`;
      return `http://${url}`;
    }

    onLinkClick (e) {
      if ('A' !== e.target.nodeName) return;

      e.preventDefault();

      if (e.metaKey) {
        // open in user's default browser when holding command key
        shell.openExternal(e.target.href);
      } else {
        store.dispatch({
          type: 'SESSION_URL_SET',
          uid: this.props.uid,
          url: e.target.href
        });
      }
    }

    render () {
      const props = Object.assign({}, this.props, {
        onTerminal: this.onTerminal,
        customCSS: styles + (this.props.customCSS || '')
      });
      return React.createElement(Term, props);
    }
  };
};

const styles = `
  .autolink {
    color: #ff2e88;
    text-decoration: none;
  }

  .autolink:hover {
    text-decoration: underline;
  }
`;
