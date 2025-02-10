function initSquareClock() {
  const clockContainer = document.getElementById("square-clock-demo");
  if (!clockContainer) return;

  // Create clock elements
  const clock = document.createElement("div");
  clock.className = "square-clock";

  const secondSquare = document.createElement("div");
  secondSquare.className = "clock-square second-square";

  const minuteSquare = document.createElement("div");
  minuteSquare.className = "clock-square minute-square";

  const hourSquare = document.createElement("div");
  hourSquare.className = "clock-square hour-square";

  // Assemble the clock
  clock.appendChild(secondSquare);
  clock.appendChild(minuteSquare);
  clock.appendChild(hourSquare);
  clockContainer.appendChild(clock);

  // Keep track of complete rotations
  let secondRotations = 0;
  let lastSecond = new Date().getSeconds();

  // Update clock
  function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;

    // Track complete rotations for seconds
    if (seconds < lastSecond) {
      secondRotations++;
    }
    lastSecond = seconds;

    // Calculate rotations (subtract 45 degrees to align corner)
    const secondDegrees = (seconds / 60) * 360 + secondRotations * 360 - 45;
    const minuteDegrees = ((minutes * 60 + seconds) / 3600) * 360 - 45;
    const hourDegrees =
      ((hours * 3600 + minutes * 60 + seconds) / 43200) * 360 - 45;

    // Apply rotations
    secondSquare.style.transform = `rotate(${secondDegrees}deg)`;
    minuteSquare.style.transform = `rotate(${minuteDegrees}deg)`;
    hourSquare.style.transform = `rotate(${hourDegrees}deg)`;
  }

  // Update every second
  setInterval(updateClock, 1000);
  updateClock(); // Initial update
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initSquareClock);
