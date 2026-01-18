# mark-cli
A collection of command-line tools for processing Markdown files.
## Available Tools
- `md2ubb`: Convert Markdown files to UBB code.
- `mdd`: Enhanced Markdown to support math rendering and add prefix for relative links.

## Installation
You can install the tools using npm:
```
npm install -g @whyun-master/mark-cli
```
## Usage
### md2ubb
```
md2ubb <file> [options]
```
Convert a Markdown file to UBB code.

**Options:**
- `-o, --output <file>`: Specify the output file. If not provided, output will be printed to the console.
- `-u, --image-base-url <url>`: Base URL for relative images.


### mdd
```
mdd <file> [options]
```

Enhanced Markdown processor with math rendering support.

**Options:**
- `-o, --output <file>`: Specify the output file. If not provided, output will be printed to the console.
- `-u, --image-base-url <url>`: Base URL for relative images.
- `-p, --math2png`: Convert math expressions to PNG images.

## License
MIT [License](LICENSE)