#!/usr/bin/env node

import fs from 'fs'
import { Command } from 'commander'
import { markdownToUBB } from './index.mjs'

const program = new Command()

program
  .name('md2ubb')
  .argument('<file>', 'markdown file')
  .option('-o, --output <file>', 'output file')
  .option('-u, --image-base-url <url>', 'base URL for relative images')
  .option('-k, --upload-key <key>', '[imageride] upload key for image hosting service')

program.parse()

const input = program.args[0]
// const filename = input.split('/').pop().split('.').slice(0, -1).join('.')
const opts = program.opts()
const output = opts.output

const md = fs.readFileSync(input, 'utf8')
const ubb = markdownToUBB(md, {
    relativeImageBaseUrl: opts.imageBaseUrl,
    uploadKey: opts.uploadKey,
})

if (output) {
  fs.writeFileSync(output, ubb)
} else {
  console.log(ubb)
}
