import { open, readdir } from 'node:fs/promises'
import { filenameToId, writeToFile } from './shared.mjs'

async function generateContent(svg_dir) {
  let filehandle
  let svg = '<svg width="24" height="24" viewBox="0 0 24 24" class="ds-svg-icon" xmlns="http://www.w3.org/2000/svg">'
  try {
    const files = await readdir(svg_dir)
    for (const file of files) {

      try {
        filehandle = await open(`${ svg_dir }/${ file }`, 'r+')
        filehandle.readFile('utf8').then(async function(svgContent) {

          // This is where the magic happens
          svg += await buildSVGsnippet(svgContent, file)
        })
      } catch (error) {
        console.error('there was an error:', error.message)
      } finally {
        await filehandle?.close()
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    svg += '</svg>'
    return svg
  }
}

async function buildSVGsnippet(svg, filename) {
  const id = filenameToId(filename)
  const svgRegex = /<svg.*?>|<\/svg>|\t|\n|\r/g
  const viewBoxRegex = /viewBox="[\d\s]+"/
  const viewBoxAttr = svg.match(viewBoxRegex)
  const newSvg = svg.replaceAll(svgRegex, '')
  return `<symbol id="${ id }" width="100%" height="100%" ${ viewBoxAttr[0] }>${ newSvg }</symbol>`
}

export async function buildSVG() {
  console.log('Building SVG sprites')

  // Build SVG
  let markup = await generateContent('./icons/svg')

  // Write SVG file
  await writeToFile(markup, './icons/icon-sprites.svg')

  console.log('Done 👍')
}
