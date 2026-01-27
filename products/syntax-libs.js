/*
Delta (R)/TM

Made by Josuè Daniel Posadas, if you downloaded this folder NOT in https://daniel-2015.github.io/delta-products/, it maybe pirated.
*/

let cmpleTmp = [];
let initTmp = "";

/**
 * Ejecuta una cadena de texto como código JavaScript tras procesar
 * las reglas de transformación definidas previamente.
 */
function JS(strings, ...values) {
    // Combinamos las partes del template literal
    let parsed = strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
    
    // Aplicamos cada transformación (Regex) definida en cmpleTmp
    for (const rule of cmpleTmp) {
        parsed = parsed.replace(rule.regex, rule.trans);
    }
    
    // Ejecutamos el código resultante
    // Se añade un return args al final para poder inspeccionar el resultado si se desea
    return new Function("", initTmp + parsed)();
}

/**
 * Configura las reglas de sintaxis y el estado inicial.
 */
function include({cmple = [], init = ""} = {}) {
    cmpleTmp = [...cmpleTmp, ...cmple];
    initTmp += init;
}

// Configuración de nuestra "Nueva Sintaxis"
include({
    cmple: [
        {regex: /args/g, trans: "{}"},
        
        // 'publ name = val' -> 'args.name = val'
        {regex: /publ\s+([a-zA-Z0-9_]+)/g, trans: "args.$1"},
        
        // 'hidd name = val' -> 'args.hidden.name = val'
        {regex: /hidd\s+([a-zA-Z0-9_]+)/g, trans: "args.hidden.$1"},
        
        // 'reti name = logic' -> 'args.name = () => logic' (Funciones cortas)
        {regex: /reti\s+([a-zA-Z0-9_]+)\s*=\s*([^;]+);/g, trans: "args.$1 = () => $2;"},
        
        // 'gtrt name' -> llama a la función 'args.name()'
        {regex: /gtrt\s+([a-zA-Z0-9_]+)/g, trans: "args.$1()"},
        
        // 'log val' -> 'console.log(val)'
        {regex: /log\s+([^;]+);/g, trans: "console.log($1);"},
    ],
    // Inicializamos args con un objeto para 'hidden' para evitar errores de undefined
    init: "const args = { hidden: {} };\n"
});

// --- Ejemplo de Implementación ---

JS`
    publ mensaje = "Hola Mundo";
    hidd secreto = "12345";
    reti saludar = "Accediendo a: " + publ mensaje;

    log publ mensaje;
    log gtrt saludar;
    log args;
    log "Dato oculto: " + hidd secreto;
`;
