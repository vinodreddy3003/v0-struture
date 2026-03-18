import { nanoid } from "nanoid";

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: "STOCK_IN_ALLOCATED" | "STOCK_OUT_PICKED" | "TRANSFER_COMPLETED";
  module: "Request" | "Allocation" | "Picking" | "Completion";
  product: string;
  sku: string;
  quantity: number;
  status: "Success" | "Failed" | "Pending";
  requestId: string;
  source: string;
  location: {
    zone: string;
    rack: string;
    section: string;
  };
  beforeState: Record<string, unknown>;
  afterState: Record<string, unknown>;
}

const zones = ["Zone-A", "Zone-B", "Zone-C", "Zone-D"];
const racks = ["Rack-01", "Rack-02", "Rack-03", "Rack-04"];
const sections = ["Section-A", "Section-B", "Section-C"];
const users = [
  "John Smith",
  "Sarah Johnson",
  "Mike Davis",
  "Emily Chen",
  "Alex Rodriguez",
];
const products = [
  "Laptop",
  "Monitor",
  "Keyboard",
  "Mouse",
  "Desk Chair",
  "Printer",
  "Router",
  "USB Cable",
];
const statuses: ("Success" | "Failed" | "Pending")[] = [
  "Success",
  "Failed",
  "Pending",
];
const modules: ("Request" | "Allocation" | "Picking" | "Completion")[] = [
  "Request",
  "Allocation",
  "Picking",
  "Completion",
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateAuditLog(index: number): AuditLog {
  const actions = ["STOCK_IN_ALLOCATED", "STOCK_OUT_PICKED", "TRANSFER_COMPLETED"] as const;
  const action = getRandomItem(actions);
  const timestamp = new Date(
    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  ).toISOString();
  const user = getRandomItem(users);
  const module = getRandomItem(modules);
  const product = getRandomItem(products);
  const quantity = Math.floor(Math.random() * 100) + 1;
  const status = getRandomItem(statuses);
  const zone = getRandomItem(zones);
  const rack = getRandomItem(racks);
  const section = getRandomItem(sections);

  const beforeQuantity = Math.floor(Math.random() * 50);
  const afterQuantity =
    action === "STOCK_IN_ALLOCATED"
      ? beforeQuantity + quantity
      : beforeQuantity - quantity;

  return {
    id: nanoid(),
    timestamp,
    user,
    action,
    module,
    product,
    sku: `SKU-${String(index).padStart(5, "0")}`,
    quantity,
    status,
    requestId: `REQ-${String(index).padStart(8, "0")}`,
    source: getRandomItem(["Manual", "API", "System"]),
    location: { zone, rack, section },
    beforeState: {
      quantity: beforeQuantity,
      location: { zone, rack, section },
      lastUpdated: new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    afterState: {
      quantity: afterQuantity,
      location: { zone, rack, section },
      lastUpdated: timestamp,
    },
  };
}

export const mockAuditLogs: AuditLog[] = Array.from(
  { length: 150 },
  (_, i) => generateAuditLog(i)
).sort(
  (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
);
