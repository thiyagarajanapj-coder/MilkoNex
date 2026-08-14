import React from 'react';
import { useFarm } from '../context/FarmContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format, subDays } from 'date-fns';
import { BarChart3, Filter } from 'lucide-react';

const Analytics = () => {
  const { milkRecords } = useFarm();

  // Generate some realistic analytics data based on our mock data
  const productionData = Array.from({ length: 14 }).map((_, i) => {
    const date = format(subDays(new Date(), 13 - i), 'MMM dd');
    return {
      date,
      yield: 120 + Math.random() * 20 - 10,
      feed: 180 + Math.random() * 10,
      efficiency: 0.7 + Math.random() * 0.1
    };
  });

  const cowPerformance = [
    { name: 'Lakshmi', yield: 14.2, health: 95 },
    { name: 'Ganga', yield: 11.8, health: 100 },
    { name: 'Gauri', yield: 15.1, health: 80 },
    { name: 'Bhavani', yield: 12.5, health: 98 },
    { name: 'Saraswati', yield: 13.7, health: 90 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Advanced Analytics</h1>
        <div className="flex gap-2">
          <select className="border border-input bg-background rounded-md px-3 py-2 text-sm">
            <option>Last 14 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button className="p-2 border border-input rounded-md hover:bg-muted text-muted-foreground bg-background">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Feed-to-Milk Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }} />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="yield" name="Milk Yield (L)" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                  <Area yAxisId="right" type="monotone" dataKey="feed" name="Feed Consumed (kg)" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Cows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cowPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }} />
                  <Legend />
                  <Bar dataKey="yield" name="Daily Avg (L)" fill="#166534" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
