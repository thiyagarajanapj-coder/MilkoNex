export type Role = 'admin' | 'worker';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  farmId: string;
}

export interface Farm {
  id: string;
  name: string;
  ownerId: string;
  address: string;
  phone: string;
}

export type HealthStatus = 'Healthy' | 'Under Observation' | 'Sick' | 'Under Treatment' | 'Recovered';
export type PregnancyStatus = 'Not Ready' | 'Heat Detected' | 'Inseminated' | 'Pregnancy Check Pending' | 'Pregnant' | 'Not Pregnant' | 'Calved';

export interface Cow {
  id: string;
  farmId: string;
  cowCode: string;
  tagNumber: string;
  name: string;
  breed: string;
  gender: 'Female' | 'Male';
  dateOfBirth: string; // ISO String
  weight: number;
  color: string;
  lactationNumber: number;
  healthStatus: HealthStatus;
  pregnancyStatus: PregnancyStatus;
  lastCalvingDate?: string;
  expectedCalvingDate?: string;
  photoUrl?: string;
  status: 'Active' | 'Sold' | 'Deceased';
}

export interface MilkRecord {
  id: string;
  cowId: string;
  date: string; // YYYY-MM-DD
  morningQuantity: number;
  eveningQuantity: number;
  totalQuantity: number;
  fatPercentage?: number;
  snfPercentage?: number;
  quality?: string;
  notes?: string;
  createdBy: string;
}

export interface FeedRecord {
  id: string;
  cowId: string;
  date: string; // YYYY-MM-DD
  feedType: string;
  quantity: number;
  unit: string;
  cost: number;
  notes?: string;
}

export interface HealthRecord {
  id: string;
  cowId: string;
  date: string; // YYYY-MM-DD
  healthStatus: HealthStatus;
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
  medicine?: string;
  dosage?: string;
  vetName?: string;
  followUpDate?: string;
  notes?: string;
}

export interface VaccinationRecord {
  id: string;
  cowId: string;
  vaccineName: string;
  vaccineType: string;
  administeredDate: string; // YYYY-MM-DD
  nextDueDate?: string; // YYYY-MM-DD
  dose?: string;
  batchNumber?: string;
  veterinarian?: string;
  notes?: string;
}

export interface TemperatureRecord {
  id: string;
  cowId: string;
  date: string;
  time: string;
  temperature: number;
  measurementMethod?: string;
  notes?: string;
}

export interface BreedingRecord {
  id: string;
  cowId: string;
  heatDate?: string;
  inseminationDate?: string;
  matingDate?: string;
  pregnancyCheckDate?: string;
  pregnancyStatus?: PregnancyStatus;
  expectedCalvingDate?: string;
  actualCalvingDate?: string;
  bullInformation?: string;
  notes?: string;
}

export interface Expense {
  id: string;
  farmId: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  supplier?: string;
  notes?: string;
}

export interface Income {
  id: string;
  farmId: string;
  date: string;
  category: string;
  quantity?: number;
  rate?: number;
  amount: number;
  buyer?: string;
  paymentStatus: 'Pending' | 'Paid';
  notes?: string;
}

export interface AlertNotification {
  id: string;
  farmId: string;
  cowId?: string;
  type: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  isRead: boolean;
  isResolved: boolean;
  date: string;
}
