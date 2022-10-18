import { open, readdir } from 'node:fs/promises'

function sanitizeFilename(filename) {
  return filename.replace('.svg', '').replaceAll('_', '-')
}

async function readHTML(path) {
  let filehandle
  let html = ''
  try {
    filehandle = await open(path, 'r+')
    filehandle.readFile('utf8').then(function(contents) {
      html += contents
    })
  } catch (error) {
    console.error('there was an error:', error.message)
  } finally {
    await filehandle?.close()
    return html
  }
}

async function generateContent(svg_dir) {
  let filehandle
  let html = ''
  let toc = '<nav>'
  let index_css = ''
  try {
    const files = await readdir(svg_dir)
    for (const file of files) {

      try {
        filehandle = await open(`${ svg_dir }/${ file }`, 'r+')
        filehandle.readFile('utf8').then(async function(svg) {

          // This is where the magic happens
          html += await buildHTMLsnippet(file, svg)
          toc += await buildTOCsnippet(file, svg)
          await writeCSSsnippet(file, svg)
        })
      } catch (error) {
        console.error('there was an error:', error.message)
      } finally {
        await filehandle?.close()
      }
      // Update index CSS
      index_css += addCSStoIndex(file)
    }
  } catch (err) {
    console.error(err)
  } finally {
    toc += '</nav>'
    return [html, toc, index_css]
  }
}

async function buildHTMLsnippet(filename, svg) {
  const shortname = sanitizeFilename(filename)
  const html = `
  <article id="${ shortname }" class="icon-details">
    <h2>
      <span class="display-svg">${ svg }</span> <span>${ shortname }</span>
    </h2> 
    <div class="icon-container">  
      <div>
        <h3 class="h5">CSS</h3>
        <pre><code>@import "@dataforsyningen/icons/css/${ shortname }.css";</code></pre>
        <p>Brug i HTML:</p>
        <pre><code>&lt;span class="ds-icon-${ shortname }">&lt;/span></code></pre>
        <p>CSS custom property:</p>
        <pre><code>--ds-${ shortname }</code></pre>
        <h3 class="h5">SVG</h3>
        <pre><code>${ svg.replaceAll('<', '&lt;') }</code></pre>
      </div>
    </div>
    <a href="#content-top">Til oversigt</a>
  </article>
  `
  return html
}

async function buildTOCsnippet(filename, svg) {
  const shortname = sanitizeFilename(filename)
  const html = `
    <a href="#${ shortname }">${ svg }</a>
  `
  return html
}

async function writeCSSsnippet(filename, svg) {
  const shortname = sanitizeFilename(filename)
  const escaped_svg = encodeURIComponent(svg.replace(/(\r\n)+/gi, ''))
  const css = `
    :root {
      --ds-${ shortname }: url('data:image/svg+xml;utf8,${ escaped_svg }');
    }
    .ds-icon-${ shortname }::before {
      background-image: var(--ds-${ shortname });
    }
  `
  let filehandle
  try {
    filehandle = await open(`./css/${ sanitizeFilename(filename) }.css`, 'w')
    filehandle.writeFile(css, 'utf8')
  } catch (error) {
    console.error('there was an error:', error.message)
  } finally {
    await filehandle?.close()
  }
}

function addCSStoIndex(filename) {
  return `
@import "css/${ sanitizeFilename(filename) }.css";
  `
}

async function writeHTML(html) {
  let filehandle
  try {
    filehandle = await open('./docs/index.html', 'w')
    filehandle.writeFile(html, 'utf8').then(function() {
      // File was written
    })
  } catch (error) {
    console.error('there was an error:', error.message)
  } finally {
    await filehandle?.close()
  }
}

async function writeIndexCSS(css) {
  let filehandle
  try {
    filehandle = await open('./index.css', 'w')
    filehandle.writeFile(css, 'utf8').then(function() {
      // File was written
    })
  } catch (error) {
    console.error('there was an error:', error.message)
  } finally {
    await filehandle?.close()
  }
}

console.log('Building documentation and rebuilding CSS')

// Build HTML
let markup = ''
let icon_content = await generateContent('./icons/svg')
let logo_content = await generateContent('./logos/svg')

markup += await readHTML('./utils/docs-src/header.html')
markup += '<h2>Ikoner</h2>'
markup += icon_content[1]
markup += '<h2>Logo</h2>'
markup += logo_content[1]
markup += await readHTML('./utils/docs-src/instructions.html')
markup += icon_content[0]
markup += logo_content[0]
markup += await readHTML('./utils/docs-src/footer.html')

// Write HTML file
await writeHTML(markup)

// Write new index CSS file
const index_css = icon_content[2] + logo_content[2]
await writeIndexCSS(index_css)

console.log('Done 👍')
