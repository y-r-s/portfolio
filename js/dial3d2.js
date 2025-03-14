class Dial3D2 {
  constructor(container) {
    this.container = container;
    this.currentFrame = 1;
    this.totalFrames = 30;
    this.isDragging = false;
    this.startAngle = 0;
    this.currentAngle = 0;
    this.lastAngle = 0; // Add this to track continuous rotation
    this.images = [];
    this.currentImage = null;
    this.init();
  }

  async init() {
    const wrapper = document.createElement("div");
    wrapper.className = "dial3d2";

    // Create image element
    const img = document.createElement("img");
    img.className = "dial3d2-image";
    img.draggable = false;
    this.currentImage = img;
    wrapper.appendChild(img);
    this.container.appendChild(wrapper);

    // Store references
    this.wrapper = wrapper;

    // Preload images
    await this.preloadImages();

    // Set initial frame
    this.showFrame(1);

    // Add event listeners
    this.wrapper.addEventListener("mousedown", this.startDragging.bind(this));
    this.wrapper.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.startDragging(e.touches[0]);
    });

    document.addEventListener("mousemove", this.drag.bind(this));
    document.addEventListener("touchmove", (e) => {
      e.preventDefault();
      this.drag(e.touches[0]);
    });

    document.addEventListener("mouseup", this.stopDragging.bind(this));
    document.addEventListener("touchend", this.stopDragging.bind(this));
  }

  async preloadImages() {
    const loadImage = (frameNumber) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = `images/dial3d/${frameNumber
          .toString()
          .padStart(4, "0")}.png`;
      });
    };

    try {
      const loadPromises = [];
      for (let i = 1; i <= this.totalFrames; i++) {
        loadPromises.push(loadImage(i));
      }
      this.images = await Promise.all(loadPromises);
      console.log("All images loaded");
    } catch (error) {
      console.error("Error loading images:", error);
    }
  }

  showFrame(frameNumber) {
    if (this.images[frameNumber - 1]) {
      this.currentImage.src = this.images[frameNumber - 1].src;
      this.currentFrame = frameNumber;
    }
  }

  startDragging(event) {
    this.isDragging = true;
    const rect = this.wrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = event.clientX - centerX;
    const y = event.clientY - centerY;
    this.startAngle = Math.atan2(y, x);
    this.lastAngle = this.startAngle;
    this.startFrame = this.currentFrame;
  }

  drag(event) {
    if (!this.isDragging) return;

    const rect = this.wrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = event.clientX - centerX;
    const y = event.clientY - centerY;
    const currentAngle = Math.atan2(y, x);

    // Calculate the shortest angular distance
    let deltaAngle = currentAngle - this.lastAngle;

    // Handle angle wrap-around
    if (deltaAngle > Math.PI) {
      deltaAngle -= 2 * Math.PI;
    } else if (deltaAngle < -Math.PI) {
      deltaAngle += 2 * Math.PI;
    }

    // Update last angle
    this.lastAngle = currentAngle;

    // Convert to degrees
    const deltaDegrees = (deltaAngle * 180) / Math.PI;

    // Update frame based on rotation
    let frameDelta = Math.round((deltaDegrees * this.totalFrames) / 180);
    let newFrame = this.currentFrame + frameDelta;

    // Ensure frame number stays within bounds
    newFrame = Math.max(1, Math.min(this.totalFrames, newFrame));

    if (newFrame !== this.currentFrame) {
      this.showFrame(newFrame);
    }
  }

  stopDragging() {
    this.isDragging = false;
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const dial3d2Demo = document.getElementById("dial3d2-demo");
  new Dial3D2(dial3d2Demo);
});
