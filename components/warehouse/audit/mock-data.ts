import { AuditLog } from '../types';

const PRODUCTS = [
  'Soya Milk',
  'Almond Milk',
  'Coconut Oil',
  'Refined Sugar',
  'Wheat Flour',
  'Rice Bran',
  'Coffee Beans',
  'Cocoa Powder',
];

const USERS = ['Somali Kumar', 'Narayan', 'Priya Singh', 'Amit Patel', 'Rajesh Verma'];

const ZONES = ['Raw Materials', 'Finished Goods', 'Cold Storage', 'Packing Area'];
const SECTIONS = ['Section A', 'Section B', 'Section C', 'Section D'];
const SHELVES = ['Shelf 1', 'Shelf 2', 'Shelf 3', 'Shelf 4', 'Shelf 5'];

// Fixed base date for deterministic timestamp generation (March 19, 2024)
const BASE_DATE_MS = 1710806400000;

// Seeded random number generator for deterministic output
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getRandomElement<T>(array: T[], seed: number): T {
  const index = Math.floor(seededRandom(seed) * array.length);
  return array[index];
}

function generateRandomDate(daysAgo: number = 2, seed: number): Date {
  // Use fixed base timestamp to ensure consistency between server and client
  const randomOffset = seededRandom(seed) * daysAgo * 24 * 60 * 60 * 1000;
  return new Date(BASE_DATE_MS - randomOffset);
}

export function generateMockAuditLogs(count: number = 50): AuditLog[] {
  const logs: AuditLog[] = [];

  for (let i = 0; i < count; i++) {
    const baseSeed = i * 7; // Use index as base seed for deterministic output
    
    const type = getRandomElement<'stock-in' | 'stock-out' | 'stock-transfer'>(
      ['stock-in', 'stock-out', 'stock-transfer'],
      baseSeed
    );
    
    const quantity = Math.floor(seededRandom(baseSeed + 1) * 90) + 10;
    const status = getRandomElement<'pending' | 'picked' | 'completed' | 'failed'>(
      ['pending', 'picked', 'completed', 'failed'],
      baseSeed + 2
    );
    
    const beforeQuantity = Math.floor(seededRandom(baseSeed + 3) * 400) + 100;
    const afterQuantity =
      type === 'stock-out'
        ? beforeQuantity - quantity
        : type === 'stock-in'
          ? beforeQuantity + quantity
          : beforeQuantity;

    logs.push({
      id: `AL-${String(count - i).padStart(5, '0')}`,
      type,
      productName: getRandomElement(PRODUCTS, baseSeed + 4),
      quantity,
      sign: type === 'stock-out' ? '-' : '+',
      sourceLocation:
        type !== 'stock-in'
          ? `${getRandomElement(ZONES, baseSeed + 5)} > ${getRandomElement(SECTIONS, baseSeed + 6)}`
          : undefined,
      destinationLocation:
        type !== 'stock-out'
          ? `${getRandomElement(ZONES, baseSeed + 7)} > ${getRandomElement(SECTIONS, baseSeed + 8)}`
          : undefined,
      user: getRandomElement(USERS, baseSeed + 9),
      timestamp: generateRandomDate(2, baseSeed + 10),
      status,
      referenceId: `REF-${String(Math.floor(seededRandom(baseSeed + 11) * 100000)).padStart(5, '0')}`,
      zone: getRandomElement(ZONES, baseSeed + 12),
      section: getRandomElement(SECTIONS, baseSeed + 13),
      shelf: getRandomElement(SHELVES, baseSeed + 14),
      beforeQuantity,
      afterQuantity,
      actionDescription: `${type === 'stock-in' ? 'Received' : type === 'stock-out' ? 'Shipped' : 'Transferred'} ${quantity} units`,
      requestId: `REQ-${String(Math.floor(seededRandom(baseSeed + 15) * 10000)).padStart(4, '0')}`,
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
