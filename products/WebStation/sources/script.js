window.onload = () => {
    // --- 1. SELECTORES Y VARIABLES DE ESTADO ---
    const video = document.getElementById("miVideo");
    const audio = document.getElementById("miAudio");
    const select = document.getElementById("select");
    const downloader = document.getElementById("down");
    const startScreen = document.getElementById("start-screen");
    const items = document.querySelectorAll('.item'); // Items del menú principal
    const hourElement = document.getElementById("hour");
    const logo = document.querySelector('.logo');
    const contenedorMenu = document.getElementById("miContenedor");
    const settings = document.getElementById("settingsCont");
    const ittems = document.querySelectorAll('.ittem');
    const iframe = document.getElementById("iframe");
    const canvas = document.getElementById('ps2Canvas');
    const browserTag = document.getElementById("menu-grid");
    const ctx = canvas.getContext('2d');

    // Variables de Estado
    let indiceActual = -1;       // Menú Principal
    let indiceActual2 = -1;
    let browserIndex = 0;        // Grid del Browser
    let isBrowserActive = false; // ¿Estamos dentro del Browser?
    let isSettingsActive = false;

    // --- 2. OPERACIONES DEL SISTEMA ---
    const operations = {
        "Load Disk": () => {
            const game = prompt("Escribe el nombre de la carpeta en 'disk_rom':");
            if (!game) return;

            // Al cargar disco, ocultamos todo lo demás
            if (browserTag) browserTag.style.display = "none";
            isBrowserActive = false;
            
            iframe.src = `disk_rom/${game}/index.html`;
            iframe.style.display = "block";
            // contenedorMenu.style.display = "none"; // Opcional: ocultar menú principal
        },

        "Settings": () => {
            settings.style.display = "block";
            isSettingsActive = true;
        },

        "Browser": () => {
            if (!browserTag) return;
            try {
                // 1. Limpieza
                browserTag.innerHTML = ""; 
                
                // 2. Obtener datos (Namespace WSX_)
                const partidas = Object.keys(localStorage).filter(key => key.startsWith('WSX_'));
                
                // 3. Renderizar
                if (partidas.length === 0) {
                    browserTag.innerHTML = `<p style="font-family: 'Emotion Engine'; margin: auto; grid-column: 1 / -1; text-align: center;">No data found</p>`;
                } else {
                    partidas.forEach((key, index) => {
                        const displayName = key.replace('WSX_', '');
                        const icon = key.includes("system") ? "settings.png" : "game.png";
                        
                        // Añadimos data-key para leerlo luego con JS
                        browserTag.innerHTML += `
                            <div class="menu-item" data-key="${key}">
                                <img src="sources/${icon}">
                                <span>${displayName}</span>
                            </div>`;
                    });
                }

                // 4. Mostrar y Cambiar Estado
                browserTag.style.display = "grid";
                isBrowserActive = true;
                browserIndex = 0;
                actualizarBrowserVisual();

            } catch (e) { console.error("Error en Browser:", e); }
        },

        "Turn off": () => {
            if(confirm("Turn off WebStation?")) window.close();
        },

        "Download game placeholder": () => {
            if (downloader) downloader.click();
        }
    };

    // --- 3. FUNCIONES VISUALES (Browser y Menú) ---
    
    function actualizarBrowserVisual() {
        const browserItems = document.querySelectorAll(".menu-item");
        // Limpiar selección previa
        browserItems.forEach(item => item.classList.remove('selected'));
        
        // Marcar nueva selección
        if (browserItems[browserIndex]) {
            browserItems[browserIndex].classList.add('selected');
            browserItems[browserIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function actualizarSeleccionMenu() {
        items.forEach(item => item.classList.remove('activo'));
        if (items[indiceActual]) {
            items[indiceActual].classList.add('activo');
            // Scroll suave si el menú es muy largo
            items[indiceActual].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function actualizarSeleccionMenu2() {
        ittems.forEach(item => item.classList.remove('activo'));
        if (ittems[indiceActual2]) {
            ittems[indiceActual2].classList.add('activo');
            // Scroll suave si el menú es muy largo
            ittems[indiceActual2].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // --- 4. CONTROL DE TECLADO (EL CEREBRO) ---
    document.addEventListener('keydown', (e) => {
        // Bloqueo si el video de intro sigue reproduciéndose
        if (video.style.display !== "none" && video.style.opacity !== "0") return;

        // === CASO A: NAVEGACIÓN EN BROWSER (GRID) ===
        if (isBrowserActive) {
            const browserItems = document.querySelectorAll(".menu-item");
            const totalItems = browserItems.length;
            const columnas = 5; // Debe coincidir con tu CSS grid-template-columns

            if (totalItems === 0) {
                // Si no hay items, solo permitimos salir
                if (e.key === "Escape" || e.key === "Backspace") salirDelBrowser();
                return;
            }

            if (e.key === "ArrowRight") {
                if (browserIndex < totalItems - 1) browserIndex++;
            } 
            else if (e.key === "ArrowLeft") {
                if (browserIndex > 0) browserIndex--;
            } 
            else if (e.key === "ArrowDown") {
                // Bajar una fila (sumar columnas)
                if (browserIndex + columnas < totalItems) browserIndex += columnas;
            } 
            else if (e.key === "ArrowUp") {
                // Subir una fila (restar columnas)
                if (browserIndex - columnas >= 0) browserIndex -= columnas;
            } 
            else if (e.key === "Enter") {
                if (select) select.play().catch(e => {});
                const item = browserItems[browserIndex];
                if (item) {
                    const key = item.getAttribute('data-key');
                    if (confirm("Delete data?")) localStorage.removeItem(key);
                }
            } 
            else if (e.key === "Escape" || e.key === "Backspace") {
                salirDelBrowser();
            }

            actualizarBrowserVisual();
            return; // DETIENE la ejecución para no mover el menú de fondo
        }

        if(isSettingsActive) {
            if (e.key === 'ArrowDown' && indiceActual2 < ittems.length - 1) {
                e.preventDefault();
                indiceActual2++;
            } else if (e.key === 'ArrowUp' && indiceActual2 > 0) {
                e.preventDefault();
                indiceActual2--;
            } else if (e.key === 'Enter') {
                if (select) {
                    select.currentTime = 0;
                    select.play().catch(err => console.log(err));
                }
                const texto = ittems[indiceActual]?.innerText;
                if (texto === "Change console name") {
                    const name = prompt("New console name:");
                    if (!name) return;
                    let data = localStorage.getItem("WSX_system-settings") || "{}";
                    data = JSON.parse(data);
                    data.name = name;
                    data = JSON.stringify(data);
                    localStorage.setItem("WSX_system-settings", data);
                } else if (texto === "Change password") {
                    const pass = prompt("New password:");
                    const confirm = prompt("Confirm password:");
                    if (!(pass || confirm) && (pass === confirm)) return;
                    let data = localStorage.getItem("WSX_system-settings") || "{}";
                    data = JSON.parse(data);
                    data.pass = pass;
                    data = JSON.stringify(data);
                    localStorage.setItem("WSX_system-settings", data);
                }
            } else if (e.key === "Escape" || e.key === "Backspace") {
                salirDeSettings();
            }
            actualizarSeleccionMenu2();
            return;
        }

        // === CASO B: NAVEGACIÓN MENÚ PRINCIPAL ===
        if (e.key === 'ArrowDown' && indiceActual <= items.length) {
            e.preventDefault();
            indiceActual++;
            actualizarSeleccionMenu();
        } else if (e.key === 'ArrowUp' && indiceActual > 0) {
            e.preventDefault();
            indiceActual--;
            actualizarSeleccionMenu();
        } else if (e.key === 'Enter') {
            if (select) {
                select.currentTime = 0;
                select.play().catch(err => console.log(err));
            }
            const texto = items[indiceActual]?.innerText;
            // Busca la función en el objeto operations usando el texto del div
            if (operations[texto]) operations[texto]();
        }
    });

    function salirDelBrowser() {
        browserTag.style.display = "none";
        isBrowserActive = false;
        // Reproducir sonido de cancelación si tuvieras uno
        // audioCancel.play(); 
    }

    function salirDeSettings() {
        settings.style.display = "none";
        isSettingsActive = false;
        // Reproducir sonido de cancelación si tuvieras uno
        // audioCancel.play(); 
    }

    // --- 5. INTRO Y ANIMACIÓN (NO TOCAR, YA FUNCIONA BIEN) ---
    function iniciarExperiencia() {
        if (!startScreen) return;
        video.play().catch(e => console.log("Error video:", e));
        audio.play().catch(e => console.log("Error audio:", e));
        audio.currentTime = video.currentTime;

        startScreen.style.transition = "opacity 0.8s";
        startScreen.style.opacity = "0";
        setTimeout(() => startScreen.remove(), 800);
        requestAnimationFrame(loop);
    }

    if (startScreen) startScreen.addEventListener('click', iniciarExperiencia);

    video.addEventListener('ended', () => {
        video.style.display = "none";
        let data = localStorage.getItem("WSX_system-settings") || "{}";
        data = JSON.parse(data);
        if (data.pass) {
            const pass = prompt("Password:");
            if (data.pass !== pass) window.close();
        } else alert("For your security, you must have an password");
        setTimeout(() => {
            video.style.display = "none";
            const uiElements = [logo, hourElement, contenedorMenu];
            uiElements.forEach(el => {
                if (el) el.classList.add('visible'); 
            });
            // Seleccionar primer item del menú al terminar intro
            if (items.length > 0) {
                indiceActual = 0;
                actualizarSeleccionMenu();
            }
        }, 1000); 
    });

    // --- ANIMACIÓN DE FONDO (ELECTRONES) ---
    const arr = Array.from({length: 8}, (_, i) => i - 3.75);

    function loop() {
        ctx.fillStyle = "rgba(0, 0, 8, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const t = performance.now() / 1000;

        arr.forEach((idx) => {
            ctx.beginPath();
            let x = Math.cos(t * idx);
            let y = Math.sin(t * idx);
            let z = 0;
            const radX = 0.4, radY = 1.2, radZ = 0.8;

            let y1 = y * Math.cos(radX * t) - z * Math.sin(radX * t);
            let z1 = y * Math.sin(radX * t) + z * Math.cos(radX * t);
            y = y1; z = z1;

            let x2 = x * Math.cos(radY * t) + z * Math.sin(radY * t);
            let z2 = -x * Math.sin(radY * t) + z * Math.cos(radY * t);
            x = x2; z = z2;

            let x3 = x * Math.cos(radZ * t) - y * Math.sin(radZ * t);
            let y3 = x * Math.sin(radZ * t) + y * Math.cos(radZ * t);
            x = x3; y = y3;
                
            const posX = canvas.width / 2 + (x / (z + 10)) * 1000;
            const posY = canvas.height / 2 + (y / (z + 10)) * 1000;
            
            ctx.arc(posX, posY, 5, 0, Math.PI * 2);
            ctx.shadowBlur = 15;
            ctx.shadowColor = "rgb(0, 255, 255)";
            ctx.fillStyle = "rgba(0, 255, 255)";
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        if (hourElement) hourElement.innerText = new Date().toLocaleString();
        if (!video.paused && (video.duration - video.currentTime <= 1)) {
            video.style.opacity = "0";
        }
        requestAnimationFrame(loop);
    }
};

