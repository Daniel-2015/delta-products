const style = document.createElement("style");
style.innerText = `
:root {
    --bg-main: #1a1a1a;
    --bg-card: linear-gradient(to bottom, #fff8, #fff4, #fff2, #fff1, #0000);
    --accent: #4a90e2;
    --text-main: #e0e0e0;
    --text-muted: #a0a0a0;
    --radius: 20px;
    --transition: all 0.3s ease;
    --type: squircle;
}

/* Reset básico para mejor control de tamaños */
* {
    box-sizing: border-box;
}

body, html {
    background-color: var(--bg-main);
    font-family: monospace;
    color: var(--text-main);
    line-height: 1.6;
    margin: 0;
    padding: 20px;
}

h1 {
    text-align: center;
    font-weight: 300;
    letter-spacing: 1px;
    margin-bottom: 30px;
}

/* Contenedores y bloques de código */
div, code, pre, details, fieldset {
    background: var(--bg-card);
    border: 1px solid #fff8;
    border-radius: var(--radius);
    padding: 20px;
    margin-bottom: 15px;
    corner-shape: var(--type);
    box-shadow: 0 0 10px #0008;
    backdrop-filter: blur(16px);
}

/* Botones profesionales */
button {
    background: var(--accent);
    color: white;
    border: none;
    border-radius: var(--radius);
    padding: 10px 20px;
    cursor: pointer;
    font-weight: bold;
    transition: var(--transition);
    corner-shape: var(--type);
}

button:hover {
    filter: brightness(1.2);
    transform: translateY(-2px);
}

button:active {
    transform: translateY(0);
}

/* Entradas de texto mejoradas */
textarea {
    width: 100%;
    background: linear-gradient(to bottom, #999, #aaa, #ccc, #fff, #fff);
    color: #222;
    border-radius: var(--radius);
    padding: 32px;
    border: none;
    transition: var(--transition);
    font-family: Serif;
    corner-shape: var(--type);
}

textarea:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 8px rgba(74, 144, 226, 0.3);
}

a {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px dashed var(--accent);
    transition: var(--transition);
}

a:hover {
    color: #fff;
    border-bottom-style: solid;
}
`;
document.head.append(style);



