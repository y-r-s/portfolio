class Dial3D {
  constructor(container) {
    this.container = container;
    this.rotation = 0;
    this.tiltX = 60;
    this.tiltY = 0;
    this.isDragging = false;
    this.startAngle = 0;
    this.currentAngle = 0;
    this.lastValidAngle = 0;
    this.init();
  }

  init() {
    // Create main container
    const dial = document.createElement("div");
    dial.className = "dial3d";

    // Create dial face
    const face = document.createElement("div");
    face.className = "dial3d-face";

    // Create the line
    const line = document.createElement("div");
    line.className = "dial3d-line";
    face.appendChild(line);

    // Create markers container
    const markers = document.createElement("div");
    markers.className = "dial3d-markers";

    // Add 5 markers
    for (let i = 0; i < 5; i++) {
      const marker = document.createElement("div");
      marker.className = "dial3d-marker";
      markers.appendChild(marker);
    }

    // Assemble the dial
    dial.appendChild(face);
    dial.appendChild(markers);
    this.container.appendChild(dial);

    // Store references
    this.dial = dial;
    this.face = face;

    // Add event listeners
    this.dial.addEventListener("mousedown", this.startDragging.bind(this));
    this.dial.addEventListener("touchstart", this.startDragging.bind(this));
    document.addEventListener("mousemove", this.drag.bind(this));
    document.addEventListener("touchmove", this.drag.bind(this));
    document.addEventListener("mouseup", this.stopDragging.bind(this));
    document.addEventListener("touchend", this.stopDragging.bind(this));

    // Add mousemove for tilt effect
    this.dial.addEventListener("mousemove", this.handleTilt.bind(this));
    this.dial.addEventListener("mouseleave", this.resetTilt.bind(this));
  }

  handleTilt(event) {
    if (this.isDragging) return;

    const rect = this.dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate tilt based on mouse position
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const tiltY = ((mouseX - centerX) / (rect.width / 2)) * 20;
    const tiltX = ((mouseY - centerY) / (rect.height / 2)) * 20 + 60;

    this.face.style.transform = `translate(-50%, -50%) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotate(${this.rotation}deg)`;
  }

  resetTilt() {
    if (!this.isDragging) {
      this.face.style.transform = `translate(-50%, -50%) rotateX(60deg) rotateY(0deg) rotate(${this.rotation}deg)`;
    }
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
    angle = (angle + 360) % 360;
    return angle;
  }

  normalizeAngle(angle) {
    angle = (angle + 360) % 360;
    if (angle <= 180) return angle;
    return angle > 270 ? 0 : 180;
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
    this.rotation = newAngle;
    this.face.style.transform = `translate(-50%, -50%) rotateX(${this.tiltX}deg) rotateY(${this.tiltY}deg) rotate(${newAngle}deg)`;
  }

  stopDragging() {
    this.isDragging = false;
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const dial3dDemo = document.getElementById("dial3d-demo");
  new Dial3D(dial3dDemo);
});
