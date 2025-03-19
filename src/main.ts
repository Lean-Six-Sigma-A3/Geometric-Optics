import { Canvas } from './components/canvas'
import { LineGroup } from './components/line-group'
import { Mirror } from './components/mirror'
import { presetCoordinates, PresetKey } from './presets/coordinates.ts'

import './styles/main.css'

// Ambil elemen 'canvas' yang ada di index.html
const canvasEl = document.querySelector<HTMLCanvasElement>('#canvas')!
const presetSelector = document.querySelector<HTMLSelectElement>('#model-preset')!

// Populate preset selector
Object.keys(presetCoordinates).forEach(preset => {
  const option = document.createElement('option');
  option.value = preset;
  option.textContent = preset.charAt(0).toUpperCase() + preset.slice(1); // Capitalize first letter
  presetSelector.appendChild(option);
});

// Buat object dari class Canvas
const canvas = new Canvas({
  canvasEl: canvasEl,
})

// define control elements
const controlElements = {
  objectX: document.querySelector<HTMLInputElement>('#pos-x')!,
  objectY: document.querySelector<HTMLInputElement>('#pos-y')!,
  scale: document.querySelector<HTMLInputElement>('#scale')!,
  focalDistance: document.querySelector<HTMLInputElement>('#focal-distance')!,
};


// Parsing koordinat menjadi object Line (untuk ditampilkan)
// [x1, y1, x2, y2]
let currentPreset: PresetKey = 'cyberTruck';
presetSelector.value = currentPreset;

let mirrorObject = LineGroup.fromCoordinates(
  presetCoordinates[currentPreset],
  { x: -100, y: 50, scale: 1 }
);

// Buat object Mirror, Mirror ini (nantinya) berisi logic utama cerminnya
const mirror = new Mirror({
  canvas: canvas,
  mirrorObject: mirrorObject,
  controlEl: controlElements
});

presetSelector.addEventListener('change', () => {
  currentPreset = presetSelector.value as PresetKey;
  
  // Update mirror object with new preset
  mirrorObject = LineGroup.fromCoordinates(
    presetCoordinates[currentPreset], 
    { 
      x: parseFloat(controlElements.objectX.value), 
      y: parseFloat(controlElements.objectY.value), 
      scale: parseFloat(controlElements.scale.value) 
    }
  );
  
  // Update mirror with new object
  mirror.updateObject(mirrorObject);
});