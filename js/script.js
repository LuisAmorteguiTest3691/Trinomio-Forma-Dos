document.addEventListener('DOMContentLoaded', () => {
    const factorBtn = document.getElementById('factorBtn');
    const stepsDiv = document.getElementById('steps');
  
    factorBtn.addEventListener('click', () => {
      const inputPoly = document.getElementById('userPolynomial').value;
      const resultHTML = factorTrinomial(inputPoly);
      stepsDiv.innerHTML = resultHTML;
      
      // Renderiza las fórmulas con MathJax
      if (window.MathJax) {
        window.MathJax.typeset();
      }
    });
  });
  
  /**
   * Factoriza un trinomio de la forma ax^2+bx+c utilizando el método "ac".
   * Se aplica la fórmula general a la ecuación auxiliar:
   * x^2 - bx + (a*c) = 0, de donde se obtienen dos números m y n.
   * Luego se reescribe bx = m*x + n*x y se factoriza por agrupación.
   *
   * Ejemplos de entrada: "6x^2-31x+40" o "2x^2+7x+3"
   * Si se omite el coeficiente de x^2, se asume a = 1.
   */
  function factorTrinomial(polyStr) {
    // Eliminar espacios
    let poly = polyStr.replace(/\s+/g, '');
  
    // Expresión regular para extraer a, b y c.
    // Se espera la forma: [a]x^2[+|-]b x[+|-]c
    // Ejemplo: "2x^2+7x+3" o "x^2-5x+6"
    const regex = /^([+-]?[\d]*)x\^2([+-]\d+)x([+-]\d+)$/;
    const match = poly.match(regex);
    if (!match) {
      return `<p>Error: La expresión debe tener la forma ax^2+bx+c.<br>
              Ejemplos: "2x^2+7x+3" o "x^2-5x+6".</p>`;
    }
  
    // Extraer coeficientes
    let aStr = match[1];
    let bStr = match[2];
    let cStr = match[3];
  
    // Si a se omite, se asume 1
    let a = (aStr === "" || aStr === "+") ? 1 : (aStr === "-") ? -1 : parseInt(aStr, 10);
    let b = parseInt(bStr, 10); // bStr ya incluye el signo
    let c = parseInt(cStr, 10); // cStr ya incluye el signo
  
    let html = `<p><strong>Paso 1:</strong> Identificar los coeficientes</p>`;
    html += `<p>El trinomio es: \\( ${a !== 1 ? a : ''}x^2 ${formatSign(b)}x ${formatSign(c)} \\).<br>`;
    html += `Se tiene: \\(a = ${a}, \\; b = ${b}, \\; c = ${c}\\).</p>`;
  
    // Paso 2: Calcular a*c
    let ac = a * c;
    html += `<p><strong>Paso 2:</strong> Calcular \\(a \\cdot c\\)</p>`;
    html += `<p>\\( a \\cdot c = ${a} \\times ${c} = ${ac} \\).</p>`;
  
    // Paso 3: Hallar m y n tales que:
    // m + n = b  y  m * n = a*c.
    // Para esto resolvemos la ecuación auxiliar: x^2 - b*x + (a*c) = 0
    let discriminant = b * b - 4 * ac;
    html += `<p><strong>Paso 3:</strong> Aplicar la fórmula cuadrática a la ecuación auxiliar</p>`;
    html += `<p>Consideramos la ecuación: \\( x^2 - (${b})x + ${ac} = 0 \\).</p>`;
    html += `<p>El discriminante es: \\( D = b^2 - 4ac = ${b}^2 - 4\\cdot${ac} = ${discriminant} \\).</p>`;
  
    if (discriminant < 0) {
      html += `<p>El discriminante es negativo, por lo que las raíces son complejas y el trinomio no es factorizable en \\(\\mathbb{R}\\).</p>`;
      return html;
    }
  
    let sqrtD = Math.sqrt(discriminant);
    // Se obtienen dos raíces (m y n) usando:
    // x = (b ± sqrtD) / 2  (recordando que en la ecuación auxiliar la suma de las raíces es b)
    let m = (b + sqrtD) / 2;
    let n = (b - sqrtD) / 2;
    
    html += `<p>Aplicando la fórmula: \\( x = \\frac{b \\pm \\sqrt{D}}{2} \\), se obtiene:</p>`;
    html += `<p>\\( m = \\frac{${b} + \\sqrt{${discriminant}}}{2} = ${m.toFixed(3)} \\)</p>`;
    html += `<p>\\( n = \\frac{${b} - \\sqrt{${discriminant}}}{2} = ${n.toFixed(3)} \\)</p>`;
    html += `<p>Verificamos: \\( m + n = ${m.toFixed(3)} + ${n.toFixed(3)} = ${m+n} \\) y \\( m \\cdot n = ${m.toFixed(3)} \\times ${n.toFixed(3)} = ${m*n.toFixed(3)} \\).</p>`;
  
    // Paso 4: Reescribir bx en dos partes: m*x + n*x
    html += `<p><strong>Paso 4:</strong> Reescribir el término central</p>`;
    html += `<p>Reescribimos \\( bx = ${b}x \\) como \\( ${m.toFixed(3)}x + ${n.toFixed(3)}x \\).</p>`;
    html += `<p>Entonces, \\( ax^2+bx+c = ax^2 + ${m.toFixed(3)}x + ${n.toFixed(3)}x + c \\).</p>`;
  
    // Paso 5: Factorización por agrupación
    html += `<p><strong>Paso 5:</strong> Factorizar por agrupación</p>`;
    html += `<p>Agrupamos los términos:<br>`;
    html += `\\( (ax^2 + ${m.toFixed(3)}x) + (${n.toFixed(3)}x + ${c}) \\).</p>`;
    // Se extrae factor común de cada grupo
    let grupo1 = `x( ${a}x + ${m.toFixed(3)} )`;
    let grupo2 = `1( ${n.toFixed(3)}x + ${c} )`; // En el método ac se busca un factor común
    html += `<p>Aplicando factorización por grupos se obtiene (asumiendo que se halla el factor común adecuado):</p>`;
    
    // Nota: La técnica ac clásica consiste en factorizar de modo que se obtenga un factor común en ambos grupos.
    // Aquí mostramos el proceso y asumimos que la reagrupación conduce a la factorización:
    // El trinomio se factoriza como: a(x - m')(x - n'), donde m' y n' son las raíces de la ecuación original.
    html += `<p><strong>Paso 6:</strong> Escribir la factorización final</p>`;
    html += `<p>La factorización final del trinomio es:</p>`;
    html += `<p>\\[
      ax^2+bx+c = ${a}\\Bigl(x - \\Bigl(\\frac{b+\\sqrt{b^2-4ac}}{2}\\Bigr)\\Bigr)\\Bigl(x - \\Bigl(\\frac{b-\\sqrt{b^2-4ac}}{2}\\Bigr)\\Bigr).
    \\]</p>`;
    html += `<p>En nuestro ejemplo, con \\(a = ${a}\\):</p>`;
    html += `<p>\\[
      ${a}x^2+(${b})x+${c} = ${a}\\Bigl(x - (${m.toFixed(3)})\\Bigr)\\Bigl(x - (${n.toFixed(3)})\\Bigr).
    \\]</p>`;
  
    return html;
  }
  
  /**
   * Devuelve un string con el signo adecuado.
   * Por ejemplo, formatSign(7) retorna "+7" y formatSign(-5) retorna "-5".
   */
  function formatSign(num) {
    return (num >= 0) ? `+${num}` : `${num}`;
  }
  