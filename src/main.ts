import { Canvas } from './components/canvas'
import { LineGroup } from './components/line-group'
import { Mirror } from './components/mirror'

import './styles/main.css'

// Ambil elemen 'canvas' yang ada di index.html
const canvasEl = document.querySelector<HTMLCanvasElement>('#canvas')!

// Buat object dari class Canvas
const canvas = new Canvas({
  canvasEl: canvasEl,
  width: 800,
  height: 600,
})

// Parsing koordinat menjadi object Line (untuk ditampilkan)
// const coordinates = [[40, 0, 60, 0],[40, 20, 60, 20],[40, 0, 40, 20],[60, 10, 60, 30],[20, 40, 40, 30],[60, 30, 80, 40],[10, 50, 20, 40],[80, 40, 90, 50],[0, 50, 100, 50],[0, 50, 0, 60],[0, 50, 100, 60],[0, 60, 100, 60],[10, 60, 10, 90],[90, 60, 90, 90],[0, 90, 100, 90],[0, 90, 0, 100],[0, 90, 100, 100],[0, 100, 100, 100],[10, 100, 10, 130],[90, 100, 90, 130],[0, 90, 100, 90],[0, 90, 0, 100],[0, 90, 100, 100],[0, 100, 100, 100],[10, 100, 20, 110],[80, 110, 90, 100],[20, 110, 80, 110]]
const coordinates = [[110, 80, 160, 0], [90, 60, 160, 0], [70, 40, 160, 0], [50, 20, 160, 0], [0, 0, 100, 0], [90, 100, 110, 60]]
const mirrorObject = LineGroup.fromCoordinates(coordinates)

// Buat object Mirror, Mirror ini (nantinya) berisi logic utama cerminnya
const mirror = new Mirror({
  canvas: canvas,
  mirrorObject: mirrorObject,
  controlEl: {
    distance: document.querySelector<HTMLInputElement>('#distance')!
  }
})