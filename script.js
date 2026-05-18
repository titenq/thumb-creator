const canvas = document.querySelector("#thumbCanvas");
const ctx = canvas.getContext("2d");

const inputs = {
  episode: document.querySelector("#episodeInput"),
  guest: document.querySelector("#guestInput"),
  description: document.querySelector("#descriptionInput"),
  photo: document.querySelector("#photoInput"),
  fileName: document.querySelector("#fileName"),
  scale: document.querySelector("#scaleInput"),
  x: document.querySelector("#xInput"),
  y: document.querySelector("#yInput"),
  center: document.querySelector("#centerButton"),
  download: document.querySelector("#downloadButton"),
};

const W = canvas.width;
const H = canvas.height;
const displayFont = '"Bebas Neue", "Arial Narrow", Impact, sans-serif';

const template = new Image();

template.src = "assets/template-bg.png";

const state = {
  photo: null,
  photoName: "thumb-osprogramadores",
  isDragging: false,
  dragStart: { x: 0, y: 0 },
  photoStart: { x: 0, y: 0 },
};

const avatar = { x: 956, y: 349, r: 184 };
const colors = {
  white: "#f8fbff",
  teal: "#08c8bd",
  cyan: "#26f4ff",
  dark: "#061222",
};

const render = () => {
  drawPhotoPlaceholder();
  drawPhoto();
  drawTemplate();
  drawEditableTexts();
};

const drawTemplate = () => {
  if (template.complete && template.naturalWidth) {
    ctx.drawImage(template, 0, 0, W, H);

    return;
  }

  ctx.fillStyle = colors.dark;
  ctx.fillRect(0, 0, W, H);
};

const drawPhoto = () => {
  if (!state.photo) {
    return;
  }

  const scale = Number(inputs.scale.value);
  const offsetX = Number(inputs.x.value);
  const offsetY = Number(inputs.y.value);

  ctx.save();
  ctx.beginPath();
  ctx.arc(avatar.x, avatar.y, avatar.r, 0, Math.PI * 2);
  ctx.clip();

  drawCoverImage(
    state.photo,
    avatar.x + offsetX,
    avatar.y + offsetY,
    avatar.r * 2,
    avatar.r * 2,
    scale,
  );

  ctx.restore();
};

const drawPhotoPlaceholder = () => {
  const gradient = ctx.createRadialGradient(avatar.x, avatar.y, 30, avatar.x, avatar.y, avatar.r);

  gradient.addColorStop(0, "#214257");
  gradient.addColorStop(1, "#071524");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
};

const drawEditableTexts = () => {
  drawEpisode();
  drawGuestName();
  drawDescription();
};

const drawEpisode = () => {
  ctx.save();

  drawFittedText(`EPISÓDIO ${inputs.episode.value || ""}`.trim(), 58, 184, 450, {
    maxSize: 76,
    minSize: 34,
    weight: "400",
    style: "normal",
    family: displayFont,
    shadow: true,
  });

  ctx.restore();
};

const drawBrandStrip = () => {
  ctx.save();
  ctx.translate(32, 234);
  ctx.rotate(-0.028);

  drawPolygon([
    [0, 0],
    [658, -18],
    [648, 92],
    [-6, 122],
  ], colors.teal);

  const glow = ctx.createLinearGradient(0, 0, 650, 92);

  glow.addColorStop(0, "rgba(255, 255, 255, 0.12)");
  glow.addColorStop(0.5, "rgba(255, 255, 255, 0)");
  glow.addColorStop(1, "rgba(38, 244, 255, 0.22)");

  drawPolygon([
    [0, 0],
    [658, -18],
    [648, 92],
    [-6, 122],
  ], glow);

  ctx.strokeStyle = "rgba(38, 244, 255, 0.72)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-14, 122);
  ctx.lineTo(650, 92);
  ctx.stroke();

  drawFittedText("OSPROGRAMADORES", 34, 78, 600, {
    maxSize: 64,
    minSize: 32,
    weight: "900",
    style: "italic",
    family: displayFont,
    shadow: true,
  });

  ctx.restore();
};

const drawPodcastPanel = () => {
  ctx.save();
  ctx.translate(33, 358);
  ctx.rotate(-0.02);

  drawPolygon([
    [0, 0],
    [422, -8],
    [386, 82],
    [0, 92],
  ], "rgba(3, 18, 34, 0.95)");

  ctx.strokeStyle = "rgba(38, 244, 255, 0.78)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.restore();

  drawFittedText("PODCAST", 92, 428, 355, {
    maxSize: 72,
    minSize: 46,
    weight: "900",
    style: "italic",
    family: displayFont,
    shadow: true,
  });

  drawSlashes(462, 382, 7, 20, "rgba(38, 244, 255, 0.82)");
};

const drawGuestName = () => {
  const guest = (inputs.guest.value || "NOME DO CONVIDADO").toUpperCase();

  drawMultilineFittedText(guest, 38, 512, 720, 132, {
    maxSize: 104,
    minSize: 34,
    weight: "400",
    lineHeight: 0.98,
    style: "normal",
    family: displayFont,
    shadow: true,
  });
};

const drawDescription = () => {
  drawMultilineFittedText(inputs.description.value || "Descrição do convidado", 38, 596, 720, 58, {
    maxSize: 30,
    minSize: 16,
    weight: "400",
    style: "normal",
    lineHeight: 1.14,
    color: colors.teal,
    family: displayFont,
  });

  ctx.save();
  ctx.strokeStyle = "rgba(8, 200, 189, 0.95)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(38, 626);
  ctx.lineTo(748, 626);
  ctx.arc(758, 626, 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
};

const drawSoftMask = (x, y, width, height) => {
  const gradient = ctx.createLinearGradient(x, y, x + width, y + height);

  gradient.addColorStop(0, "rgba(4, 15, 30, 0.98)");
  gradient.addColorStop(0.62, "rgba(4, 15, 30, 0.95)");
  gradient.addColorStop(1, "rgba(4, 15, 30, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
};

const drawAvatarRings = () => {
  ctx.save();
  ctx.lineCap = "butt";
  ctx.shadowColor = "rgba(38, 244, 255, 0.92)";
  ctx.shadowBlur = 14;
  ctx.lineWidth = 7;
  ctx.strokeStyle = "rgba(38, 244, 255, 0.92)";
  ctx.beginPath();
  ctx.arc(avatar.x, avatar.y, avatar.r + 26, -0.16, Math.PI * 1.75);
  ctx.stroke();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.82)";
  ctx.beginPath();
  ctx.arc(avatar.x, avatar.y, avatar.r + 4, -0.08, Math.PI * 1.62);
  ctx.stroke();
  ctx.setLineDash([16, 9]);
  ctx.lineWidth = 7;
  ctx.strokeStyle = "rgba(38, 244, 255, 0.76)";
  ctx.beginPath();
  ctx.arc(avatar.x, avatar.y, avatar.r - 12, Math.PI * 0.84, Math.PI * 1.24);
  ctx.stroke();
  ctx.restore();
};

const drawCoverImage = (image, cx, cy, boxW, boxH, zoom) => {
  const base = Math.max(boxW / image.naturalWidth, boxH / image.naturalHeight);
  const drawW = image.naturalWidth * base * zoom;
  const drawH = image.naturalHeight * base * zoom;

  ctx.drawImage(image, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
};

const drawPolygon = (points, fillStyle) => {
  ctx.beginPath();

  points.forEach(([x, y], index) => {
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
};

const drawSlashes = (x, y, count, size, color) => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 7;

  for (let i = 0; i < count; i++) {
    const ox = x + i * (size * 0.72);

    ctx.beginPath();
    ctx.moveTo(ox, y + size);
    ctx.lineTo(ox + size * 0.48, y);
    ctx.stroke();
  }

  ctx.restore();
};

const drawFittedText = (text, x, y, maxWidth, options = {}) => {
  const {
    maxSize = 64,
    minSize = 20,
    weight = "700",
    style = "normal",
    family = displayFont,
    color = colors.white,
    shadow = false,
  } = options;

  let size = maxSize;

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = color;

  applyTextShadow(shadow);

  while (size > minSize) {
    ctx.font = `${style} ${weight} ${size}px ${family}`;

    if (ctx.measureText(text).width <= maxWidth) {
      break;
    }

    size -= 1;
  }

  ctx.font = `${style} ${weight} ${size}px ${family}`;
  ctx.fillText(text, x, y);

  clearTextShadow();
};

const drawMultilineFittedText = (text, x, y, maxWidth, maxHeight, options = {}) => {
  const {
    maxSize = 58,
    minSize = 16,
    weight = "500",
    style = "normal",
    lineHeight = 1.12,
    family = displayFont,
    color = colors.white,
    shadow = false,
  } = options;

  const words = text.trim().split(/\s+/).filter(Boolean);
  let size = maxSize;
  let lines = [];

  while (size >= minSize) {
    ctx.font = `${style} ${weight} ${size}px ${family}`;
    lines = wrapWords(words, maxWidth);

    const height = lines.length * size * lineHeight;
    const widest = Math.max(...lines.map((line) => ctx.measureText(line).width), 0);

    if (height <= maxHeight && widest <= maxWidth) {
      break;
    }

    size -= 1;
  }

  ctx.font = `${style} ${weight} ${size}px ${family}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;

  applyTextShadow(shadow);

  const totalHeight = lines.length * size * lineHeight;
  const firstY = y - totalHeight / 2 + (size * lineHeight) / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, x, firstY + index * size * lineHeight);
  });

  clearTextShadow();
};

const wrapWords = (words, maxWidth) => {
  const lines = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;

    if (ctx.measureText(test).width <= maxWidth || !current) {
      current = test;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.length ? lines : [""];
};

const applyTextShadow = (enabled) => {
  ctx.shadowColor = enabled ? "rgba(0, 0, 0, 0.72)" : "transparent";
  ctx.shadowBlur = enabled ? 8 : 0;
  ctx.shadowOffsetX = enabled ? 5 : 0;
  ctx.shadowOffsetY = enabled ? 5 : 0;
};

const clearTextShadow = () => {
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};

const centerPhoto = () => {
  inputs.scale.value = "1";
  inputs.x.value = "0";
  inputs.y.value = "0";

  render();
};

const loadPhoto = (file) => {
  if (!file) {
    return;
  }

  inputs.fileName.textContent = file.name;

  const reader = new FileReader();

  reader.onload = () => {
    const image = new Image();

    image.onload = () => {
      state.photo = image;
      state.photoName = file.name.replace(/\.[^.]+$/, "") || "thumb-osprogramadores";
      centerPhoto();
    };

    image.src = reader.result;
  };

  reader.readAsDataURL(file);
};

const downloadThumb = async () => {
  if (document.fonts) {
    await document.fonts.ready;
  }

  render();

  const link = document.createElement("a");
  const episode = inputs.episode.value || "episodio";

  const guest = (inputs.guest.value || "convidado")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  
  link.download = `osprogramadores-episodio-${episode}-${guest || state.photoName}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
};

const canvasPoint = (event) => {
  const rect = canvas.getBoundingClientRect();
  const pointer = event.touches ? event.touches[0] : event;

  return {
    x: ((pointer.clientX - rect.left) / rect.width) * W,
    y: ((pointer.clientY - rect.top) / rect.height) * H,
  };
};

const isInsideAvatar = (point) => {
  return Math.hypot(point.x - avatar.x, point.y - avatar.y) <= avatar.r + 20;
};

const startDrag = (event) => {
  if (!state.photo) {
    return;
  }

  const point = canvasPoint(event);

  if (!isInsideAvatar(point)) {
    return;
  }

  state.isDragging = true;
  state.dragStart = point;
  state.photoStart = {
    x: Number(inputs.x.value),
    y: Number(inputs.y.value),
  };
};

const moveDrag = (event) => {
  if (!state.isDragging) {
    return;
  }

  event.preventDefault();

  const point = canvasPoint(event);

  inputs.x.value = clamp(state.photoStart.x + point.x - state.dragStart.x, -360, 360);
  inputs.y.value = clamp(state.photoStart.y + point.y - state.dragStart.y, -360, 360);

  render();
};

const stopDrag = () => {
  state.isDragging = false;
};

const clamp = (value, min, max) => {
  return Math.min(max, Math.max(min, Math.round(value)));
};

const liveRenderInputs = [
  inputs.episode,
  inputs.guest,
  inputs.description,
  inputs.scale,
  inputs.x,
  inputs.y,
];

template.onload = render;

if (document.fonts) {
  Promise.all([
    document.fonts.load(`400 76px ${displayFont}`),
    document.fonts.load(`400 88px ${displayFont}`),
    document.fonts.load(`400 32px ${displayFont}`),
    document.fonts.ready,
  ]).then(render);
}

liveRenderInputs.forEach((input) => input.addEventListener("input", render));

inputs.photo.addEventListener("change", (event) => loadPhoto(event.target.files[0]));
inputs.center.addEventListener("click", centerPhoto);
inputs.download.addEventListener("click", downloadThumb);

canvas.addEventListener("mousedown", startDrag);
canvas.addEventListener("mousemove", moveDrag);
window.addEventListener("mouseup", stopDrag);
canvas.addEventListener("touchstart", startDrag, { passive: true });
canvas.addEventListener("touchmove", moveDrag, { passive: false });
window.addEventListener("touchend", stopDrag);

render();
