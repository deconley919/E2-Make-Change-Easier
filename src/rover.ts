export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const pendingList = document.querySelector<HTMLOListElement>("#rover-pending")!;
const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;

const HEADINGS: Heading[] = [
  { name: "North", directionX: 0, directionY: -1 },
  { name: "East", directionX: 1, directionY: 0 },
  { name: "South", directionX: 0, directionY: 1 },
  { name: "West", directionX: -1, directionY: 0 },
];
let x = 2;
let y = 2;
let direction = 0;

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    HEADINGS[direction].name
  }`;
}

interface Command {
  label: string;
  execute(): void;
}

interface Heading {
  name: string;
  directionX: number;
  directionY: number;
}

function clampToGrid(value: number) {
  return Math.min(4, Math.max(0, value));
}

const moveForward: Command = {
  label: "Forward",
  execute() {
    const heading = HEADINGS[direction];
    x = clampToGrid(x + heading.directionX);
    y = clampToGrid(y + heading.directionY);
  },
};

const turnRight: Command = {
  label: "Right",
  execute() {
    direction = (direction + 1) % HEADINGS.length;
  },
};

const commandQueue: Command[] = [];

function renderQueue() {
  pendingList.replaceChildren(
    ...commandQueue.map((command) => {
      const item = document.createElement("li");
      item.textContent = command.label;
      return item;
    }),
  );
  const isEmpty = commandQueue.length === 0;
  queueStatus.textContent = isEmpty
    ? "Empty"
    : `${commandQueue.length} pending`;
  runButton.disabled = isEmpty;
  clearButton.disabled = isEmpty;
}

function enqueueCommand(command: Command) {
  commandQueue.push(command);
  renderQueue();
}

function runQueue() {
  while (commandQueue.length > 0) {
    commandQueue.shift()!.execute();
  }
  renderQueue();
  drawRover();
}

function clearQueue() {
  commandQueue.length = 0;
  renderQueue();
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  enqueueCommand(moveForward);
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  enqueueCommand(turnRight);
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  clearQueue();
  drawRover();
};
document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = runQueue;
document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = clearQueue;

renderQueue();
drawRover();
