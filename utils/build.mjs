import { buildCSS } from './build-scripts/build-css.mjs'
import { buildSVG } from './build-scripts/build-svg.mjs'

await buildCSS()
await buildSVG()
