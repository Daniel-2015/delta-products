/*
Delta (R)/TM

Made by Josuè Daniel Posadas, if you downloaded this folder NOT in https://daniel-2015.github.io/delta-products/, it maybe pirated.
*/
function OS() {
        this.booter = document.createElement("button");
            this.booter.innerText = "",
            this.booter.style.backround = "grey";
        this.screen = document.createElement("div");
            this.screen.style.backround = "black";
            this.screen.style.cornerShape = "squircle";
            this.screen.borderRadius = "100%"; // CRT screen design
            this.screen.padding = "50%";
            this.area = document.createElement("textarea");
                this.area.style.backround = "rgba(0, 0, 0, 0)";
                this.area.style.color = "lime";
            this.button = document.createElement("button");
                this.botton.innerText = "RUN";
                this.button.color = "black";
                this.button.backround = "lime";
                this.button.padding = "100%";
                this.button.onclick = () => this.command();
        this.screen.append(area, button);
    document.body.append(booter, screen);
    this.rom = {};
    this.ram = "";
    this.boot = function() {
        this.area.style.display = this.area.style.display === "block" ? "none" : "block";
        this.area.style.display = this.area.style.display === "block" ? "none" : "block";
        if (this.ram) this.ram = "";
    };
    this.command = function() {
        this.vars = this.area.innerText.split("\n").at(-1).split(" ");
        if (this.vars[0] === "create") {
            this.rom[this.vars[1]] = this.vars[2]
        } else if (this.vars[0] === "load") {
            this.ram = this.rom[this.vars[1]];
        } else if (this.vars[0] === "include") {
            this.rom[this.vars[1]] += this.rom[this.vars[2]]
        } else if (this.vars[0] === "open") {
            this.area.innerText += "\n" + this.ram + "\n";
        } else if (this.vars[0] === "run") {
            (new Function("", this.ram))();
        } else {
            this.area.innerText += "\nUnknown\n";
        }
    };
}function OS() {
    this.booter = document.createElement("button");
    this.booter.innerText = "BOOT";
    this.booter.style.background = "grey";

    this.screen = document.createElement("div");
    this.screen.className = "screen";

    this.area = document.createElement("textarea");

    this.button = document.createElement("button");
    this.button.innerText = "RUN";
    this.button.className = "run-btn";
    this.button.onclick = () => this.command();

    this.screen.append(this.area, this.button);
    document.body.append(this.booter, this.screen);

    this.rom = {};
    this.ram = "";

    this.booter.onclick = () => this.boot();
    
    const style = document.createElement("style");
    style.textContent = `
    body {
      background: #222;
      color: lime;
      font-family: monospace;
    }
    .screen {
      background: black;
      border-radius: 100%;
      corner-shape: squircle; /* experimental, works on your tablet */
      padding: 55px;
      width: 400px;
      height: 300px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    textarea {
      flex: 1;
      background: rgba(0,0,0,0);
      color: lime;
      width: 100%;
      resize: none;
      border: none;
      padding: 15px;
    }
    button {
      font-family: monospace;
      background: grey;
      color: black;
      padding: 10px;
      cursor: pointer;
      border: none;
      border-radius: 16px;
    }
    .run-btn {
      background: lime;
      color: black;
      border-radius: 0%;
      width: 25%;
    }
    `;
    document.head.appendChild(style);

    this.boot = function() {
        this.area.style.display = this.area.style.display === "none" ? "block" : "none";
        this.button.style.display = this.button.style.display === "none" ? "block" : "none";
        if (this.ram) this.ram = "";
        if (this.area.value) this.area.value = "";
    };

    this.command = function() {
        let lines = this.area.value.split("\n");
        this.vars = lines.at(-1).trim().split(" ");
        if (this.vars[0] === "create") {
            this.rom[this.vars[1]] = this.vars.slice(2).join(" ");
            this.area.value += "\n\n";
        } else if (this.vars[0] === "load") {
            this.ram = this.rom[this.vars[1]] || "";
            this.area.value += "\n\n";
        } else if (this.vars[0] === "include") {
            this.rom[this.vars[1]] += this.rom[this.vars[2]] || "";
            this.area.value += "\n\n";
        } else if (this.vars[0] === "open") {
            this.area.value += "\n" + this.ram + "\n\n";
        } else if (this.vars[0] === "run") {
            try {
                (new Function("", this.ram))();
            } catch (e) {
                this.area.value += "\nError: " + e.message;
            }
            this.area.value += "\n\n";
        } else {
            this.area.value += "\nUnknown\n\n";
        }
    };
}