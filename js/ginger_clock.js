// Create and initialize the clock
function initGingerClock() {
  const clockContainer = document.getElementById("ginger-clock-demo");
  if (!clockContainer) return;

  // Create clock elements
  const clock = document.createElement("div");
  clock.className = "ginger-clock";

  const clockFace = document.createElement("div");
  clockFace.className = "clock-face";

  // Create digital display
  const digitalDisplay = document.createElement("div");
  digitalDisplay.className = "digital-display";

  // Assemble the clock
  clock.appendChild(clockFace);
  clock.appendChild(digitalDisplay);
  clockContainer.appendChild(clock);

  // Update clock
  function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    // Calculate rotation for ginger image
    const secondDegrees = (seconds / 60) * 360;

    // Update digital display
    digitalDisplay.textContent = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    // Rotate ginger image
    clockFace.style.transform = `rotate(${secondDegrees}deg)`;
  }

  // Update every second
  setInterval(updateClock, 1000);
  updateClock(); // Initial update
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initGingerClock);
