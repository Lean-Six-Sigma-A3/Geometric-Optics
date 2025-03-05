import { Canvas } from "./components/canvas"
import { LineGroup } from "./components/line-group"
import { Mirror } from "./components/mirror"

import "./styles/main.css"

// Ambil elemen 'canvas' yang ada di index.html
const canvasEl = document.querySelector<HTMLCanvasElement>("#canvas")!

// Buat object dari class Canvas
const canvas = new Canvas({
  canvasEl: canvasEl,
  width: 800,
  height: 600,
})

// Parsing koordinat menjadi object Line (untuk ditampilkan)
// Did I ever tell you the definition of insanity is?
// This is the definition of Insanity
// cybertruck object
const coordinates = [
  [145, -5, 2.5, 42.5],
  [25, 50, 10, 80],
  [10, 80, 2.5, 42.5],
  [25, 50, 62.5, 50],
  [62.5, 50, 77.5, 72.5],
  [77.5, 72.5, 77.5, 92.5],
  [77.5, 92.5, 235, 92.5],
  [235, 92.5, 235, 65.5], // ban belakang singgang
  [255, 50.5, 235, 65.5], // ban belakang singgang
  [255, 50.5, 290, 50.5], // ban belakang singgang
  [290, 50.5, 325, 85.5], // ban belakang singgang
  [332.5, 27.5, 325, 85.5],
  [332.5, 27.5, 145, -5],
  [152.5, -5, 145, 35],
  [145, 35, 145, 85],
  [212.5, 11, 212.5, 35],
  [212.5, 35, 212.5, 85],
  [2.5, 42.5, 332.5, 27.5],
  [100, 12.5, 92.5, 50],
  [92.5, 50, 92.5, 85],
  [92.5, 85, 212.5, 85],
]

const mirrorObject = LineGroup.fromCoordinates(coordinates)

// Buat object Mirror, Mirror ini (nantinya) berisi logic utama cerminnya
const mirror = new Mirror({
  canvas: canvas,
  mirrorObject: mirrorObject,
  controlEl: {
    distance: document.querySelector<HTMLInputElement>("#distance")!,
  },
})
