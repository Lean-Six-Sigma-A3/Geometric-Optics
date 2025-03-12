import { Canvas } from './components/canvas'
import { LineGroup } from './components/line-group'
import { Mirror } from './components/mirror'

import './styles/main.css'

// Ambil elemen 'canvas' yang ada di index.html
const canvasEl = document.querySelector<HTMLCanvasElement>('#canvas')!

// Buat object dari class Canvas
const canvas = new Canvas({
  canvasEl: canvasEl,
})

// Parsing koordinat menjadi object Line (untuk ditampilkan)
// [x1, y1, x2, y2]
const coordinates = [
  [60, 80, 110, 0],
  [40, 60, 110, 0],
  [20, 40, 110, 0], 
  [0, 20, 110, 0], 
  [60, 80, 40, 60], 
  [40, 60, 25, 75], 
  [25, 75, 45, 64], 
  [25, 75, 20, 40], 
  [20, 40, 0, 20],
]

const mirrorObject = LineGroup.fromCoordinates(coordinates, { scale: 2 })

// Buat object Mirror, Mirror ini (nantinya) berisi logic utama cerminnya
const mirror = new Mirror({
  canvas: canvas,
  mirrorObject: mirrorObject,
  controlEl: {
    distance: document.querySelector<HTMLInputElement>('#distance')!
  }
})