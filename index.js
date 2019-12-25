/* (C) 2019 Alex Kizer. All rights reserved. ISC License */

const sp = n => ` `.repeat(n);

const escape = new Function('string', `${sp(2)}return string` + (['& &amp;', '< &lt;', '> &gt;', '" &quot;', '\' &#039']
	.map(s => s.split(` `))
  .map(p => [new RegExp(p[0], 'g'), p[1]])
  .map(p => `\n${sp(4)}.replace(${p[0]}, '${p[1]}')`)
  .join('')) + `;`);

const tagsNoClose = ['br'];

const toHtml = (element, strings = [], indentation = 0, insidePre = false) => {
  const write = s => (strings.push(s), s),
  	writeIndented = s => write(`${sp(indentation * 4)}${s}`);
  if (element.text) {
  	// TODO do not escape text inside `pre` elements. `code`?
    writeIndented(insidePre ? element.text : escape(element.text));
    write('\n');
    return;
  }
  writeIndented(`<${element.name} `);
  let attrsStr = Object.entries(element.attributes)
  	.map(([k, v]) => `${k}="${v}"`)
  	.join(` `);
  write(`${attrsStr}>\n`);
  (element.children || []).map(el => toHtml(el, strings, indentation + 1, element.name === `pre`));
  // TODO some tags options close - check
  if (!(element.name in tagsNoClose)) {
  	writeIndented(`</${element.name}>\n`);
  }
  return strings.join('');
};