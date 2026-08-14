import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Card, CardContent } from '../components/ui/Card';
import { format } from 'date-fns';
import { Activity, Plus, Search, Filter, Stethoscope, Syringe } from 'lucide-react';

const Health = () => {
  const { cows, healthRecords, vaccinationRecords } = useFarm();
  const [activeTab, setActiveTab] = useState<'health' | 'vaccination'>('health');
  
  const sickCowsCount = cows.filter(c => c.healthStatus !== 'Healthy').length;
  
  // Need to calculate upcoming vaccinations for a realistic view
  // Mock data doesn't have many vaccinations so we just show what exists
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Health & Vaccination</h1>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === 'health' ? 'Add Health Record' : 'Record Vaccination'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={`${sickCowsCount > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${sickCowsCount > 0 ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'}`}>
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cows Requiring Attention</p>
              <h3 className={`text-2xl font-bold ${sickCowsCount > 0 ? 'text-red-700' : 'text-green-700'}`}>{sickCowsCount}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-200 text-blue-700 rounded-full">
              <Syringe className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Vaccinations Due (30 Days)</p>
              <h3 className="text-2xl font-bold text-blue-700">1</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="border-b border-border">
          <div className="flex">
            <button 
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'health' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setActiveTab('health')}
            >
              Health Records
            </button>
            <button 
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'vaccination' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setActiveTab('vaccination')}
            >
              Vaccination Schedule
            </button>
          </div>
        </div>
        
        <div className="p-4 flex justify-between items-center bg-muted/30">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by cow ID or name..."
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          <button className="p-2 border border-input rounded-md hover:bg-muted text-muted-foreground">
            <Filter className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'health' ? (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-y border-border">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Cow ID</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Diagnosis</th>
                  <th className="px-4 py-3">Treatment</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {healthRecords.length > 0 ? (
                  healthRecords.map((record) => {
                    const cow = cows.find(c => c.id === record.cowId);
                    return (
                      <tr key={record.id} className="border-b border-border hover:bg-muted/30">
                        <td className="px-4 py-3">{format(new Date(record.date), 'MMM dd, yyyy')}</td>
                        <td className="px-4 py-3 font-medium">{cow?.id} ({cow?.name})</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            record.healthStatus === 'Sick' ? 'bg-red-100 text-red-800' :
                            record.healthStatus === 'Under Treatment' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {record.healthStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">{record.diagnosis || '-'}</td>
                        <td className="px-4 py-3">{record.treatment || '-'}</td>
                        <td className="px-4 py-3 text-center">
                          <button className="text-primary hover:underline text-xs">View</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No health records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-y border-border">
                <tr>
                  <th className="px-4 py-3">Cow ID</th>
                  <th className="px-4 py-3">Vaccine</th>
                  <th className="px-4 py-3">Date Given</th>
                  <th className="px-4 py-3">Next Due</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vaccinationRecords.length > 0 ? (
                  vaccinationRecords.map((record) => {
                    const cow = cows.find(c => c.id === record.cowId);
                    const isDue = record.nextDueDate && new Date(record.nextDueDate) <= new Date();
                    return (
                      <tr key={record.id} className="border-b border-border hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium">{cow?.id} ({cow?.name})</td>
                        <td className="px-4 py-3">{record.vaccineName}</td>
                        <td className="px-4 py-3">{format(new Date(record.administeredDate), 'MMM dd, yyyy')}</td>
                        <td className="px-4 py-3">{record.nextDueDate ? format(new Date(record.nextDueDate), 'MMM dd, yyyy') : '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isDue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {isDue ? 'Due' : 'Up to Date'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button className="text-primary hover:underline text-xs">Edit</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No vaccination records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Health;
