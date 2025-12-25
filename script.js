document.addEventListener("DOMContentLoaded", () => {
  const asciiOutput = document.getElementById("ascii-output");
  const playButton = document.getElementById("play-button");
  const pauseButton = document.getElementById("pause-button");
  const audio = document.getElementById("background-audio");
  const volumeControl = document.getElementById("volume-control");

  let frames = [];
  let currentFrame = 0;
  const frameRate = 10; // 10 frames per second
  const frameInterval = 1000 / frameRate; // Milliseconds per frame

  let animationInterval = null; // To store the interval ID
  let isPlaying = false;

  // Set initial volume
  audio.volume = volumeControl.value;

  // Add event listener for volume control
  volumeControl.addEventListener("input", (e) => {
    audio.volume = e.target.value;
  });

  // Function to fetch and load ASCII frames
  async function loadAsciiFrames() {
    try {
      const response = await fetch("ascii_frames.json");
      frames = await response.json();
      if (frames.length > 0) {
        // Display the first frame initially
        asciiOutput.textContent = frames[0];
      } else {
        asciiOutput.textContent = "No ASCII frames found.";
      }
    } catch (error) {
      console.error("Error loading ASCII frames:", error);
      asciiOutput.textContent = "Error loading ASCII frames.";
    }
  }

  // Function to update the ASCII art display
  function updateFrame() {
    currentFrame = (currentFrame + 1) % frames.length; // Loop animation
    if (currentFrame === 0) {
      // If looped, reset audio to the beginning
      audio.currentTime = 0;
    }
    asciiOutput.textContent = frames[currentFrame];
  }

  // Function to start the animation
  function playAnimation() {
    if (!isPlaying && frames.length > 0) {
      // If paused, just resume. If starting from scratch, reset time.
      if (currentFrame === 0) {
        audio.currentTime = 0;
      }
      audio.play();
      animationInterval = setInterval(updateFrame, frameInterval);
      isPlaying = true;
      playButton.style.display = "none";
      pauseButton.style.display = "block";
    }
  }

  // Function to pause the animation
  function pauseAnimation() {
    if (isPlaying) {
      clearInterval(animationInterval);
      audio.pause();
      isPlaying = false;
      playButton.style.display = "block";
      pauseButton.style.display = "none";
    }
  }

  // Add event listeners to buttons
  playButton.addEventListener("click", playAnimation);
  pauseButton.addEventListener("click", pauseAnimation);

  // Load frames when the page loads
  loadAsciiFrames();

  // Prevent text selection and context menu
  document.addEventListener("selectstart", (e) => e.preventDefault());
  document.addEventListener("contextmenu", (e) => e.preventDefault());
});
