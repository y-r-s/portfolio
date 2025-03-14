function initFancySlider() {
  const container = document.getElementById("fancy-slider-demo");
  if (!container) return;

  // Create slider elements
  const slider = document.createElement("div");
  slider.className = "fancy-slider";

  const track = document.createElement("div");
  track.className = "slider-track";

  const knob = document.createElement("div");
  knob.className = "slider-knob";

  // Create knob layers
  const shadow = document.createElement("div");
  shadow.className = "knob-shadow";

  const base = document.createElement("div");
  base.className = "knob-base";

  const grips = document.createElement("div");
  grips.className = "knob-grips";

  // Add grip dots
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.className = "grip-dot";
    grips.appendChild(dot);
  }

  // Assemble the knob
  knob.appendChild(shadow);
  knob.appendChild(base);
  knob.appendChild(grips);

  // Assemble the slider
  slider.appendChild(track);
  slider.appendChild(knob);
  container.appendChild(slider);

  // Add drag functionality
  let isDragging = false;
  let startX, startLeft;

  function updateKnobPosition(clientX) {
    const rect = track.getBoundingClientRect();
    const trackWidth = rect.width;
    let newLeft = clientX - startX + startLeft;

    // Constrain to track bounds
    newLeft = Math.max(0, Math.min(newLeft, trackWidth));
    knob.style.left = `${newLeft}px`;
  }

  knob.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startLeft = knob.offsetLeft;
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    updateKnobPosition(e.clientX);
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Touch events
  knob.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    startLeft = knob.offsetLeft;
    e.preventDefault();
  });

  document.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    updateKnobPosition(e.touches[0].clientX);
  });

  document.addEventListener("touchend", () => {
    isDragging = false;
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initFancySlider);
