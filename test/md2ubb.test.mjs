// test code for md2ubb.mjs
import { describe, it } from 'vitest';
import { markdownToUBB } from '../src/md2ubb.mjs';
describe('markdownToUBB', () => {
    const md = `
# Title
Here is some *italic* text and some **bold** text. \`inline code\`

Here is a [link](https://example.com) and an image:
![Alt text](./images/picture.png)

\`\`\`js
console.log('Hello, world!');
\`\`\`

Here is some ~~strikethrough~~ text.

Here is inline math: $E=mc^2$

And a block math:
$$
\\int_0^\\infty e^{-x} dx = 1
$$
`;
    it('basic', async () => {
        const ubb = markdownToUBB(md, {
            relativeImageBaseUrl: 'https://example.com/assets/',
        });
        console.log(ubb);
    });
    it('math2pngPath', async () => {
        const ubb = markdownToUBB(md, {
            relativeImageBaseUrl: 'https://example.com/assets/',
            math2pngPath: '.',
        });
        console.log(ubb);
    });
});