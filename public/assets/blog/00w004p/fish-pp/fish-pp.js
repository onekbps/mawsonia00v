class FishPP extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        const src = this.getAttribute("src");
        const title = this.getAttribute("title") || "Audio";
        const width = this.getAttribute("width") || "400px";

        this.style.display = 'block';
        this.style.width = width;

        const wrapper = document.createElement("div");
        wrapper.style.width = width;
        wrapper.classList.add("fish-box");
        wrapper.innerHTML = `
            <audio id="audio" src="${src}"></audio>
            <div class="title" id="title">${title}</div>
            <div class="controls">
                <div class="left-controls">
                    <button id="playPause">[ PLAY ]</button>
                </div>
                <div class="center-time">
                    <span id="time">[ 0:00 ]</span>
                </div>
                <div class="right-controls">
                    <button id="toggleVolume">[ VOL ]</button>
                </div>
            </div>
            <div class="sliders">
                <input type="range" id="seekbar" class="seek" value="0" step="1">
            </div>
            <div class="sliders volume-wrap" id="volumeControl">
                <input type="range" id="volume" class="vol" min="0" max="1" step="0.01" value="1">
            </div>
        `;

        const style = document.createElement("link");
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("href", "/assets/blog/00w004p/fish-pp/fish-pp.css");

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

        volumeContainer.style.display = "none";

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
            const isVisible = volumeContainer.style.display === "flex";
            volumeContainer.style.display = isVisible ? "none" : "flex";
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
