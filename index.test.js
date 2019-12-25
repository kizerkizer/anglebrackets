import assert from 'assert';

import toHtml from './index.js';

let jsHtml = {
  doctype: 'html',
  name: 'div',
  attributes: {
    'class': 'foo bar',
    'style': 'border: 1px solid black; width: 128px; height: 128px;'
  },
  children: [
    {
      name: 'span',
      attributes: { 'id': 'my-span', 'style': 'color: blue;' },
      children: [
        'hello, "Charlie" & "Rosie"!',
        {
          name: 'pre',
          attributes: { 'style': 'font-size: 16px;' },
          children: [
            '<span>An exam\nple span; & the newline ignored!</span>'
          ]
        }
      ]
    }, {
      text: 'Some more text <wow>!'
    }]
};

let expectedOutput =
  `
<!DOCTYPE html>
<div class="foo bar" style="border: 1px solid black; width: 128px; height: 128px;">
    <span id="my-span" style="color: blue;">
        hello, &quot;Charlie&quot; &amp; &quot;Rosie&quot;!
        <pre style="font-size: 16px;">
            <span>An exam\nple span; & the newline ignored!</span>
        </pre>
    </span>
    Some more text &lt;wow&gt;!
</div>
`.trim();

assert.equal(toHtml(jsHtml).trim(), expectedOutput);

console.log(`pass`);