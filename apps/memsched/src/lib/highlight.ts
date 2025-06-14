// Using ES6 import syntax
import hljs from 'highlight.js/lib/core';
import html from 'highlight.js/lib/languages/xml';

// Then register the languages you need
hljs.registerLanguage('html', html);

export default hljs;
