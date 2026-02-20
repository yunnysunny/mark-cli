import sharp from 'sharp'
import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { writeFile } from 'fs/promises';
import { mathjax } from 'mathjax-full/js/mathjax.js'
import { TeX } from 'mathjax-full/js/input/tex.js'
import { SVG } from 'mathjax-full/js/output/svg.js'
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js'
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js'

import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const scriptPath = path.join(__dirname, 'sharp-process.mjs')

// 1. adaptor
const adaptor = liteAdaptor()
RegisterHTMLHandler(adaptor)

// 2. TeX 输入
const tex = new TeX({
  packages: ['base', 'ams'],
})

// 3. SVG 输出
const svg = new SVG({
  fontCache: 'none', // 每个 SVG 独立
})

// 4. 创建文档
const html = mathjax.document('', {
  InputJax: tex,
  OutputJax: svg,
})
function md5(data) {
  return crypto.createHash('md5')
    .update(data)
    .digest('hex');
}
export function mathToSvg(latex) {
  const node = html.convert(latex, {
    display: true,
  })
  const svg = adaptor.firstChild(node)
  return adaptor.outerHTML(svg)
}

export function mathToPng(
  latex,
) {
    const expression = encodeURIComponent(latex);
    return `https://latex.codecogs.com/png.image?${expression}`;
}

export async function mathToPngBuffer(latex) {
  const svg = mathToSvg(latex)
  const png = await sharp(Buffer.from(svg))
    .png()
    .toBuffer()
  return png
}



export function math2PngFileSync(latex, basePath) {
  const svg = mathToSvg(latex)
  const filename = md5(latex)
  const pathSaved = path.join(basePath, `${filename}.svg`)
  fs.writeFileSync(pathSaved, svg)
  const pathPng = pathSaved.replace('.svg', '.png') 
  const result = spawnSync(process.execPath, [scriptPath, '-i', pathSaved, '-o', pathPng], {
    encoding: 'utf-8',
    shell: true   // Windows 关键
  })
  if (result.status !== 0) {
    throw new Error(`${result.status} Failed to convert SVG to PNG: ${result.stderr?.toString()}, ${result.stdout?.toString()}`)
  }
  fs.unlinkSync(pathSaved)
  return pathPng
}

export async function mathToLocalPng(latex, basePath) {
  const png = await mathToPngBuffer(latex)
  const filename = md5(latex)
  const pathSaved = path.join(basePath, `${filename}.png`)
  await writeFile(pathSaved, png)
  return pathSaved
}