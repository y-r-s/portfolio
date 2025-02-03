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

    // Add the indicator dot with number
    const indicator = document.createElement("div");
    indicator.className = "dial-indicator";
    this.indicatorText = document.createTextNode("0");
    indicator.appendChild(this.indicatorText);
    this.dial.appendChild(indicator);

    this.container.appendChild(this.background);
    this.container.appendChild(this.dial);

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

  updateIndicatorNumber(angle) {
    // Convert angle to number (0-5 range)
    const number = Math.round((angle / 180) * 5);
    this.indicatorText.nodeValue = number.toString();
  }

  drag(event) {
    if (!this.isDragging) return;
    event.preventDefault();

    let newAngle = this.getAngle(event) - this.startAngle;
    newAngle = this.normalizeAngle(newAngle);

    this.lastValidAngle = newAngle;
    this.dial.style.transform = `translate(-50%, -50%) rotate(${newAngle}deg)`;
    // Counter-rotate the indicator to keep text upright
    const indicator = this.dial.querySelector(".dial-indicator");
    indicator.style.transform = `translate(-50%, -50%) rotate(${-newAngle}deg)`;
    this.updateIndicatorNumber(newAngle);
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
