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

    // Assemble the dial
    dial.appendChild(face);
    this.container.appendChild(dial);

    // Store references
    this.dial = dial;
    this.face = face;

    // Add event listeners for mouse/touch
    this.dial.addEventListener("mousedown", this.startDragging.bind(this));
    this.dial.addEventListener("touchstart", this.startDragging.bind(this));
    document.addEventListener("mousemove", this.drag.bind(this));
    document.addEventListener("touchmove", this.drag.bind(this));
    document.addEventListener("mouseup", this.stopDragging.bind(this));
    document.addEventListener("touchend", this.stopDragging.bind(this));

    // Add mouse tilt for desktop
    this.dial.addEventListener("mousemove", this.handleTilt.bind(this));
    this.dial.addEventListener("mouseleave", this.resetTilt.bind(this));

    // Add gyroscope tilt for mobile with permission handling
    if (window.DeviceOrientationEvent) {
      // Check if we need to request permission (iOS 13+)
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        // Add a button to request permission
        const permButton = document.createElement("button");
        permButton.textContent = "Enable 3D Tilt";
        permButton.className = "enable-tilt-btn";

        permButton.addEventListener("click", async () => {
          try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === "granted") {
              window.addEventListener(
                "deviceorientation",
                this.handleGyro.bind(this)
              );
              permButton.style.display = "none";
              console.log("Gyroscope permission granted");
            } else {
              console.log("Gyroscope permission denied");
              permButton.textContent = "Permission Denied";
              permButton.style.background = "#dc3545";
            }
          } catch (error) {
            console.log("Error requesting gyro permission:", error);
            permButton.textContent = "Error - Try Again";
            permButton.style.background = "#dc3545";
          }
        });

        this.dial.appendChild(permButton);
      } else {
        // For Android and older iOS, just add the listener
        window.addEventListener(
          "deviceorientation",
          this.handleGyro.bind(this)
        );
        console.log("Adding deviceorientation listener directly");
      }
    } else {
      console.log("DeviceOrientation not supported");
    }
  }

  handleGyro(event) {
    if (this.isDragging) return;

    // Debug logging
    console.log("Gyro data:", {
      beta: event.beta,
      gamma: event.gamma,
    });

    // Get the device orientation angles
    const beta = event.beta; // Front/back tilt (-180 to 180)
    const gamma = event.gamma; // Left/right tilt (-90 to 90)

    if (beta === null || gamma === null) {
      console.log("No gyro data available");
      return;
    }

    // Convert gyro angles to tilt with more pronounced effect
    const tiltX = 60 + (beta - 45); // Increased from 0.5 to 1
    const tiltY = gamma; // Increased from 0.5 to 1

    // Apply tilt with limits
    const limitedTiltX = Math.max(30, Math.min(90, tiltX));
    const limitedTiltY = Math.max(-30, Math.min(30, tiltY));

    this.face.style.transform = `translate(-50%, -50%) rotateX(${limitedTiltX}deg) rotateY(${limitedTiltY}deg) rotate(${this.rotation}deg)`;
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
