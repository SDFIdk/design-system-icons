import { open, readdir } from 'node:fs/promises'

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

async function generateContent() {
  let filehandle
  let html = ''
  let toc = '<nav>'
  let index_css = ''
  try {
    const files = await readdir('./icons/svg')
    for (const file of files) {

      try {
        filehandle = await open(`./icons/svg/${ file }`, 'r+')
        filehandle.readFile('utf8').then(async function(svg) {

          // This is where the magic happens
          html += await buildHTMLsnippet(file, svg)
          toc += await buildTOCsnippet(file, svg)
          await writeCSSsnippet(file, svg)
          index_css += addCSStoIndex(file)
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
    toc += '</nav>'
    return [html, toc, index_css]
  }
}

async function buildHTMLsnippet(filename, svg) {
  const shortname = filename.replace('.svg', '').replaceAll('_', '-')
  const html = `
  <article id="${ shortname }" class="icon-details">
    <h2>
      <span class="display-svg">${ svg }</span> <span>${ shortname }</span>
    </h2> 
    <div class="icon-container">  
      <div>
        <h3 class="h5">CSS</h3>
        <pre><code>@import "${ shortname }.css"</code></pre>
        <p>Brug i HTML:</p>
        <pre><code>&lt;span class="ds-${ shortname }">&lt;/span></code></pre>
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
  const shortname = filename.replace('.svg', '').replaceAll('_', '-')
  const html = `
    <a href="#${ shortname }">${ svg }</a>
  `
  return html
}

async function writeCSSsnippet(filename, svg) {
  const shortname = filename.replace('.svg', '').replaceAll('_', '-')
  const escaped_svg = encodeURIComponent(svg.replace(/(\r\n)+/gi, ''))
  const css = `
    :root {
      --ds-${ shortname }: url('data:image/svg+xml;utf8,${ escaped_svg }');
    }
    .ds-${ shortname }::before {
      background-image: var(--ds-${ shortname });
    }
  `
  let filehandle
  try {
    filehandle = await open(`./icons/css/${ filename.replace('.svg', '.css').replaceAll('_', '-') }`, 'w')
    filehandle.writeFile(css, 'utf8')
  } catch (error) {
    console.error('there was an error:', error.message)
  } finally {
    await filehandle?.close()
  }
}

function addCSStoIndex(filename) {
  return `
@import "icons/css/${ filename }";
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

console.log('Building documentation and rebuildning CSS')

// Build HTML
let markup = ''
let content = await generateContent()

markup += await readHTML('./utils/docs-src/header.html')
markup += content[1]
markup += await readHTML('./utils/docs-src/instructions.html')
markup += content[0]
markup += await readHTML('./utils/docs-src/footer.html')

// Write HTML file
await writeHTML(markup)

// Write new index CSS file
await writeIndexCSS(content[2])

console.log('Done 👍')
