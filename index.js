/* (C) 2019 Alex Kizer. All rights reserved. ISC License */

const sp = n => ` `.repeat(n);

const escapes = ['& &amp;', '< &lt;', '> &gt;', '" &quot;', '\' &#039'];

const escape = new Function('string', `${sp(2)}return string${escapes
  .map(s => s.split(` `))
  .map(p => [new RegExp(p[0], 'g'), p[1]])
  .map(p => `\n${sp(4)}.replace(${p[0]}, '${p[1]}')`)
  .join('')};`);

const tagsNoClose = ['br'];

const toHtml = (element, strings = [], indentation = 0, insidePre = false, level = 0) => {
  const write = s => (strings.push(s), s), // will likely be inlined
    writeIndented = s => write(`${sp(indentation * 4)}${s}`), // will likely be inlined
    getRaw = s => String.raw`${s}`;
  typeof element.doctype === `string` && level === 0 && write(`<!DOCTYPE ${element.doctype}>\n`);
  let text;
  if ( (text = element.text || ((typeof element === `string`) ? element : undefined)) ) {

    // TODO escape text inside `code`?
    writeIndented(insidePre ? getRaw(text) : escape(text));
    write('\n');
    return;
  }
  writeIndented(`<${element.name} `);
  let attrsStr = Object.entries(element.attributes)
    .map(([k, v]) => `${k}="${v}"`)
    .join(` `);
  write(`${attrsStr}>\n`);
  (element.children || []).map(el => toHtml(el, strings, indentation + 1, insidePre || element.name === `pre`, level + 1));
  // TODO some tags optional close - check
  if (!(element.name in tagsNoClose)) {
    writeIndented(`</${element.name}>\n`);
  }
  return strings.join('');
};

export default toHtml;