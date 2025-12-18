// HTML
document.body.innerHTML = `
	<img src="p.png" id="gear" onclick="tgl();">
	<input type="range" id="steering-val" min="-180" max="180" value="0">
	<img src="steering.png" id="steering-img">
	<img src="brkoraccf.png" id="break" onclick="brk();">
	<img src="brkoraccf.png" id="accelerator" onclick="accelerate();">
	<canvas id="car-playgnd" width="900" height="300"></canvas>
`;
const gear = document.getElementById("gear");
const steeringVal = document.getElementById("steering-val");
const steeringImg = document.getElementById("steering-img");
const break2 = document.getElementById("break");
const accelerator = document.getElementById("accelerator");
const carPlaygnd = document.getElementById("car-playgnd");
// CSS
document.body.style.cssText = `
	background: #fff;
`;
gear.style.cssText = `
	transform: scale(0.2);
	position: fixed;
	top: -50%;
	left: 0%;
`;
steeringImg.style.cssText = `
	transform: scale(0.4);
	position: fixed;
	top: 40%;
	left: 30%;
`;
break2.style.cssText = `
	transform: scale(0.2);
	position: fixed;
	top: 0%;
	left: 10%;
`;
accelerator.style.cssText = `
	transform: scale(0.2);
	position: fixed;
	top: 0%;
	left: 50%;
`;
steeringVal.style.cssText = `
	transform: scale(1.6180339);
	position: fixed;
	top: 55%;
	left: 43.5%;
`;
carPlaygnd.style.cssText = `
	border: 1px solid black;
	border-radius: 5px;
	position: fixed;
	top: 4%;
	left: 15%;
`;
// JS
let g = 0;
let types = ["p", "r", "n", "g1", "g2", "g3"];
function tgl() {
	g += 1;
	g %= types.length;
	gear.src = `${types[g]}.png`
}
function f() {
	return [0, -1, Math.random(), 1, 2, 3][g]
}
steeringVal.addEventListener("input", () => {
  const angle = steeringVal.value;
  steeringImg.style.transform = `rotate(${angle}deg) scale(0.4)`;
});
let b = false;
function brk() {
	b = !b;
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
		x: Math.sin(deg2Rad(steeringVal.value)) * f() * a ? 1 : 1.1,
		y: Math.cos(deg2Rad(steeringVal.value)) * f() * a ? 1 : 1.1
	};
	vel = {
		x: (vel.x + acc.x * dt) * b ? 0.999 : 0.975,
		y: (vel.y + acc.y * dt) * b ? 0.999 : 0.975
	};
	pos = {
		x: pos.x + vel.x * dt,
		y: pos.y + vel.y * dt
	}
	ctx.clearRect(0, 0, carPlaygnd.width, carPlaygnd.height);
	ctx.beginPath();
	ctx.arc(pos.x + carPlaygnd.width / 2, carPlaygnd.height / 2 - pos.y, 10, 0, Math.PI * 2);
	ctx.fillStyle = "blue";
	ctx.fill();
	ctx.strokeStyle = "black";
	ctx.stroke();  
   end = performance.now();
   dt = (end - start) / 1000;
   start = end;
	requestAnimationFrame(loop)
}
loop();