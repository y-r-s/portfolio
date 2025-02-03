class RotatingDial {
  constructor(container) {
    this.container = container;
    this.rotation = 0;
    this.isDragging = false;
    this.startAngle = 0;
    this.currentAngle = 0;
    this.lastValidAngle = 0; // Keep track of last valid angle

    this.init();
  }

  init() {
    // Create background and dial elements
    this.background = document.createElement("div");
    this.background.className = "dial-background";

    this.dial = document.createElement("div");
    this.dial.className = "dial-circle";

    // Create the line
    const line = document.createElement("div");
    line.className = "dial-line";
    this.dial.appendChild(line);

    // Create the marker dots
    const markers = document.createElement("div");
    markers.className = "dial-markers";

    // Add 5 marker dots
    for (let i = 0; i < 5; i++) {
      const dot = document.createElement("span");
      markers.appendChild(dot);
    }

    this.container.appendChild(this.background);
    this.container.appendChild(this.dial);
    this.container.appendChild(markers);

    // Add event listeners
    this.dial.addEventListener("mousedown", this.startDragging.bind(this));
    this.dial.addEventListener("touchstart", this.startDragging.bind(this));
    document.addEventListener("mousemove", this.drag.bind(this));
    document.addEventListener("touchmove", this.drag.bind(this));
    document.addEventListener("mouseup", this.stopDragging.bind(this));
    document.addEventListener("touchend", this.stopDragging.bind(this));
  }

  getAngle(event) {
    const rect = this.dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let clientX, clientY;
    if (event.touches) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    let angle =
      (Math.atan2(clientY - centerY, clientX - centerX) * 180) / Math.PI;
    // Convert angle to 0-360 range
    angle = (angle + 360) % 360;
    return angle;
  }

  normalizeAngle(angle) {
    // Convert the angle to a 0-360 range
    angle = (angle + 360) % 360;

    // If the angle is in the allowed range (0-180), return it
    if (angle <= 180) {
      return angle;
    }

    // If the angle is closer to 0, return 0
    if (angle > 270) {
      return 0;
    }
    // If the angle is closer to 180, return 180
    return 180;
  }

  startDragging(event) {
    event.preventDefault();
    this.isDragging = true;
    const currentAngle = this.getAngle(event);
    this.startAngle = currentAngle - this.lastValidAngle;
  }

  drag(event) {
    if (!this.isDragging) return;
    event.preventDefault();

    let newAngle = this.getAngle(event) - this.startAngle;
    newAngle = this.normalizeAngle(newAngle);

    this.lastValidAngle = newAngle;
    this.dial.style.transform = `translate(-50%, -50%) rotate(${newAngle}deg)`;
  }

  stopDragging() {
    this.isDragging = false;
  }
}

// Initialize the dial when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const dialDemo = document.getElementById("dial-demo");
  new RotatingDial(dialDemo);
});
