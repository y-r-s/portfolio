class TriplePush {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    const wrapper = document.createElement("div");
    wrapper.className = "triple-push";

    // Create two buttons with different colors
    const colors = ["orange", "dark"];
    colors.forEach((color) => {
      const button = this.createButton(color);
      wrapper.appendChild(button);
    });

    this.container.appendChild(wrapper);
  }

  createButton(color) {
    const button = document.createElement("div");
    button.className = `push-button ${color}`;

    const track = document.createElement("div");
    track.className = "button-track";

    const base = document.createElement("div");
    base.className = "button-base";

    const main = document.createElement("div");
    main.className = "button-main";

    const shadow = document.createElement("div");
    shadow.className = "button-shadow";

    const surface = document.createElement("div");
    surface.className = "button-surface";

    main.appendChild(shadow);
    main.appendChild(surface);
    button.appendChild(track);
    button.appendChild(base);
    button.appendChild(main);

    // Add click interaction
    button.addEventListener("mousedown", () => {
      button.classList.add("pressed");
      // Play click sound
      const audio = new Audio("assets/click.wav");
      audio.play();
    });

    button.addEventListener("mouseup", () => {
      button.classList.remove("pressed");
    });

    button.addEventListener("mouseleave", () => {
      button.classList.remove("pressed");
    });

    // Add touch support
    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      button.classList.add("pressed");
      const audio = new Audio("assets/click.wav");
      audio.play();
    });

    button.addEventListener("touchend", () => {
      button.classList.remove("pressed");
    });

    return button;
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const triplePushDemo = document.getElementById("triple-push-demo");
  new TriplePush(triplePushDemo);
});
