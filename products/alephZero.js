const alephZero = {
  show: function(){
    console.log("|   \\      Made for more easy \n \\  |\\     code in JavaScript \n |\\ | \n | \\|      Made by JDPO \n |  \\   _ \n_|   | | | \n       |_|");
  },

  show_2: function(){
    const el = document.createElement("pre");
    el.innerHTML = "|   \\      Made for more easy \n \\  |\\     code in JavaScript \n |\\ | \n | \\|      Made by JDPO \n |  \\   _ \n_|   | | | \n       |_|";
    document.body.append(el);
  },

  // ✅ Suma de matrices
  matrixSum: function(a, b) {
    return a.map((h, i) =>
      h.map((value, j) => value + b[i][j])
    );
  },

  // ✅ Resta de matrices
  matrixRest: function(a, b) {
    return a.map((h, i) =>
      h.map((value, j) => value - b[i][j])
    );
  },

  // ✅ Producto elemento a elemento (Hadamard)
  matrixHadamard: function(a, b) {
    return a.map((fila, i) =>
      fila.map((valor, j) => valor * b[i][j])
    );
  },

  // ✅ Producto matricial clásico
  matrixProduct: function(a, b) {
    let filasA = a.length, colsA = a[0].length,
        filasB = b.length, colsB = b[0].length;

    if (colsA !== filasB) return null;

    let result = Array.from({ length: filasA }, () => Array(colsB).fill(0));

    for (let i = 0; i < filasA; i++) {
      for (let j = 0; j < colsB; j++) {
        for (let k = 0; k < colsA; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return result;
  },

  // ✅ Operaciones sobre vectores (tablas)
  sumTable: function(a, b){
    let result = [];
    for (let l = 0; l < a.length; l++) {
      result[l] = [];
      for (let m = 0; m < b.length; m++) {
        result[l][m] = a[l] + b[m];
      }
    }
    return result;
  },

  restTable: function(a, b){
    let result = [];
    for (let l = 0; l < a.length; l++) {
      result[l] = [];
      for (let m = 0; m < b.length; m++) {
        result[l][m] = a[l] - b[m];
      }
    }
    return result;
  },

  productTable: function(a, b){
    let result = [];
    for (let l = 0; l < a.length; l++) {
      result[l] = [];
      for (let m = 0; m < b.length; m++) {
        result[l][m] = a[l] * b[m];
      }
    }
    return result;
  },

  quotientTable: function(a, b){
    let result = [];
    for (let l = 0; l < a.length; l++) {
      result[l] = [];
      for (let m = 0; m < b.length; m++) {
        result[l][m] = a[l] / b[m];
      }
    }
    return result;
  },

  // ✅ Modelo de frecuencias para codificación aritmética
  buildModelFromText: function(text) {
    const freq = new Map();
    for (const ch of text) {
      freq.set(ch, (freq.get(ch) || 0) + 1);
    }
    const total = [...freq.values()].reduce((a, b) => a + b, 0);

    const symbols = [...freq.keys()].sort();
    const prob = new Map();
    for (const s of symbols) prob.set(s, freq.get(s) / total);

    const cdf = new Map();
    let cum = 0;
    for (const s of symbols) {
      cdf.set(s, { low: cum, high: cum + prob.get(s) });
      cum += prob.get(s);
    }

    return { symbols, prob, cdf };
  },

  // ✅ Codificación aritmética
  encode: function(text, model) {
    let low = 0.0;
    let high = 1.0;

    for (const ch of text) {
      const range = high - low;
      const { low: cLow, high: cHigh } = model.cdf.get(ch);
      high = low + range * cHigh;
      low = low + range * cLow;
    }
    const code = (low + high) / 2;
    return { code, model };
  },

  // ✅ Decodificación aritmética
  decode: function (code, model, length) {
    let low = 0.0;
    let high = 1.0;
    let out = '';

    for (let i = 0; i < length; i++) {
      const range = high - low;
      const value = (code - low) / range;

      let symbol = null;
      for (const s of model.symbols) {
        const { low: cLow, high: cHigh } = model.cdf.get(s);
        if (value >= cLow && value < cHigh) {
          symbol = s;
          high = low + range * cHigh;
          low = low + range * cLow;
          break;
        }
      }
      if (symbol === null) return null;
      out += symbol;
    }
    return out;
  },

  dotProduct: function(a, b){
    return a.reduce((acc, val, i) => acc + val * b[i], 0);
  },

  // ✅ Derivada numérica
  derivative: function(expression, value){
    let h = 1e-10;
    const func = new Function("x", "return " + expression);
    return (func(value + h) - func(value - h)) / (2 * h);
  },

  // ✅ Agregar etiquetas HTML al DOM
  addHTMLTag: function(tagName, attributes = {}, innerHTML = '', parentSelector = 'body') {
    const el = document.createElement(tagName);
    for (const [key, value] of Object.entries(attributes)) {
      el.setAttribute(key, value);
    }
    el.innerHTML = innerHTML;
    document.querySelector(parentSelector).append(el);
  },

  // ✅ Renderizado 2D con Canvas
  render2D: function(drawCallback, width = 300, height = 150, parentSelector = 'body') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.border = '1px solid black';
    document.querySelector(parentSelector).appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (typeof drawCallback === 'function') {
      drawCallback(ctx);
    }
  },

  // ✅ Renderizado 3D con WebGL
  render3D: function(initCallback, width = 300, height = 150, parentSelector = 'body') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.border = '1px solid black';
    document.querySelector(parentSelector).appendChild(canvas);

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    if (typeof initCallback === 'function') {
      initCallback(gl);
    }
  },

  // ✅ Numeros complejos (parser from string)
  complex: function(str) {
    str = str.replace(/\s+/g, '');

    // Pure imaginary like "5i" or "-2i"
    if (/^[+-]?\d*\.?\d*i$/.test(str)) {
      const num = str.replace('i', '');
      return {
        Re: 0,
        Im: num === '' || num === '+' ? 1 : (num === '-' ? -1 : parseFloat(num))
      };
    }

    // Pure real like "7" or "-3.5"
    if (/^[+-]?\d*\.?\d+$/.test(str)) {
      return { Re: parseFloat(str), Im: 0 };
    }

    // Full form like "3+4i" or "-2-5i"
    const match = str.match(/^([+-]?\d*\.?\d+)([+-]\d*\.?\d*)i$/);
    if (match) {
      return {
        Re: parseFloat(match[1]),
        Im: parseFloat(match[2])
      };
    }
  },

  // ✅ Valor absoluto
  compAbs: function(a) {
    return Math.sqrt(a.Re ** 2 + a.Im ** 2);
  },

    // ✅ Suma
  compSum: function(a, b){
    return {
      Re: a.Re + b.Re,
      Im: a.Im + b.Im
    };
  },

  // ✅ Resta
  compRest: function(a, b){
    return {
      Re: a.Re - b.Re,
      Im: a.Im - b.Im
    };
  },

  // ✅ Multiplicación
  compProduct: function(a, b){
    return {
      Re: a.Re * b.Re - a.Im * b.Im,
      Im: a.Re * b.Im + a.Im * b.Re
    };
  },

  // ✅ División
  compQuotient: function(a, b){
    const div = b.Re ** 2 + b.Im ** 2;
    return {
      Re: (a.Re * b.Re + a.Im * b.Im) / div,
      Im: (a.Im * b.Re - a.Re * b.Im) / div
    };
  },

  // ✅ Unparser (objeto → string)
  compParse: function(a){
    if (a.Im === 0) return `${a.Re}`;
    if (a.Re === 0) return `${a.Im}i`;
    if (a.Im < 0) return `${a.Re} - ${Math.abs(a.Im)}i`;
    return `${a.Re} + ${a.Im}i`;
  },

// Crear un objeto físico
  createBody: function(x, y, vx = 0, vy = 0, ax = 0, ay = 0, radius = 10){
    return { x, y, vx, vy, ax, ay, radius };
  },

  // Actualizar posición y velocidad (Euler integration)
  update: function(body, dt){
    body.vx += body.ax * dt;
    body.vy += body.ay * dt;
    body.x += body.vx * dt;
    body.y += body.vy * dt;
  },

  // Colisión con bordes de canvas
  collideBounds: function(body, width, height, restitution = 0.8){
    // Eje X
    if (body.x - body.radius < 0) {
      body.x = body.radius;
      body.vx *= -restitution;
    }
    if (body.x + body.radius > width) {
      body.x = width - body.radius;
      body.vx *= -restitution;
    }
    // Eje Y
    if (body.y - body.radius < 0) {
      body.y = body.radius;
      body.vy *= -restitution;
    }
    if (body.y + body.radius > height) {
      body.y = height - body.radius;
      body.vy *= -restitution;
    }
  },

  // Colisión entre dos cuerpos circulares
  collideBodies: function(a, b, restitution = 0.8){
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const minDist = a.radius + b.radius;

    if (dist === 0) return;
    if (dist < minDist) {
      // Normalizar vector
      const nx = dx / dist;
      const ny = dy / dist;

      // Separar cuerpos
      const overlap = (minDist - dist) / 2;
      a.x -= nx * overlap;
      a.y -= ny * overlap;
      b.x += nx * overlap;
      b.y += ny * overlap;

      // Velocidades relativas
      const dvx = b.vx - a.vx;
      const dvy = b.vy - a.vy;
      const impact = dvx * nx + dvy * ny;

      if (impact < 0) {
        const impulse = (-(1 + restitution) * impact) / 2;
        a.vx -= impulse * nx;
        a.vy -= impulse * ny;
        b.vx += impulse * nx;
        b.vy += impulse * ny;
      }
    }
  }
};
window.alephZero = alephZero;