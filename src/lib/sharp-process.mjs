import minimist from 'minimist'
import sharp from 'sharp'

const args = minimist(process.argv.slice(2), {
    alias: {
      i: 'input',
      o: 'output'
    },
    string: ['i', 'o'],
})
if (!args.input || !args.output) {
    console.error('Usage: node cli.js -i input.jpg -o output.png')
    process.exit(1)
}

await sharp(args.input)
  .toFile(args.output)

console.log('Done!')