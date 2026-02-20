import { describe, it } from 'vitest';
import fs from 'fs';
import { mathToPng, mathToSvg, mathToPngBuffer, math2PngFileSync } from '../src/lib/math-to-image.mjs';
describe('math-to-image', () => {
  // it('mathToSvg', async () => {
  //   const svg = mathToSvg('\\int_0^\\infty x^2 dx')
  //   console.log(svg)
  // })
  it('mathToPng', async () => {
    // console.log(svg)

    const png = mathToPng('\\dpi{200}\\int_0^\\infty x^2 dx')
    console.log(png)
  })
  it('mathToSvg', async () => {
    // console.log(svg)

    const png = mathToSvg('R_r \\propto (面积 / λ²)^2')
    console.log(png)
  })
  it('mathToPngLocal', async () => {
    const png = await mathToPngBuffer('R_r \\propto (面积 / λ²)^2')
    fs.writeFileSync('test.png', png)
  })
  it('math2PngFileSync', async () => {
    const png = math2PngFileSync('R_r \\propto (面积 / λ²)^2', 'test')
    console.log(png)
  })
})

