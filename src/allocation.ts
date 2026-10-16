export {};

const PRODUCER_SLOTS = 6;
const OUTPUT_PER_PRODUCER = 3;
const SHIFT_CONSUMPTION = 6;

const RESOURCE_ROWS: ResourceRow[] = [
  { label: "Production", color: "#27766b", value: (shift) => shift.production },
  {
    label: "Consumption",
    color: "#a44d23",
    value: (shift) => shift.consumption,
  },
];

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let producerCount = 2;

interface ShiftResult {
  producers: number;
  producerSlots: number;
  production: number;
  consumption: number;
  balance: number;
}

interface ResourceRow {
  label: string;
  color: string;
  value: (shift: ShiftResult) => number;
}

function calculateShift(producers: number): ShiftResult {
  const production = producers * OUTPUT_PER_PRODUCER;
  return {
    producers,
    producerSlots: PRODUCER_SLOTS,
    production,
    consumption: SHIFT_CONSUMPTION,
    balance: production - SHIFT_CONSUMPTION,
  };
}

function updateDisplay() {
  const shift = calculateShift(producerCount);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawProducerSlots(shift);
  drawResourceBars(shift);
  updateReadout(shift);
}

function drawProducerSlots(shift: ShiftResult) {
  for (let i = 0; i < shift.producerSlots; i++) {
    ctx.fillStyle = i < shift.producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < shift.producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function drawResourceBars(shift: ShiftResult) {
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(
    `Producers: ${shift.producers} / ${shift.producerSlots}`,
    18,
    76,
  );

  RESOURCE_ROWS.forEach((row, index) => {
    const labelY = 102 + index * 52;
    const value = row.value(shift);
    ctx.fillStyle = "#233e43";
    ctx.fillText(`${row.label}: ${value}`, 18, labelY);
    ctx.fillStyle = row.color;
    ctx.fillRect(18, labelY + 8, value * 14, 20);
  });
}

function updateReadout(shift: ShiftResult) {
  readout.textContent =
    `Assigned: ${shift.producers}/${shift.producerSlots} · Production: ${shift.production} · Consumption: ${shift.consumption} · Balance: ${
      shift.balance > 0 ? "+" : ""
    }${shift.balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producerCount = Math.max(0, producerCount - 1);
  updateDisplay();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producerCount = Math.min(PRODUCER_SLOTS, producerCount + 1);
  updateDisplay();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producerCount = 2;
    updateDisplay();
  };
updateDisplay();
