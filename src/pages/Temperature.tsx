import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Card, CardContent } from '../components/ui/Card';
import { Thermometer, Plus, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const Temperature = () => {
  const { cows } = useFarm();
  // Using mock data for temperature since it's not deeply populated in mockData.ts
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Temperature Monitoring</h1>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          <Plus className="mr-2 h-4 w-4" />
          Record Temperature
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-orange-200 text-orange-700 rounded-full">
              <Thermometer className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Herd Temp Today</p>
              <h3 className="text-2xl font-bold text-orange-700">38.6 °C</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-red-200 text-red-700 rounded-full">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cows Over Threshold (39.2°C)</p>
              <h3 className="text-2xl font-bold text-red-700">1</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold">Recent Temperature Readings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Cow ID</th>
                <th className="px-4 py-3">Temperature</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Mocking a few readings for demonstration */}
              <tr className="border-b border-border hover:bg-muted/30 bg-red-50/50">
                <td className="px-4 py-3">{format(new Date(), 'MMM dd, hh:mm a')}</td>
                <td className="px-4 py-3 font-medium">COW-005 (Kamdhenu)</td>
                <td className="px-4 py-3 font-bold text-red-600">39.5 °C</td>
                <td className="px-4 py-3">Rectal</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                    High - Attention Required
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3">{format(new Date(), 'MMM dd, hh:mm a')}</td>
                <td className="px-4 py-3 font-medium">COW-001 (Lakshmi)</td>
                <td className="px-4 py-3 font-medium text-green-600">38.4 °C</td>
                <td className="px-4 py-3">Ear Tag Sensor</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Normal
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3">{format(new Date(new Date().getTime() - 1000*60*60), 'MMM dd, hh:mm a')}</td>
                <td className="px-4 py-3 font-medium">COW-002 (Ganga)</td>
                <td className="px-4 py-3 font-medium text-green-600">38.6 °C</td>
                <td className="px-4 py-3">Ear Tag Sensor</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Normal
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Temperature;
