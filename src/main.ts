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
  [5, -40, 55, 40],
  [-15, -20, 55, 40],
  [-35, 0, 55, 40],
  [-55, 20, 55, 40],
  [5, -40, -15, -20],
  [-15, -20, -30, -35],
  [-30, -35, -10, -25],
  [-30, -35, -35, 0],
  [-35, 0, -55, 20],
]

// const coordinates = [
//   [-50, 70, 50, 50],
//   [50, 50, 50, -50],
//   [50, -50, -50, -50],
//   [-50, -50, -50, 70],
// ]

const mirrorObject = LineGroup.fromCoordinates(coordinates, { x: -100, y: 50, scale: 1 })

// Buat object Mirror, Mirror ini (nantinya) berisi logic utama cerminnya
const mirror = new Mirror({
  canvas: canvas,
  mirrorObject: mirrorObject,
  controlEl: {
    objectX: document.querySelector<HTMLInputElement>('#distance')!,
    scale: document.querySelector<HTMLInputElement>('#scale')!,
  }
})