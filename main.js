import './node_modules/modern-css-reset/dist/reset.min.css'
import './src/assets/css/style.css'
import { setup } from './src/setup.js'
import Api from './src/Api.js'

const api = new Api

document.querySelector('#app').innerHTML = `
  <canvas id="canvas1"></canvas>
  <div id="content"></div>
`

setup(document.querySelector('#canvas1'))
api.apiSetup(document.querySelector('#content'))