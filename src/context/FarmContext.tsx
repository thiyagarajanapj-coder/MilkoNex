import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Cow, MilkRecord, FeedRecord, Expense, Income, AlertNotification, HealthRecord, VaccinationRecord, TemperatureRecord, BreedingRecord } from '../lib/types';
import { mockCows, generateMockMilkRecords, generateMockFeedRecords, mockExpenses, mockIncome, mockAlerts } from '../lib/mockData';

interface FarmContextType {
  cows: Cow[];
  setCows: React.Dispatch<React.SetStateAction<Cow[]>>;
  milkRecords: MilkRecord[];
  setMilkRecords: React.Dispatch<React.SetStateAction<MilkRecord[]>>;
  feedRecords: FeedRecord[];
  setFeedRecords: React.Dispatch<React.SetStateAction<FeedRecord[]>>;
  healthRecords: HealthRecord[];
  setHealthRecords: React.Dispatch<React.SetStateAction<HealthRecord[]>>;
  vaccinationRecords: VaccinationRecord[];
  setVaccinationRecords: React.Dispatch<React.SetStateAction<VaccinationRecord[]>>;
  temperatureRecords: TemperatureRecord[];
  setTemperatureRecords: React.Dispatch<React.SetStateAction<TemperatureRecord[]>>;
  breedingRecords: BreedingRecord[];
  setBreedingRecords: React.Dispatch<React.SetStateAction<BreedingRecord[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  income: Income[];
  setIncome: React.Dispatch<React.SetStateAction<Income[]>>;
  alerts: AlertNotification[];
  setAlerts: React.Dispatch<React.SetStateAction<AlertNotification[]>>;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use a helper to init state from localStorage or fallback to mock data
  const initData = <T,>(key: string, defaultData: T | (() => T)): T => {
    const stored = localStorage.getItem(`farm_${key}`);
    if (stored) return JSON.parse(stored);
    return typeof defaultData === 'function' ? (defaultData as () => T)() : defaultData;
  };

  const [cows, setCows] = useState<Cow[]>(() => initData('cows', mockCows));
  const [milkRecords, setMilkRecords] = useState<MilkRecord[]>(() => initData('milk', generateMockMilkRecords));
  const [feedRecords, setFeedRecords] = useState<FeedRecord[]>(() => initData('feed', generateMockFeedRecords));
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(() => initData('health', []));
  const [vaccinationRecords, setVaccinationRecords] = useState<VaccinationRecord[]>(() => initData('vaccination', []));
  const [temperatureRecords, setTemperatureRecords] = useState<TemperatureRecord[]>(() => initData('temperature', []));
  const [breedingRecords, setBreedingRecords] = useState<BreedingRecord[]>(() => initData('breeding', []));
  const [expenses, setExpenses] = useState<Expense[]>(() => initData('expenses', mockExpenses));
  const [income, setIncome] = useState<Income[]>(() => initData('income', mockIncome));
  const [alerts, setAlerts] = useState<AlertNotification[]>(() => initData('alerts', mockAlerts));

  // Sync to localStorage on change
  useEffect(() => { localStorage.setItem('farm_cows', JSON.stringify(cows)); }, [cows]);
  useEffect(() => { localStorage.setItem('farm_milk', JSON.stringify(milkRecords)); }, [milkRecords]);
  useEffect(() => { localStorage.setItem('farm_feed', JSON.stringify(feedRecords)); }, [feedRecords]);
  useEffect(() => { localStorage.setItem('farm_health', JSON.stringify(healthRecords)); }, [healthRecords]);
  useEffect(() => { localStorage.setItem('farm_vaccination', JSON.stringify(vaccinationRecords)); }, [vaccinationRecords]);
  useEffect(() => { localStorage.setItem('farm_temperature', JSON.stringify(temperatureRecords)); }, [temperatureRecords]);
  useEffect(() => { localStorage.setItem('farm_breeding', JSON.stringify(breedingRecords)); }, [breedingRecords]);
  useEffect(() => { localStorage.setItem('farm_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('farm_income', JSON.stringify(income)); }, [income]);
  useEffect(() => { localStorage.setItem('farm_alerts', JSON.stringify(alerts)); }, [alerts]);

  return (
    <FarmContext.Provider value={{
      cows, setCows,
      milkRecords, setMilkRecords,
      feedRecords, setFeedRecords,
      healthRecords, setHealthRecords,
      vaccinationRecords, setVaccinationRecords,
      temperatureRecords, setTemperatureRecords,
      breedingRecords, setBreedingRecords,
      expenses, setExpenses,
      income, setIncome,
      alerts, setAlerts
    }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) throw new Error("useFarm must be used within FarmProvider");
  return context;
};
