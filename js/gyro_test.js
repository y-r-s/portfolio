class GyroTest {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    const wrapper = document.createElement("div");
    wrapper.className = "gyro-test";

    // Create display area for values
    const values = document.createElement("div");
    values.className = "gyro-values";
    values.innerHTML = "Tap button to start gyroscope";
    this.values = values;

    // Create permission button
    const button = document.createElement("button");
    button.className = "enable-gyro-btn";
    button.textContent = "Enable Gyroscope";

    button.addEventListener("click", async () => {
      try {
        // Check if DeviceOrientationEvent is supported
        if (!window.DeviceOrientationEvent) {
          values.textContent =
            "Device orientation not supported on this device/browser";
          return;
        }

        // For iOS devices
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === "granted") {
            this.startGyro();
            button.style.display = "none";
          } else {
            values.textContent =
              "Permission denied. Please enable motion sensors in your device settings.";
          }
        } else {
          // For Android and other devices
          this.startGyro();
          button.style.display = "none";
        }
      } catch (error) {
        values.textContent = `Error: ${error.message}. Please check device settings.`;
        console.error("Gyro error:", error);
      }
    });

    wrapper.appendChild(button);
    wrapper.appendChild(values);
    this.container.appendChild(wrapper);
  }

  startGyro() {
    window.addEventListener("deviceorientation", (event) => {
      const alpha = Math.round(event.alpha || 0); // Z-axis rotation
      const beta = Math.round(event.beta || 0); // X-axis rotation
      const gamma = Math.round(event.gamma || 0); // Y-axis rotation

      this.values.innerHTML = `
        Alpha (Z): ${alpha}°<br>
        Beta (X): ${beta}°<br>
        Gamma (Y): ${gamma}°<br>
        Time: ${new Date().toLocaleTimeString()}
      `;
    });

    this.values.textContent = "Listening for gyroscope...";
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const gyroTest = document.getElementById("gyro-test-demo");
  new GyroTest(gyroTest);
});
