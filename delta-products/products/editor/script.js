let coding = false;
let code = "";
let typeCursor = '│';
function runCode() {
	if (/(fetch|eval|Function|navegator|addEventListener|setTimeout)/g.test(code)) {
		const invalids = code.match(/(fetch|eval|Function|navegator|addEventListener|setTimeout)/g);
		alert("Functions", invalids, "are NOT allowed for security.");
		return;
	}
	
	try {
		new Function("", [`let load = "";`, code.replace(/console\.log/g, "load += "), `const outCage = document.getElementById("output");outCage.innerText = load;`].join(""))();
	} catch (e) {
		const TXT = String(e);
		load = TXT.slice(TXT.lastIndexOf(":") + 1);
	}
	const outCage = document.getElementById("output");
	outCage.innerText = load;
}
document.addEventListener("keydown", (e) => {
	function visualize() {
		const codeCage = document.getElementById("code");
		codeCage.innerText = code + typeCursor;
	}

	if (!coding) return;

	// ENTER
	if (e.key === "Enter") {
		code += "\n";
		visualize();
		return;
	}

	// TAB
	if (e.key === "Tab") {
		e.preventDefault();
		code += "\t";
		visualize();
		return;
	}

	// BACKSPACE
	if (e.key === "Backspace") {
		e.preventDefault();
		code = code.slice(0, -1);
		visualize();
		return;
	}

	// IGNORAR CONTROL
	if (e.ctrlKey) {
		return;
	}

	// IGNORAR ALT
	if (e.altKey) {
		return;
	}

	// SHIFT + LETRA
	if (e.shiftKey && e.key.length === 1) {
		code += e.key.toUpperCase();
		visualize();
		return;
	}

	// LETRAS NORMALES
	if (e.key.length === 1) {
		code += e.key;
		visualize();
		return;
	}

	// Ignorar otras teclas especiales (flechas, alt, etc.)
});
