import MarkdownIt from 'markdown-it'
import mathjax3 from 'markdown-it-mathjax3'

const md = new MarkdownIt({
  html: false,
  breaks: false,
})
md.use(mathjax3)
/**
 * Render inline markdown-it tokens into a UBB formatted string.
 *
 * This function accepts an array of inline Token objects produced by
 * markdown-it (typically `token.children` for an `inline` token) and
 * converts supported inline token types into their equivalent UBB
 * representation (text, emphasis, strong, strikethrough, code, links,
 * images, and line breaks). Nested inline tokens are handled recursively
 * by calling `renderInline` on `token.children` when present.
 *
 * @param {import('markdown-it/lib/token.mjs').default[]} tokens - Array of inline Token objects
 * @param {import('../types/typing').Mark2UBBOptions} [options={}] - Optional settings for rendering
 * @returns {string} The UBB formatted string produced from the inline tokens
 */
function renderInline(tokens, options = {}) {
  let result = ''

  for (const token of tokens) {
    switch (token.type) {
      case 'text':
        result += token.content
        break

      case 'strong_open':
        result += '[b]'
        break
      case 'strong_close':
        result += '[/b]'
        break

      case 'em_open':
        result += '[i]'
        break
      case 'em_close':
        result += '[/i]'
        break

      case 's_open':
        result += '[s]'
        break
      case 's_close':
        result += '[/s]'
        break

      case 'code_inline':
        result += `[code]${token.content}[/code]`
        break

      case 'link_open': {
        const href = token.attrGet('href')
        result += `[url=${href}]`
        break
      }
      case 'link_close':
        result += '[/url]'
        break

      case 'image': {
        const src = token.attrGet('src')
        let newSrc = src

        if (options.relativeImageBaseUrl && src && !/^https?:\/\//i.test(src)) {
          newSrc = new URL(src, options.relativeImageBaseUrl).href          
        }
        result += `[img]${newSrc}[/img]`
        break
      }

      case 'softbreak':
      case 'hardbreak':
        result += '\n'
        break

      default:
        if (token.children) {
          result += renderInline(token.children)
        }
    }
  }

  return result
}
/**
 * 
 * @param {string} markdown 
 * @param {import('../types/typing').Mark2UBBOptions} options
 * @returns {string}
 */
export function markdownToUBB(markdown, options = {}) {
  const tokens = md.parse(markdown, {})
  let output = ''

  const listStack = []

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    switch (token.type) {
      // =====================
      // 标题
      // =====================
      case 'heading_open': {
        const level = Number(token.tag.slice(1))
        const size = Math.max(2, 7 - level)
        output += `[size=${size}][b]`
        break
      }
      case 'heading_close':
        output += '[/b][/size]\n\n'
        break

      // =====================
      // 段落
      // =====================
      case 'paragraph_open':
        break
      case 'paragraph_close':
        output += '\n\n'
        break

      // =====================
      // 引用
      // =====================
      case 'blockquote_open':
        output += '[quote]\n'
        break
      case 'blockquote_close':
        output += '\n[/quote]\n\n'
        break

      // =====================
      // 列表
      // =====================
      case 'bullet_list_open':
        listStack.push('ul')
        output += '[list]\n'
        break

      case 'ordered_list_open':
        listStack.push('ol')
        output += '[list=1]\n'
        break

      case 'list_item_open':
        output += '[*]'
        break

      case 'list_item_close':
        output += '\n'
        break

      case 'bullet_list_close':
      case 'ordered_list_close':
        listStack.pop()
        output += '[/list]\n'
        break

      // =====================
      // 代码块
      // =====================
      case 'fence':
        output += `[code]\n${token.content}[/code]\n\n`
        break
      // ---------- table ----------
      case 'table_open':
        output += '[table]\n'
        break
      case 'table_close':
        output += '[/table]\n\n'
        break

      case 'thead_open':
      case 'tbody_open':
      case 'thead_close':
      case 'tbody_close':
        break

      case 'tr_open':
        output += '[tr]'
        break
      case 'tr_close':
        output += '[/tr]\n'
        break

      case 'th_open':
        output += '[th]'
        break
      case 'th_close':
        output += '[/th]'
        break

      case 'td_open':
        output += '[td]'
        break
      case 'td_close':
        output += '[/td]'
        break
      // =====================
      // inline 内容
      // =====================
      case 'inline':
        output += renderInline(token.children, options)
        break

      // =====================
      // 忽略
      // =====================
      default:
        break
    }
  }

  return output.trim()
}

// // CLI
// if (require.main === module) {
//   const fs = require('fs')
//   const input = process.argv[2]
//   const output = process.argv[3]

//   if (!input) {
//     console.error('Usage: node md-it-to-ubb.js input.md [output.ubb]')
//     process.exit(1)
//   }

//   const mdText = fs.readFileSync(input, 'utf8')
//   const ubb = markdownToUBB(mdText)

//   if (output) {
//     fs.writeFileSync(output, ubb)
//   } else {
//     console.log(ubb)
//   }
// }

// module.exports = markdownToUBB
