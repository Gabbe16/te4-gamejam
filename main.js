import './node_modules/modern-css-reset/dist/reset.min.css'
import './src/assets/css/style.css'
import { setup } from './src/setup.js'
import { apiSetup } from './src/apitest.js'

document.querySelector('#app').innerHTML = `
  <canvas id="canvas1"></canvas>
  <div id="content"></div>
`

setup(document.querySelector('#canvas1'))
apiSetup(document.querySelector('#content'))