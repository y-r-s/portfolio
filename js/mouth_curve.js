class MouthCurve {
  constructor(container) {
    this.container = container;
    this.isDragging = false;
    this.startY = 0;
    this.currentY = 0;

    this.init();
  }

  init() {
    // Create face elements
    const face = document.createElement("div");
    face.className = "mouth-curve";

    const leftEye = document.createElement("div");
    leftEye.className = "eye left";

    const rightEye = document.createElement("div");
    rightEye.className = "eye right";

    // Create SVG mouth
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "mouth-svg");
    svg.setAttribute("viewBox", "0 0 300 300");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "mouth-path");

    svg.appendChild(path);

    // Assemble the face
    face.appendChild(leftEye);
    face.appendChild(rightEye);
    face.appendChild(svg);
    this.container.appendChild(face);

    // Store references
    this.face = face;
    this.path = path;

    // Set initial curve
    this.updateCurve(0);

    // Bind events
    this.face.addEventListener("mousedown", this.startDragging.bind(this));
    document.addEventListener("mousemove", this.drag.bind(this));
    document.addEventListener("mouseup", this.stopDragging.bind(this));

    // Touch events
    this.face.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.startDragging(e.touches[0]);
    });
    document.addEventListener("touchmove", (e) => {
      e.preventDefault();
      this.drag(e.touches[0]);
    });
    document.addEventListener("touchend", this.stopDragging.bind(this));
  }

  updateCurve(controlY) {
    // Create bezier curve path
    const startX = 75; // 25% of 300px to align with left eye
    const endX = 225; // 75% of 300px to align with right eye
    const y = 180; // Base Y position
    const controlX = 150; // Center X position

    const path = `M ${startX} ${y} Q ${controlX} ${y + controlY} ${endX} ${y}`;
    this.path.setAttribute("d", path);
  }

  startDragging(event) {
    this.isDragging = true;
    this.startY = event.clientY;
    this.startControlY = this.currentY;
  }

  drag(event) {
    if (!this.isDragging) return;

    const deltaY = event.clientY - this.startY;
    this.currentY = this.startControlY + deltaY * 0.5;

    // Limit the curve
    this.currentY = Math.max(Math.min(this.currentY, 50), -50);

    // Update the curve
    this.updateCurve(this.currentY);
  }

  stopDragging() {
    this.isDragging = false;
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const mouthDemo = document.getElementById("mouth-curve-demo");
  new MouthCurve(mouthDemo);
});
