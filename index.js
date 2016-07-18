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
      this.term = null
      this.id = 0;
    }

    onTerminal (term) {
      if (this.props.onTerminal) {
        this.props.onTerminal(term);
      }

      this.term = term;
      const { screen_, onTerminalReady } = term;

      this.overrideScreen(screen_.constructor);

      const self = this;
      term.onTerminalReady = function () {
        onTerminalReady.apply(this, arguments);

        const screenNode = term.scrollPort_.getScreenNode();
        screenNode.addEventListener('click', self.onLinkClick.bind(self));
        screenNode.addEventListener('mouseover', self.onLinkMouseOver.bind(self));
        screenNode.addEventListener('mouseout', self.onLinkMouseOut.bind(self));
      }
    }

    overrideScreen (Screen) {
      if (Screen._links) return;
      Screen._links = true;

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

        let id;
        let text;
        if (0 === index && lastAnchor) {
          text = url.slice(lastAnchor.textContent.length);
          lastAnchor.href = absoluteUrl;
          id = lastAnchor.dataset.id;
        } else {
          text = url;
          id = this.id++;
        }

        autolinked += `<a href="${escapeHTML(absoluteUrl)}" data-id="${id}">`
          + `${escapeHTML(text)}</a>`;
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

    onLinkMouseOver (e) {
      if ('A' !== e.target.nodeName) return;

      const { id } = e.target.dataset;
      for (const a of this.getAnchors(id)) {
        a.classList.add('hover');
      }
    }

    onLinkMouseOut (e) {
      if ('A' !== e.target.nodeName) return;

      const { id } = e.target.dataset;
      for (const a of this.getAnchors(id)) {
        a.classList.remove('hover');
      }
    }

    getAnchors (id) {
      const screenNode = this.term.scrollPort_.getScreenNode();
      return screenNode.querySelectorAll(`a[data-id="${id}"]`);
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
  x-screen a {
    color: #ff2e88;
    text-decoration: none;
  }

  x-screen a.hover {
    text-decoration: underline;
  }
`;
