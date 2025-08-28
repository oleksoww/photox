const canvas = new fabric.Canvas('canvas', {
  width: 800,
  height: 500,
  backgroundColor: 'white'
});

// Stan narzędzi
let isBrush = false;
let isEraser = false;

// Dodawanie prostokątnej warstwy
document.getElementById('addLayer').addEventListener('click', () => {
  const rect = new fabric.Rect({
    width: 100,
    height: 100,
    fill: 'rgba(0, 0, 255, 0.5)',
    left: 50,
    top: 50
  });
  canvas.add(rect);
});

// Dodawanie tekstu
document.getElementById('addText').addEventListener('click', () => {
  const font = document.getElementById('fontSelect').value;
  const text = new fabric.Textbox('Nowy tekst', {
    left: 100,
    top: 100,
    fontSize: 24,
    fontFamily: font,
    fill: 'black'
  });
  canvas.add(text);
});

// Import obrazu
document.getElementById('uploadImage').addEventListener('change', (e) => {
  const reader = new FileReader();
  reader.onload = function (event) {
    fabric.Image.fromURL(event.target.result, (img) => {
      img.scaleToWidth(400);
      canvas.add(img);
    });
  };
  reader.readAsDataURL(e.target.files[0]);
});

// Pędzel
document.getElementById('brush').addEventListener('click', () => {
  isBrush = true;
  isEraser = false;
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = document.getElementById('brushColor').value;
  canvas.freeDrawingBrush.width = parseInt(document.getElementById('brushSize').value);
});

// Gumka
document.getElementById('eraser').addEventListener('click', () => {
  isBrush = false;
  isEraser = true;
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = 'white';
  canvas.freeDrawingBrush.width = parseInt(document.getElementById('brushSize').value);
});

// Filtry obrazu
function applyFilters() {
  const activeObject = canvas.getActiveObject();
  if (!activeObject || !activeObject.filters) return;

  const brightness = parseFloat(document.getElementById('brightness').value);
  const contrast = parseFloat(document.getElementById('contrast').value);
  const saturation = parseFloat(document.getElementById('saturation').value);
  const blur = parseFloat(document.getElementById('blur').value);

  activeObject.filters = [
    new fabric.Image.filters.Brightness({ brightness }),
    new fabric.Image.filters.Contrast({ contrast }),
    new fabric.Image.filters.Saturation({ saturation }),
    new fabric.Image.filters.Blur({ blur })
  ];

  activeObject.applyFilters();
  canvas.renderAll();
}

['brightness', 'contrast', 'saturation', 'blur'].forEach(id => {
  document.getElementById(id).addEventListener('input', applyFilters);
});

// Zapis obrazu
document.getElementById('saveImage').addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = canvas.toDataURL({ format: 'png' });
  link.download = 'projekt_photox.png';
  link.click();
});
