// HTML
document.body.innerHTML = `
	<img src="p. png" id="gear" onclick="tgl();">
	<input type="range" id="steering-val" min="-180" max="180" value="0">
	<img src="steering. png" id="steering-img">
	<img src="brkoraccf.png" id="break" onclick="brk();">
	<img src="brkoraccf.png" id="accelerator" onclick="accelerate();">
	<canvas id="car-playgnd"></canvas>
`;

const gear = document.getElementById("gear");
const steeringVal = document.getElementById("steering-val");
const steeringImg = document.getElementById("steering-img");
const break2 = document.getElementById("break");
const accelerator = document.getElementById("accelerator");
const carPlaygnd = document.getElementById("car-playgnd");

// Configurar canvas responsivo
function resizeCanvas() {
	const width = Math.min(window.innerWidth * 0.9, 900);
	const height = Math. min(window.innerHeight * 0.6, 300);
	carPlaygnd.width = width;
	carPlaygnd.height = height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// CSS
document.body.style.cssText = `
	background:  #fff;
	margin: 0;
	padding: min(10px, 2vw);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	font-family: Arial, sans-serif;
	overflow-x: hidden;
`;

gear.style.cssText = `
	transform: scale(clamp(0.1, 15vw, 0.2));
	position: fixed;
	top: clamp(10px, 5vh, 50px);
	left: clamp(10px, 2vw, 30px);
	cursor: pointer;
	z-index: 10;
`;

steeringImg.style.cssText = `
	transform: scale(clamp(0.2, 10vw, 0.4));
	position: fixed;
	bottom: clamp(20px, 10vh, 100px);
	left: clamp(10px, 5vw, 50px);
	z-index: 5;
`;

break2.style.cssText = `
	transform: scale(clamp(0.1, 8vw, 0.2));
	position: fixed;
	top: clamp(70px, 15vh, 120px);
	right: clamp(50px, 12vw, 150px);
	cursor: pointer;
	z-index: 10;
`;

accelerator.style.cssText = `
	transform: scale(clamp(0.1, 8vw, 0.2));
	position: fixed;
	top: clamp(70px, 15vh, 120px);
	right: clamp(10px, 5vw, 50px);
	cursor: pointer;
	z-index: 10;
`;

steeringVal.style.cssText = `
	transform: scale(clamp(1, 2vw, 1.6180339));
	position: fixed;
	bottom: clamp(10px, 5vh, 40px);
	left: clamp(10px, 2vw, 30px);
	width: clamp(150px, 60vw, 400px);
	z-index: 8;
`;

carPlaygnd.style.cssText = `
	border: 2px solid #333;
	border-radius: 5px;
	background: #f0f0f0;
	margin: clamp(10px, 5vh, 30px) auto;
	display: block;
	max-width: 100%;
	height: auto;
`;

// JS
let g = 0;
let types = ["p", "r", "n", "g1", "g2", "g3"];

function tgl() {
	g += 1;
	g %= types.length;
	gear.src = `${types[g]}. png`
}

function f() {
	return [0, -1, Math.random(), 1, 2, 3][g]
}

steeringVal.addEventListener("input", () => {
	const angle = steeringVal.value;
	steeringImg.style.transform = `rotate(${angle}deg) scale(clamp(0.2, 10vw, 0.4))`;
});

let b = false;
function brk() {
	b = ! b;
	break2.src = `brkoracc${b ? "t" : "f"}.png`;
}

let a = false;
function accelerate() {
	a = !a;
	accelerator.src = `brkoracc${a ? "t" : "f"}.png`;
}

let pos = {
	x: 0,
	y: 0
}

let vel = {
	x: 0,
	y: 0
}

let acc = {
	x: 0,
	y: 0
}

let start = 0;
let end = 0;
let dt = 1;

const ctx = carPlaygnd.getContext("2d");

function deg2Rad(x) {
	return x / 180 * Math.PI;
}

function loop() {
	acc = {
		x: Math.sin(deg2Rad(steeringVal.value)) * f() * (a ? 1 : 1.1),
		y: (a ? 1 : 0) - (b ? 1 : 0)
	}

	vel. x += acc.x * dt;
	vel.y += acc.y * dt;

	vel.x *= 0.99;
	vel.y *= 0.99;

	pos. x += vel.x;
	pos.y += vel. y;

	ctx.clearRect(0, 0, carPlaygnd.width, carPlaygnd.height);
	ctx.fillStyle = "red";
	ctx.fillRect(pos.x, pos.y, 10, 10);

	requestAnimationFrame(loop);
}

loop();
