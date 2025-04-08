class FishPP extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        const src = this.getAttribute("src");
        const width = this.getAttribute("width") || "300px";

        const wrapper = document.createElement("div");
        wrapper.style.width = width;
        wrapper.classList.add("fish-box");
        wrapper.innerHTML = `
            <audio id="audio" src="${src}"></audio>
            <div class="controls">
                <button id="playPause">[ PLAY ]</button>
                <span id="time">0:00</span>
                <button id="toggleVolume">[ VOL ]</button>
            </div>
            <div class="sliders">
                <input type="range" id="seekbar" class="seek" value="0" step="1">
            </div>
            <div class="sliders" id="volumeControl" style="display: none;">
                <input type="range" id="volume" class="vol" min="0" max="1" step="0.01" value="1">
            </div>
        `;

        const style = document.createElement("link");
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("href", "00w004p/fish-pp/fish-pp.css");

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(wrapper);

        this.setupPlayer();
    }

    setupPlayer() {
        const s = this.shadowRoot;
        const audio = s.getElementById("audio");
        const playPause = s.getElementById("playPause");
        const seekbar = s.getElementById("seekbar");
        const volume = s.getElementById("volume");
        const time = s.getElementById("time");
        const toggleVolume = s.getElementById("toggleVolume");
        const volumeContainer = s.getElementById("volumeControl");

        playPause.addEventListener("click", () => {
            if (audio.paused) {
                audio.play();
                playPause.textContent = "[ PAUSE ]";
            } else {
                audio.pause();
                playPause.textContent = "[ PLAY ]";
            }
        });

        audio.addEventListener("timeupdate", () => {
            seekbar.value = audio.currentTime;
            time.textContent = `[ ${this.formatTime(audio.currentTime)} ]`;
            this.updateRangeFill(seekbar);
        });

        audio.addEventListener("loadedmetadata", () => {
            seekbar.max = audio.duration;
            this.updateRangeFill(seekbar);
        });

        seekbar.addEventListener("input", () => {
            audio.currentTime = seekbar.value;
            this.updateRangeFill(seekbar);
        });

        volume.addEventListener("input", () => {
            audio.volume = volume.value;
            this.updateRangeFill(volume);
        });

        toggleVolume.addEventListener("click", () => {
            volumeContainer.style.display = volumeContainer.style.display === "none" ? "flex" : "none";
        });

        this.updateRangeFill(volume);
        this.updateRangeFill(seekbar);
    }

    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    updateRangeFill(range) {
        const value = (range.value - range.min) / (range.max - range.min) * 100;
        range.style.background = `linear-gradient(to right, white 0%, white ${value}%, #444 ${value}%, #444 100%)`;
    }
}

customElements.define('fish-pp', FishPP);
