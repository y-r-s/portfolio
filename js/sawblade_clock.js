document.addEventListener("DOMContentLoaded", () => {
  const demo = document.getElementById("sawblade-clock-demo");
  if (!demo) return;

  // Create clock structure
  const clock = document.createElement("div");
  clock.className = "sawblade-clock";

  // Create second hand with saw blade
  const secondHand = document.createElement("div");
  secondHand.className = "sawblade-second";
  const sawBladeImg = document.createElement("img");
  sawBladeImg.src = "images/sawblade1.jpg";
  sawBladeImg.alt = "Saw Blade";
  secondHand.appendChild(sawBladeImg);

  // Create center circle with digital time
  const centerCircle = document.createElement("div");
  centerCircle.className = "center-circle";
  const digitalTime = document.createElement("div");
  digitalTime.className = "digital-time";
  centerCircle.appendChild(digitalTime);

  // Add elements to clock
  clock.appendChild(secondHand);
  clock.appendChild(centerCircle);
  demo.appendChild(clock);

  // Update clock
  function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    // Update saw blade rotation
    const secondsDegrees = (seconds / 60) * 360;
    secondHand.style.transform = `translate(-50%, -50%) rotate(${secondsDegrees}deg)`;

    // Update digital time
    digitalTime.textContent = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  // Update every second
  setInterval(updateClock, 1000);
  updateClock(); // Initial update
});
