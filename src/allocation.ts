export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let producerCount = 2;

function updateDisplay() {
  const totalProduction = producerCount * 3;
  const totalConsumption = 6;
  const balance = totalProduction - totalConsumption;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawProducerSlots();
  drawResourceBars(totalProduction, totalConsumption);
  updateReadout(totalProduction, totalConsumption, balance);
}

function drawProducerSlots() {
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < producerCount ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < producerCount ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function drawResourceBars(production: number, consumption: number) {
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${producerCount} / 6`, 18, 76);
  ctx.fillText(`Production: ${production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, consumption * 14, 20);
}

function updateReadout(
  production: number,
  consumption: number,
  balance: number,
) {
  readout.textContent =
    `Assigned: ${producerCount}/6 · Production: ${production} · Consumption: ${consumption} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producerCount = Math.max(0, producerCount - 1);
  updateDisplay();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producerCount = Math.min(6, producerCount + 1);
  updateDisplay();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producerCount = 2;
    updateDisplay();
  };
updateDisplay();
