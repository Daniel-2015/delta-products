/*
Delta (R)/TM

Made by Josuè Daniel Posadas, if you downloaded this folder NOT in https://daniel-2015.github.io/delta-products/, it maybe pirated.
*/
function new_Sprite(name) {
    const sprite = document.createElement("img");
    sprite.src = name;
    sprite.style.position = "fixed";
    sprite.style.left = "0px";
    sprite.style.bottom = "0px";
    document.body.append(sprite);

    return {
        sprite,
        data: {
            rotation: 0,   // radians
            scaling: 1,
        },

        // 🎮 Motion
        movement_move(steps) {
            let x = parseFloat(this.sprite.style.left) || 0;
            let y = parseFloat(this.sprite.style.bottom) || 0;
            x += Math.cos(this.data.rotation) * steps;
            y += Math.sin(this.data.rotation) * steps;
            this.sprite.style.left = x + "px";
            this.sprite.style.bottom = y + "px";
        },

        movement_rotate(radians) {
            this.data.rotation += radians;
            let degrees = this.data.rotation * 180 / Math.PI;
            this.sprite.style.transform = `rotate(${degrees}deg) scale(${this.data.scaling})`;
        },

        movement_goTo(x, y) {
            this.sprite.style.left = x + "px";
            this.sprite.style.bottom = y + "px";
        },

        movement_glideTo(x, y, seconds) {
            const startX = parseFloat(this.sprite.style.left) || 0;
            const startY = parseFloat(this.sprite.style.bottom) || 0;
            const dx = x - startX;
            const dy = y - startY;
            const startTime = performance.now();

            const animate = (time) => {
                const t = Math.min((time - startTime) / (seconds * 1000), 1);
                this.sprite.style.left = (startX + dx * t) + "px";
                this.sprite.style.bottom = (startY + dy * t) + "px";
                if (t < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        },

        // 🎨 Looks
        looks_scale(p) {
            this.data.scaling = Math.max(0.1, this.data.scaling + p);
            let degrees = this.data.rotation * 180 / Math.PI;
            this.sprite.style.transform = `rotate(${degrees}deg) scale(${this.data.scaling})`;
        },

        looks_say(text, seconds) {
            const bubble = document.createElement("div");
            bubble.innerText = text;
            bubble.style.position = "fixed";
            bubble.style.left = this.sprite.style.left;
            bubble.style.bottom = (parseFloat(this.sprite.style.bottom) + 50) + "px";
            bubble.style.background = "white";
            bubble.style.border = "1px solid black";
            bubble.style.padding = "5px";
            document.body.appendChild(bubble);
            setTimeout(() => bubble.remove(), seconds * 1000);
        },

        looks_show() {
            this.sprite.style.display = "block";
        },

        looks_hide() {
            this.sprite.style.display = "none";
        },

        looks_opacity(percent) {
            this.sprite.style.opacity = percent;
        },

        looks_setColorEffect(radians) {
            this.sprite.style.filter = `hue-rotate(${hue * 180 / Math.PI}deg)`;
        },

        // 🎵 Sound
        sound_play(src) {
            const audio = new Audio(src);
            audio.play();
        },

        // 📊 Sensing
        sensing_touching(otherSprite) {
            const rect1 = this.sprite.getBoundingClientRect();
            const rect2 = otherSprite.sprite.getBoundingClientRect();
            return !(rect1.right < rect2.left ||
                     rect1.left > rect2.right ||
                     rect1.bottom < rect2.top ||
                     rect1.top > rect2.bottom);
        },

        sensing_distanceTo(otherSprite) {
            const x1 = parseFloat(this.sprite.style.left) || 0;
            const y1 = parseFloat(this.sprite.style.bottom) || 0;
            const x2 = parseFloat(otherSprite.sprite.style.left) || 0;
            const y2 = parseFloat(otherSprite.sprite.style.bottom) || 0;
            return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
        },

        // 🕹️ Events
        events_whenClicked(callback) {
            this.sprite.addEventListener("click", callback);
        },

        events_whenKeyPressed(key, callback) {
            document.addEventListener("keydown", (e) => {
                if (e.key === key) callback();
            });
        }
    };
}