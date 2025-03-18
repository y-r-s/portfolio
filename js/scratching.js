document.addEventListener("DOMContentLoaded", () => {
  const demo = document.getElementById("scratching-demo");
  if (!demo) return;

  // Create vinyl container
  const vinylContainer = document.createElement("div");
  vinylContainer.className = "vinyl-container";

  // Create vinyl image
  const vinylImg = document.createElement("img");
  vinylImg.className = "vinyl-img";
  vinylImg.src = "images/vinyl1.png";
  vinylImg.alt = "Vinyl Record";
  vinylContainer.appendChild(vinylImg);

  // Create play button
  const playButton = document.createElement("button");
  playButton.className = "play-button";
  playButton.innerHTML = '<i class="fas fa-play"></i>';

  // Create audio element
  const audio = new Audio("audios/labyrinth.mp3");
  audio.loop = true; // Loop the song

  // Scratching variables
  let isScratching = false;
  let lastX = 0;
  let rotation = 0;
  let isPlaying = false;
  let normalPlaybackRate = 1;

  // Play/Pause handling
  playButton.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      vinylImg.classList.remove("spinning");
      playButton.innerHTML = '<i class="fas fa-play"></i>';
    } else {
      audio.play();
      vinylImg.classList.add("spinning");
      playButton.innerHTML = '<i class="fas fa-pause"></i>';
      audio.playbackRate = 1;
      normalPlaybackRate = 1;
    }
    isPlaying = !isPlaying;
  });

  // Scratching event handlers
  vinylContainer.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isScratching = true;
    lastX = e.clientX;
    vinylContainer.classList.add("scratching");
    if (isPlaying) {
      // Store current rotation
      rotation = parseFloat(
        vinylImg.style.getPropertyValue("--rotation") || "0"
      );
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (!isScratching) return;
    e.preventDefault();

    const deltaX = e.clientX - lastX;
    lastX = e.clientX;

    // Update rotation
    rotation += deltaX;
    vinylImg.style.setProperty("--rotation", `${rotation}deg`);

    if (isPlaying) {
      // Adjust playback rate based on scratch speed
      const scratchSpeed = Math.abs(deltaX) / 10;
      const direction = deltaX < 0 ? -1 : 1;
      audio.playbackRate = Math.max(0.1, Math.min(4, scratchSpeed)) * direction;
    }
  });

  document.addEventListener("mouseup", (e) => {
    if (!isScratching) return;
    e.preventDefault();
    isScratching = false;
    vinylContainer.classList.remove("scratching");
    if (isPlaying) {
      // Return to normal playback
      audio.playbackRate = normalPlaybackRate;
    }
  });

  // Add touch event handlers
  vinylContainer.addEventListener("touchstart", (e) => {
    e.preventDefault();
    isScratching = true;
    lastX = e.touches[0].clientX;
    vinylContainer.classList.add("scratching");
    if (isPlaying) {
      rotation = parseFloat(
        vinylImg.style.getPropertyValue("--rotation") || "0"
      );
    }
  });

  document.addEventListener("touchmove", (e) => {
    if (!isScratching) return;
    e.preventDefault();

    const deltaX = e.touches[0].clientX - lastX;
    lastX = e.touches[0].clientX;

    rotation += deltaX;
    vinylImg.style.setProperty("--rotation", `${rotation}deg`);

    if (isPlaying) {
      const scratchSpeed = Math.abs(deltaX) / 10;
      const direction = deltaX < 0 ? -1 : 1;
      audio.playbackRate = Math.max(0.1, Math.min(4, scratchSpeed)) * direction;
    }
  });

  document.addEventListener("touchend", (e) => {
    if (!isScratching) return;
    e.preventDefault();
    isScratching = false;
    vinylContainer.classList.remove("scratching");
    if (isPlaying) {
      audio.playbackRate = normalPlaybackRate;
    }
  });

  // Add elements to demo
  demo.appendChild(vinylContainer);
  demo.appendChild(playButton);

  // Start rotation animation
  function updateRotation() {
    if (isPlaying && !isScratching) {
      rotation += 2; // Adjust speed as needed
      vinylImg.style.setProperty("--rotation", `${rotation}deg`);
    }
    requestAnimationFrame(updateRotation);
  }
  updateRotation();
});
