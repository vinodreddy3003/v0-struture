import { AuditLog } from '../types';

const PRODUCTS = [
  'Widget A',
  'Widget B',
  'Gadget X',
  'Component Y',
  'Part Z',
  'Assembly 1',
  'Module 2',
  'Unit 3',
];

const USERS = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Elena Garcia', 'Robert Kim'];

const ZONES = ['Raw Materials', 'Finished Goods', 'Cold Storage', 'Packing Area'];
const SECTIONS = ['Section A', 'Section B', 'Section C', 'Section D'];
const SHELVES = ['Shelf 1', 'Shelf 2', 'Shelf 3', 'Shelf 4', 'Shelf 5'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomDate(daysAgo: number = 30): Date {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
  return pastDate;
}

export function generateMockAuditLogs(count: number = 50): AuditLog[] {
  const logs: AuditLog[] = [];

  for (let i = 0; i < count; i++) {
    const type = getRandomElement<'stock-in' | 'stock-out' | 'stock-transfer'>([
      'stock-in',
      'stock-out',
      'stock-transfer',
    ]);
    const quantity = Math.floor(Math.random() * 100) + 10;
    const status = getRandomElement<'pending' | 'picked' | 'completed' | 'failed'>([
      'pending',
      'picked',
      'completed',
      'failed',
    ]);
    const beforeQuantity = Math.floor(Math.random() * 500) + 100;
    const afterQuantity =
      type === 'stock-out'
        ? beforeQuantity - quantity
        : type === 'stock-in'
          ? beforeQuantity + quantity
          : beforeQuantity;

    logs.push({
      id: `AL-${String(i + 1).padStart(5, '0')}`,
      type,
      productName: getRandomElement(PRODUCTS),
      quantity,
      sign: type === 'stock-out' ? '-' : '+',
      sourceLocation:
        type !== 'stock-in'
          ? `${getRandomElement(ZONES)} > ${getRandomElement(SECTIONS)}`
          : undefined,
      destinationLocation:
        type !== 'stock-out'
          ? `${getRandomElement(ZONES)} > ${getRandomElement(SECTIONS)}`
          : undefined,
      user: getRandomElement(USERS),
      timestamp: generateRandomDate(),
      status,
      referenceId: `REF-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      zone: getRandomElement(ZONES),
      section: getRandomElement(SECTIONS),
      shelf: getRandomElement(SHELVES),
      beforeQuantity,
      afterQuantity,
      actionDescription: `${type === 'stock-in' ? 'Received' : type === 'stock-out' ? 'Shipped' : 'Transferred'} ${quantity} units from ${getRandomElement(USERS)}`,
      requestId: `REQ-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
