const blobContainer = document.getElementById("blobContainer");
const numberOfBlobs = 5;
const blobs = [];

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

for (let i = 0; i < numberOfBlobs; i++) {
  createBlob(i);
}

function createBlob(index) {
  const blob = document.createElement("div");
  blob.classList.add("blob");

  const size = Math.random() * 400 + 250;
  const width = size * (0.8 + Math.random() * 0.4);
  const height = size * (0.8 + Math.random() * 0.4);

  const left = Math.random() * window.innerWidth;
  const top = Math.random() * window.innerHeight;

  blob.style.width = `${width}px`;
  blob.style.height = `${height}px`;
  blob.style.left = `${left}px`;
  blob.style.top = `${top}px`;

  const brightSpotX = 20 + Math.random() * 30;
  const brightSpotY = 20 + Math.random() * 30;

  const baseHue = 270 + Math.random() * 20;
  const satBase = 85 + Math.random() * 15;
  const lightBase = 60 + Math.random() * 20;

  const gradient = `radial-gradient(
        circle at ${brightSpotX}% ${brightSpotY}%,
        hsla(${baseHue - 10}, ${satBase}%, ${lightBase + 15}%, 0.95),
        hsla(${baseHue}, ${satBase}%, ${lightBase}%, 0.85) 30%,
        hsla(${baseHue + 5}, ${satBase - 10}%, ${lightBase - 15}%, 0.75) 60%,
        hsla(${baseHue + 10}, ${satBase - 15}%, ${lightBase - 30}%, 0.6) 80%
      )`;

  const glowColor = `rgba(${120 + Math.random() * 60}, ${
    40 + Math.random() * 30
  }, ${220 + Math.random() * 35}, ${0.4 + Math.random() * 0.3})`;

  blob.style.background = gradient;
  blob.style.boxShadow = `0 0 ${Math.random() * 50 + 80}px ${
    Math.random() * 30 + 20
  }px ${glowColor}`;
  blob.style.filter = `blur(${20 + Math.random() * 50}px)`;
  blob.style.opacity = 0.7 + Math.random() * 0.3;

  const blobInfo = {
    element: blob,
    x: left,
    y: top,
    width,
    height,
    xSpeed: (Math.random() - 0.5) * 0.7,
    ySpeed: (Math.random() - 0.5) * 0.7,
    pulseSpeed: 0.001 + Math.random() * 0.003,
    pulseAmount: 0.05 + Math.random() * 0.15,
    pulseOffset: Math.random() * Math.PI * 2,
    mouseInfluence: 0.05 + Math.random() * 0.15,
    scaleX: 1,
    scaleY: 1,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 0.3,
    zIndex: Math.floor(Math.random() * 10),
  };

  blob.style.zIndex = blobInfo.zIndex;

  blobs.push(blobInfo);
  blobContainer.appendChild(blob);
}

function animateBlobs() {
  const now = Date.now();
  blobs.forEach((blob, index) => {
    blob.x += blob.xSpeed;
    blob.y += blob.ySpeed;

    const time = now * blob.pulseSpeed + blob.pulseOffset;
    const pulse = 1 + Math.sin(time) * blob.pulseAmount;

    const dx = mouseX - blob.x;
    const dy = mouseY - blob.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 400;

    if (distance < maxDistance) {
      const influence = (1 - distance / maxDistance) * blob.mouseInfluence;

      if (index % 3 === 0) {
        blob.x += dx * influence;
        blob.y += dy * influence;
        blob.scaleX = 1 + influence * 0.6;
        blob.scaleY = 1 + influence * 0.4;
      } else if (index % 3 === 1) {
        blob.x -= dx * influence * 0.3;
        blob.y -= dy * influence * 0.3;
        blob.scaleX = 1 - influence * 0.2;
        blob.scaleY = 1 + influence * 0.5;
      } else {
        const angle = Math.atan2(dy, dx);
        blob.x += Math.cos(angle + Math.PI / 2) * influence * 3;
        blob.y += Math.sin(angle + Math.PI / 2) * influence * 3;
        blob.scaleX = 1 + influence * 0.3;
        blob.scaleY = 1 + influence * 0.3;
      }

      blob.rotation += blob.rotationSpeed * (1 + influence * 3);

      const brightSpotX = 20 + influence * 40;
      const brightSpotY = 20 + influence * 40;
      const baseHue = 270 + influence * 30;

      const gradient = `radial-gradient(
            circle at ${brightSpotX}% ${brightSpotY}%,
            hsla(${baseHue - 10}, 85%, 75%, 0.95),
            hsla(${baseHue}, 80%, 60%, 0.85) 30%,
            hsla(${baseHue + 5}, 75%, 45%, 0.75) 60%,
            hsla(${baseHue + 10}, 70%, 30%, 0.6) 80%
          )`;

      blob.element.style.background = gradient;
    } else {
      blob.scaleX = 1;
      blob.scaleY = 1;
      blob.rotation += blob.rotationSpeed;
    }

    if (blob.x > window.innerWidth + 100) blob.x = -100;
    if (blob.x < -100) blob.x = window.innerWidth + 100;
    if (blob.y > window.innerHeight + 100) blob.y = -100;
    if (blob.y < -100) blob.y = window.innerHeight + 100;

    blob.element.style.transition = "transform 0.3s ease-out";
    blob.element.style.transform = `translate(-50%, -50%) rotate(${
      blob.rotation
    }deg) scale(${blob.scaleX * pulse}, ${blob.scaleY * pulse})`;
    blob.element.style.left = `${blob.x}px`;
    blob.element.style.top = `${blob.y}px`;
  });

  requestAnimationFrame(animateBlobs);
}

animateBlobs();

window.addEventListener("resize", () => {
  const widthRatio = window.innerWidth / (window.innerWidth - 1);
  const heightRatio = window.innerHeight / (window.innerHeight - 1);

  blobs.forEach((blob) => {
    blob.x = Math.min(
      Math.max(blob.x * widthRatio, -100),
      window.innerWidth + 100
    );
    blob.y = Math.min(
      Math.max(blob.y * heightRatio, -100),
      window.innerHeight + 100
    );
  });
});
