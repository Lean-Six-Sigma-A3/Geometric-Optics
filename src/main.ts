import { Canvas } from './components/canvas'
import { LineGroup } from './components/line-group'
import { Mirror } from './components/mirror'
import { presetCoordinates, PresetKey } from './presets/coordinates.ts'

import './styles/main.css'

// Ambil elemen 'canvas' yang ada di index.html
const canvasEl = document.querySelector<HTMLCanvasElement>('#canvas')!

// Buat object dari class Canvas
const canvas = new Canvas({
  canvasEl: canvasEl,
})

// Parsing koordinat menjadi object Line (untuk ditampilkan)
// [x1, y1, x2, y2]
const currentPreset: PresetKey = 'cyberTruck';
const coordinates = presetCoordinates[currentPreset];

const mirrorObject = LineGroup.fromCoordinates(coordinates, { x: -100, y: 50, scale: 1 })

// Buat object Mirror, Mirror ini (nantinya) berisi logic utama cerminnya
const mirror = new Mirror({
  canvas: canvas,
  mirrorObject: mirrorObject,
  controlEl: {
    objectX: document.querySelector<HTMLInputElement>('#pos-x')!,
    objectY: document.querySelector<HTMLInputElement>('#pos-y')!,
    scale: document.querySelector<HTMLInputElement>('#scale')!,
    focalDistance: document.querySelector<HTMLInputElement>('#focal-distance')!,
  }
})