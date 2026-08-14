import { subDays, format } from 'date-fns';
import type { Cow, MilkRecord, FeedRecord, Expense, Income, AlertNotification } from './types';

export const mockCows: Cow[] = [
  { id: 'COW-001', farmId: 'FARM-1', cowCode: 'C001', tagNumber: 'TAG-101', name: 'Lakshmi', breed: 'Jersey Cross', gender: 'Female', dateOfBirth: '2019-05-12', weight: 420, color: 'Brown', lactationNumber: 3, healthStatus: 'Healthy', pregnancyStatus: 'Pregnant', lastCalvingDate: '2023-01-10', expectedCalvingDate: '2024-03-15', status: 'Active' },
  { id: 'COW-002', farmId: 'FARM-1', cowCode: 'C002', tagNumber: 'TAG-102', name: 'Ganga', breed: 'Holstein Friesian', gender: 'Female', dateOfBirth: '2020-02-20', weight: 450, color: 'Black & White', lactationNumber: 2, healthStatus: 'Healthy', pregnancyStatus: 'Not Ready', lastCalvingDate: '2023-11-05', status: 'Active' },
  { id: 'COW-003', farmId: 'FARM-1', cowCode: 'C003', tagNumber: 'TAG-103', name: 'Gauri', breed: 'Gir', gender: 'Female', dateOfBirth: '2018-08-15', weight: 390, color: 'Red', lactationNumber: 4, healthStatus: 'Under Observation', pregnancyStatus: 'Not Pregnant', lastCalvingDate: '2023-05-20', status: 'Active' },
  { id: 'COW-004', farmId: 'FARM-1', cowCode: 'C004', tagNumber: 'TAG-104', name: 'Bhavani', breed: 'Sahiwal', gender: 'Female', dateOfBirth: '2021-01-10', weight: 380, color: 'Brownish Red', lactationNumber: 1, healthStatus: 'Healthy', pregnancyStatus: 'Inseminated', lastCalvingDate: '2023-12-12', status: 'Active' },
  { id: 'COW-005', farmId: 'FARM-1', cowCode: 'C005', tagNumber: 'TAG-105', name: 'Kamdhenu', breed: 'Jersey', gender: 'Female', dateOfBirth: '2019-11-22', weight: 410, color: 'Light Brown', lactationNumber: 3, healthStatus: 'Sick', pregnancyStatus: 'Not Ready', lastCalvingDate: '2023-09-30', status: 'Active' },
  { id: 'COW-006', farmId: 'FARM-1', cowCode: 'C006', tagNumber: 'TAG-106', name: 'Saraswati', breed: 'Holstein Friesian', gender: 'Female', dateOfBirth: '2020-07-14', weight: 460, color: 'Black & White', lactationNumber: 2, healthStatus: 'Healthy', pregnancyStatus: 'Pregnant', lastCalvingDate: '2023-04-18', expectedCalvingDate: '2024-05-20', status: 'Active' },
  { id: 'COW-007', farmId: 'FARM-1', cowCode: 'C007', tagNumber: 'TAG-107', name: 'Nandini', breed: 'Gir', gender: 'Female', dateOfBirth: '2021-05-05', weight: 375, color: 'Spotted Red', lactationNumber: 1, healthStatus: 'Healthy', pregnancyStatus: 'Heat Detected', lastCalvingDate: '2024-01-05', status: 'Active' },
  { id: 'COW-008', farmId: 'FARM-1', cowCode: 'C008', tagNumber: 'TAG-108', name: 'Radha', breed: 'Jersey Cross', gender: 'Female', dateOfBirth: '2017-10-10', weight: 430, color: 'Dark Brown', lactationNumber: 5, healthStatus: 'Healthy', pregnancyStatus: 'Not Pregnant', lastCalvingDate: '2023-06-15', status: 'Active' },
  { id: 'COW-009', farmId: 'FARM-1', cowCode: 'C009', tagNumber: 'TAG-109', name: 'Kaveri', breed: 'Tharparkar', gender: 'Female', dateOfBirth: '2020-12-01', weight: 395, color: 'White', lactationNumber: 2, healthStatus: 'Healthy', pregnancyStatus: 'Pregnant', lastCalvingDate: '2023-08-22', expectedCalvingDate: '2024-07-10', status: 'Active' },
  { id: 'COW-010', farmId: 'FARM-1', cowCode: 'C010', tagNumber: 'TAG-110', name: 'Dhanya', breed: 'Holstein Friesian', gender: 'Female', dateOfBirth: '2019-03-30', weight: 455, color: 'Black', lactationNumber: 4, healthStatus: 'Healthy', pregnancyStatus: 'Not Ready', lastCalvingDate: '2023-10-10', status: 'Active' },
];

export const generateMockMilkRecords = (): MilkRecord[] => {
  const records: MilkRecord[] = [];
  const today = new Date();
  let idCounter = 1;

  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    mockCows.forEach(cow => {
      // Generate some realistic daily variation based on breed
      const baseYield = cow.breed.includes('Holstein') ? 10 : (cow.breed.includes('Jersey') ? 7 : 5);
      const randomFactor = (Math.random() * 2) - 1; // -1 to +1
      
      const morning = parseFloat(Math.max(0, baseYield + randomFactor).toFixed(1));
      const evening = parseFloat(Math.max(0, baseYield - 0.5 + randomFactor).toFixed(1));
      
      // If sick, reduce milk
      const modifier = cow.healthStatus === 'Sick' ? 0.6 : 1;
      
      records.push({
        id: `MILK-${idCounter++}`,
        cowId: cow.id,
        date,
        morningQuantity: morning * modifier,
        eveningQuantity: evening * modifier,
        totalQuantity: parseFloat(((morning + evening) * modifier).toFixed(1)),
        createdBy: 'worker-1'
      });
    });
  }
  return records;
};

export const generateMockFeedRecords = (): FeedRecord[] => {
  const records: FeedRecord[] = [];
  const today = new Date();
  let idCounter = 1;

  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    mockCows.forEach(cow => {
      records.push({
        id: `FEED-${idCounter++}`,
        cowId: cow.id,
        date,
        feedType: 'Green Fodder',
        quantity: 15 + Math.random() * 5,
        unit: 'kg',
        cost: 30
      });
      records.push({
        id: `FEED-${idCounter++}`,
        cowId: cow.id,
        date,
        feedType: 'Concentrate',
        quantity: 3 + Math.random() * 2,
        unit: 'kg',
        cost: 60
      });
    });
  }
  return records;
};

export const mockExpenses: Expense[] = [
  { id: 'EXP-001', farmId: 'FARM-1', date: format(subDays(new Date(), 5), 'yyyy-MM-dd'), category: 'Feed', description: 'Bought Concentrate Feed', amount: 4500, paymentMethod: 'Bank Transfer' },
  { id: 'EXP-002', farmId: 'FARM-1', date: format(subDays(new Date(), 10), 'yyyy-MM-dd'), category: 'Medicine', description: 'Antibiotics & Vitamins', amount: 1200, paymentMethod: 'Cash' },
  { id: 'EXP-003', farmId: 'FARM-1', date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), category: 'Labour', description: 'Monthly Worker Salary', amount: 15000, paymentMethod: 'Bank Transfer' },
];

export const mockIncome: Income[] = [
  { id: 'INC-001', farmId: 'FARM-1', date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), category: 'Milk Sales', quantity: 120, rate: 45, amount: 5400, paymentStatus: 'Paid' },
  { id: 'INC-002', farmId: 'FARM-1', date: format(subDays(new Date(), 3), 'yyyy-MM-dd'), category: 'Milk Sales', quantity: 125, rate: 45, amount: 5625, paymentStatus: 'Paid' },
  { id: 'INC-003', farmId: 'FARM-1', date: format(subDays(new Date(), 5), 'yyyy-MM-dd'), category: 'Milk Sales', quantity: 130, rate: 45, amount: 5850, paymentStatus: 'Paid' },
];

export const mockAlerts: AlertNotification[] = [
  { id: 'ALT-1', farmId: 'FARM-1', cowId: 'COW-005', type: 'Health', severity: 'CRITICAL', message: 'Kamdhenu is marked as Sick. Veterinary attention required.', isRead: false, isResolved: false, date: new Date().toISOString() },
  { id: 'ALT-2', farmId: 'FARM-1', type: 'Inventory', severity: 'WARNING', message: 'Concentrate feed stock is running low (below 50kg).', isRead: false, isResolved: false, date: new Date().toISOString() },
  { id: 'ALT-3', farmId: 'FARM-1', cowId: 'COW-001', type: 'Breeding', severity: 'INFO', message: 'Lakshmi expected calving in approx 30 days.', isRead: false, isResolved: false, date: new Date().toISOString() },
];
