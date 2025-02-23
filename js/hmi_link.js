class HMILink {
  constructor(container) {
    this.container = container;
    this.isInfoVisible = false;
    this.isDragging = false;
    this.startY = 0;
    this.scrollTop = 0;
    this.init();
  }

  init() {
    // Create main container
    const linkContainer = document.createElement("div");
    linkContainer.className = "hmi-link";

    // Create content area with link
    const content = document.createElement("div");
    content.className = "link-content";

    const link = document.createElement("a");
    link.className = "site-link";
    link.href = "https://china-hmi.design";
    link.target = "_blank";
    link.textContent = "china-hmi.design";
    content.appendChild(link);

    // Create FAB button
    const fab = document.createElement("div");
    fab.className = "hmi-fab";

    // Create project info
    const info = document.createElement("div");
    info.className = "project-info";
    info.innerHTML = `
      <div class="project-info-content">
        <h4>Chinese Car HMI Archive</h4>
        <p>Chinese automotive brands are creating innovative and sophisticated HMI designs, but information about these interfaces remains difficult to access outside of Chinese internet platforms. The rapid pace of updates makes it challenging to stay current, even for designers within China. This project aims to bridge this gap by documenting and sharing these design innovations with the global design community.</p>
      </div>
    `;

    // Add elements to container
    linkContainer.appendChild(content);
    linkContainer.appendChild(fab);
    linkContainer.appendChild(info);
    this.container.appendChild(linkContainer);

    // Store references
    this.fab = fab;
    this.info = info;

    // Add event listener
    this.fab.addEventListener("click", this.toggleInfo.bind(this));

    // Add touch/mouse event listeners for scrolling
    this.info.addEventListener("mousedown", this.startDragging.bind(this));
    document.addEventListener("mousemove", this.drag.bind(this));
    document.addEventListener("mouseup", this.stopDragging.bind(this));

    // Touch events
    this.info.addEventListener("touchstart", (e) => {
      this.startDragging(e.touches[0]);
    });
    document.addEventListener("touchmove", (e) => {
      e.preventDefault();
      this.drag(e.touches[0]);
    });
    document.addEventListener("touchend", this.stopDragging.bind(this));
  }

  toggleInfo() {
    this.isInfoVisible = !this.isInfoVisible;
    this.fab.classList.toggle("active");
    this.info.classList.toggle("active");
  }

  startDragging(event) {
    if (!this.isInfoVisible) return;
    event.preventDefault(); // Prevent default selection
    this.isDragging = true;
    this.startY = event.clientY;
    this.scrollTop = this.info.scrollTop;
  }

  drag(event) {
    if (!this.isDragging) return;
    const deltaY = this.startY - event.clientY;
    this.info.scrollTop = this.scrollTop + deltaY;
  }

  stopDragging() {
    this.isDragging = false;
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const hmiDemo = document.getElementById("hmi-link-demo");
  new HMILink(hmiDemo);
});
