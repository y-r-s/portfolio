class RotatingDial {
  constructor(container) {
    this.container = container;
    this.rotation = 0;
    this.isDragging = false;
    this.startAngle = 0;
    this.currentAngle = 0;

    this.init();
  }

  init() {
    // Create background and dial elements
    this.background = document.createElement("div");
    this.background.className = "dial-background";

    this.dial = document.createElement("div");
    this.dial.className = "dial-circle";

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

    const angle =
      (Math.atan2(clientY - centerY, clientX - centerX) * 180) / Math.PI;
    return angle;
  }

  startDragging(event) {
    event.preventDefault();
    this.isDragging = true;
    this.startAngle = this.getAngle(event) - this.currentAngle;
  }

  drag(event) {
    if (!this.isDragging) return;
    event.preventDefault();

    this.currentAngle = this.getAngle(event) - this.startAngle;
    this.dial.style.transform = `translate(-50%, -50%) rotate(${this.currentAngle}deg)`;
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
