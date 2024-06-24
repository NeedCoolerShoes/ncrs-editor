// https://css-tricks.com/converting-color-spaces-in-javascript/
function RGBToHex(r,g,b) {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}

// https://stackoverflow.com/questions/21646738/convert-hex-to-rgba#28056903
function hexToRGB(hex, divisor = 1) {
  let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
  
  let a = 255;

  if (hex.length > 7) {
    a = parseInt(hex.slice(7, 9), 16);
  }

  return {r: r / divisor, g: g / divisor, b: b / divisor, a: a / divisor }
}

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

// https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
function sample(array) {
  return array[~~(Math.random() * array.length)];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeColor(R, G, B, percent) {

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;
  G = (G<255)?G:255;
  B = (B<255)?B:255;

  R = Math.round(R)
  G = Math.round(G)
  B = Math.round(B)

  return {r: R, g: G, b: B}
}

export {RGBToHex, hexToRGB, clamp, sample, getRandomInt, shadeColor};