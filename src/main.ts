import { Canvas } from './components/canvas'
import { LineGroup } from './components/line-group'
import { Mirror } from './components/mirror'
import { presetData, PresetKey } from './presets/coordinates.ts'

import './styles/main.css'

// Ambil elemen 'canvas' yang ada di index.html
const canvasEl = document.querySelector<HTMLCanvasElement>('#canvas')!
const presetSelector = document.querySelector<HTMLSelectElement>('#model-preset')!

// Populate preset selector
Object.keys(presetData).forEach(preset => {
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
  presetData[currentPreset].coordinates,
  {
    x: presetData[currentPreset].defaultX, 
    y: presetData[currentPreset].defaultY, 
    scale: presetData[currentPreset].defaultScale 
  }
  
);

controlElements.objectX.value = presetData[currentPreset].defaultX.toString();
controlElements.objectY.value = presetData[currentPreset].defaultY.toString();
controlElements.scale.value = presetData[currentPreset].defaultScale.toString();


// Buat object Mirror, Mirror ini (nantinya) berisi logic utama cerminnya
const mirror = new Mirror({
  canvas: canvas,
  mirrorObject: mirrorObject,
  controlEl: controlElements
});

//update minimum scale for each model

presetSelector.addEventListener('change', () => {
  currentPreset = presetSelector.value as PresetKey;
  

  // get preset's default values
  const defaultX = presetData[currentPreset].defaultX;
  const defaultY = presetData[currentPreset].defaultY;
  const defaultScale = presetData[currentPreset].defaultScale;

  
  controlElements.objectX.value = defaultX.toString();
  controlElements.objectY.value = defaultY.toString();

  // Update mirror object with new preset
  mirrorObject = LineGroup.fromCoordinates(
    presetData[currentPreset].coordinates,
    { 
      x: defaultX,
      y: defaultY,
      scale: defaultScale
    }
  );
  
  // Update mirror with new object
  mirror.updateObject(mirrorObject);
  mirror.updateScaleMinimum(presetData[currentPreset].defaultScale);
  controlElements.scale.value = defaultScale.toString();

});