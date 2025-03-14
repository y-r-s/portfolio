class Slider3D {
  constructor(container, options = {}) {
    this.container = container;
    this.currentFrame = 1;
    this.totalFrames = options.totalFrames || 30;
    this.folderName = options.folderName || "slider3d";
    this.sensitivity = options.sensitivity || 8;
    this.isDragging = false;
    this.startY = 0;
    this.images = [];
    this.currentImage = null;

    // Only initialize hitmap-related properties for slider3d_3
    if (options.folderName === "slider3d_3") {
      this.hitmap = null;
      this.hitmapFrames = [];
      this.hitCanvas = document.createElement("canvas");
      this.hitCanvas.width = container.clientWidth;
      this.hitCanvas.height = container.clientHeight;
      this.hitCtx = this.hitCanvas.getContext("2d");

      // Debug container is created but not added to DOM
      this.debugContainer = document.createElement("div");
      this.debugContainer.className = "slider3d-debug";
      this.debugContainer.style.cssText = `
        position: absolute;
        top: 0;
        right: 0;
        width: 180px;
        height: 180px;
        border: 2px solid red;
        background: #fff;
        overflow: hidden;
        z-index: 1000;
      `;

      // Comment out the immediate addition to container
      // container.appendChild(this.debugContainer);
      // console.log("Debug container added to DOM");
    }

    this.init();
  }

  async init() {
    const wrapper = document.createElement("div");
    wrapper.className = "slider3d";

    // Create image element
    const img = document.createElement("img");
    img.className = "slider3d-image";
    img.draggable = false;
    this.currentImage = img;
    wrapper.appendChild(img);
    this.container.appendChild(wrapper);

    // Store references
    this.wrapper = wrapper;

    // Preload both visual frames and hitmap frames
    await Promise.all([this.preloadImages(), this.preloadHitmaps()]);

    // Set initial frame
    this.showFrame(1);

    // Add mousemove listener for cursor update
    if (this.folderName === "slider3d_3") {
      this.wrapper.addEventListener("mousemove", this.updateCursor.bind(this));
    }

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

    // Only load hitmaps for slider3d_3
    if (this.folderName === "slider3d_3") {
      await this.preloadHitmaps();
      // Remove debug container append
      // this.wrapper.appendChild(this.debugContainer);
    }
  }

  async preloadImages() {
    const loadImage = (frameNumber) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (error) => {
          console.error(
            `Failed to load image ${frameNumber} from ${this.folderName}:`,
            img.src,
            error
          );
          reject(error);
        };
        const imagePath = `images/${this.folderName}/${frameNumber
          .toString()
          .padStart(4, "0")}.png`;
        console.log(`Attempting to load: ${imagePath}`);
        img.src = imagePath;
      });
    };

    try {
      const loadPromises = [];
      for (let i = 1; i <= this.totalFrames; i++) {
        loadPromises.push(loadImage(i));
      }
      this.images = await Promise.all(loadPromises);
      console.log(
        `Successfully loaded ${this.images.length} images for ${this.folderName}`
      );
    } catch (error) {
      console.error(`Error loading images for ${this.folderName}:`, error);
      // Try to continue with any successfully loaded images
      this.images = this.images.filter((img) => img !== null);
      console.log(
        `Continuing with ${this.images.length} successfully loaded images`
      );
    }
  }

  async preloadHitmaps() {
    // Only proceed if this is slider3d_3
    if (this.folderName !== "slider3d_3") return;

    const loadHitmap = (frameNumber) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          console.log(`Successfully loaded hitmap ${frameNumber}`);
          resolve(img);
        };
        img.onerror = (error) => {
          console.error(
            `Failed to load hitmap ${frameNumber}:`,
            img.src,
            error
          );
          reject(error);
        };
        const hitmapPath = `images/slider3d_3_hitmap/${frameNumber
          .toString()
          .padStart(4, "0")}.png`;
        console.log(`Attempting to load hitmap: ${hitmapPath}`);
        img.src = hitmapPath;
      });
    };

    try {
      console.log("Starting hitmap loading for slider3d_3...");
      const loadPromises = [];
      for (let i = 1; i <= this.totalFrames; i++) {
        loadPromises.push(loadHitmap(i));
      }
      this.hitmapFrames = await Promise.all(loadPromises);
      console.log(
        `Successfully loaded ${this.hitmapFrames.length} hitmaps`,
        this.hitmapFrames[0]
      );

      // Debug: Check if debug container exists and is in DOM
      if (this.debugContainer) {
        console.log("Debug container exists");
        if (this.debugContainer.isConnected) {
          console.log("Debug container is in DOM");
        } else {
          console.log("Debug container is not in DOM");
        }
      } else {
        console.log("Debug container does not exist");
      }
    } catch (error) {
      console.error("Error loading hitmaps:", error);
    }
  }

  showFrame(frameNumber) {
    if (this.images[frameNumber - 1]) {
      this.currentImage.src = this.images[frameNumber - 1].src;
      this.currentFrame = frameNumber;

      // Debug: show current hitmap only if debugContainer exists
      if (this.debugContainer && this.hitmapFrames[frameNumber - 1]) {
        this.debugContainer.innerHTML = "";
        const debugImg = this.hitmapFrames[frameNumber - 1].cloneNode();
        debugImg.style.width = "100%";
        debugImg.style.height = "100%";
        debugImg.style.objectFit = "contain";
        this.debugContainer.appendChild(debugImg);
      }
    }
  }

  startDragging(event) {
    // For slider3d_3, check hit region. For others, allow dragging anywhere
    if (this.folderName === "slider3d_3") {
      const rect = this.wrapper.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (this.isPointInHitRegion(x, y)) {
        this.isDragging = true;
        this.startY = event.clientY;
        this.startFrame = this.currentFrame;
      }
    } else {
      this.isDragging = true;
      this.startY = event.clientY;
      this.startFrame = this.currentFrame;
    }
  }

  drag(event) {
    if (!this.isDragging) return;

    const deltaY = this.startY - event.clientY;
    let frameDelta = Math.round(deltaY / this.sensitivity);

    let newFrame = this.startFrame + frameDelta;
    newFrame = Math.max(1, Math.min(this.totalFrames, newFrame));

    if (newFrame !== this.currentFrame) {
      this.showFrame(newFrame);
    }
  }

  stopDragging() {
    this.isDragging = false;
  }

  loadHitmap(hitmapData) {
    // hitmapData would be an array of objects describing interactive areas per frame
    // [{frame: 0, area: {x, y, width, height, shape: 'circle|rect|polygon'}, ...}]
    this.hitmap = hitmapData;
  }

  updateInteractionArea() {
    const currentHitmap = this.hitmap[this.currentFrame];
    if (!currentHitmap) return;

    // Update interaction area position/shape based on current frame
    if (currentHitmap.shape === "circle") {
      this.interactionLayer.style.clipPath = `circle(${currentHitmap.radius}px at ${currentHitmap.x}px ${currentHitmap.y}px)`;
    } else if (currentHitmap.shape === "polygon") {
      this.interactionLayer.style.clipPath = `polygon(${currentHitmap.points.join(
        ", "
      )})`;
    }
  }

  handleTouch(e) {
    const touch = e.touches[0];
    const rect = this.interactionLayer.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Check if touch is within current hitmap area
    if (this.isWithinHitmap(x, y)) {
      this.isDragging = true;
      // Handle interaction...
    }
  }

  isPointInHitRegion(x, y) {
    if (!this.hitmapFrames[this.currentFrame - 1]) return false;

    const hitmap = this.hitmapFrames[this.currentFrame - 1];

    // Scale coordinates based on hitmap size vs container size
    const scaleX = hitmap.width / this.wrapper.clientWidth;
    const scaleY = hitmap.height / this.wrapper.clientHeight;

    // Adjust canvas size if needed
    if (this.hitCanvas.width !== hitmap.width) {
      this.hitCanvas.width = hitmap.width;
      this.hitCanvas.height = hitmap.height;
    }

    // Draw current hitmap frame to canvas
    this.hitCtx.clearRect(0, 0, this.hitCanvas.width, this.hitCanvas.height);
    this.hitCtx.drawImage(hitmap, 0, 0);

    // Get pixel color at scaled coordinates
    const scaledX = Math.floor(x * scaleX);
    const scaledY = Math.floor(y * scaleY);

    try {
      const pixel = this.hitCtx.getImageData(scaledX, scaledY, 1, 1).data;
      // Check if pixel is red (interactive area)
      return pixel[0] > 200 && pixel[1] < 50 && pixel[2] < 50;
    } catch (error) {
      console.error("Error checking hit region:", error);
      return false;
    }
  }

  updateCursor(event) {
    const rect = this.wrapper.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (this.isPointInHitRegion(x, y)) {
      this.wrapper.style.cursor = "grab";
    } else {
      this.wrapper.style.cursor = "default";
    }
  }
}

// Initialize multiple instances
document.addEventListener("DOMContentLoaded", () => {
  // First slider
  const slider3dDemo = document.getElementById("slider3d-demo");
  new Slider3D(slider3dDemo, {
    folderName: "slider3d",
    totalFrames: 30,
    sensitivity: 8,
  });

  // Second slider
  const slider3dDemo2 = document.getElementById("slider3d-demo2");
  new Slider3D(slider3dDemo2, {
    folderName: "slider3d_2",
    totalFrames: 30,
    sensitivity: 6,
  });

  // Third slider
  const slider3dDemo3 = document.getElementById("slider3d-demo3");
  new Slider3D(slider3dDemo3, {
    folderName: "slider3d_3",
    totalFrames: 30,
    sensitivity: 10,
  });
});
