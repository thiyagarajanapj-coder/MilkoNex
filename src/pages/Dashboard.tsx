import React, { useMemo } from 'react';
import { useFarm } from '../context/FarmContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { format, isToday, isSameMonth } from 'date-fns';
import { Droplets, Beef, AlertTriangle, TrendingUp, DollarSign, Wheat, Trophy, Download } from 'lucide-react';

const Dashboard = () => {
  const { cows, milkRecords, feedRecords, expenses, income, alerts } = useFarm();

  // KPIs Calculation
  const activeCows = cows.filter(c => c.status === 'Active');
  
  const todaysMilkRecords = milkRecords.filter(r => isToday(new Date(r.date)));
  const todaysMilk = todaysMilkRecords.reduce((sum, r) => sum + r.totalQuantity, 0);
  const todaysMorningMilk = todaysMilkRecords.reduce((sum, r) => sum + r.morningQuantity, 0);
  const todaysEveningMilk = todaysMilkRecords.reduce((sum, r) => sum + r.eveningQuantity, 0);
  const avgMilkPerCow = activeCows.length ? todaysMilk / activeCows.length : 0;

  const todaysFeedRecords = feedRecords.filter(r => isToday(new Date(r.date)));
  const todaysFeed = todaysFeedRecords.reduce((sum, r) => sum + r.quantity, 0);

  const cowsAttention = cows.filter(c => c.healthStatus !== 'Healthy').length;
  
  const currentMonthIncome = income
    .filter(i => isSameMonth(new Date(i.date), new Date()))
    .reduce((sum, i) => sum + i.amount, 0);
    
  const currentMonthExpense = expenses
    .filter(e => isSameMonth(new Date(e.date), new Date()))
    .reduce((sum, e) => sum + e.amount, 0);
    
  const currentMonthProfit = currentMonthIncome - currentMonthExpense;

  // Chart Data Preparation
  
  // 1. Milk Production Trend (Last 7 Days)
  const milkTrendData = useMemo(() => {
    // Group milk records by date and sum
    const grouped = milkRecords.reduce((acc, curr) => {
      if (!acc[curr.date]) {
        acc[curr.date] = { date: curr.date, morning: 0, evening: 0, total: 0 };
      }
      acc[curr.date].morning += curr.morningQuantity;
      acc[curr.date].evening += curr.eveningQuantity;
      acc[curr.date].total += curr.totalQuantity;
      return acc;
    }, {} as Record<string, {date: string, morning: number, evening: number, total: number}>);
    
    // Sort and take last 7 days
    return Object.values(grouped)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7)
      .map(d => ({ ...d, date: format(new Date(d.date), 'MMM dd') }));
  }, [milkRecords]);

  // 2. Health Overview
  const healthData = useMemo(() => {
    const counts = { Healthy: 0, 'Under Observation': 0, Sick: 0, 'Under Treatment': 0, Recovered: 0 };
    cows.forEach(c => {
      counts[c.healthStatus]++;
    });
    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({ name, value }));
  }, [cows]);

  // 3. Top Yielding Cows
  const topCows = useMemo(() => {
    const cowYields = cows.map(cow => {
      const totalYield = milkRecords
        .filter(r => r.cowId === cow.id)
        .reduce((sum, r) => sum + r.totalQuantity, 0);
      return { ...cow, totalYield };
    });
    return cowYields.sort((a, b) => b.totalYield - a.totalYield).slice(0, 5);
  }, [cows, milkRecords]);

  const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

  const handleDownloadReport = () => {
    const csvContent = [
      'Dashboard Summary Report',
      `Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`,
      '',
      'Key Performance Indicators',
      `Total Active Cows,${activeCows.length}`,
      `Cows Requiring Attention,${cowsAttention}`,
      `Today's Milk (L),${todaysMilk.toFixed(1)}`,
      `Morning Milk (L),${todaysMorningMilk.toFixed(1)}`,
      `Evening Milk (L),${todaysEveningMilk.toFixed(1)}`,
      `Today's Feed Used (kg),${todaysFeed.toFixed(1)}`,
      `Monthly Profit (INR),${currentMonthProfit}`,
      `Monthly Income (INR),${currentMonthIncome}`,
      `Monthly Expense (INR),${currentMonthExpense}`,
      '',
      'Top Yielding Cows',
      'Rank,Name,ID,Breed,Total Yield (L)',
      ...topCows.map((cow, index) => `${index + 1},${cow.name},${cow.id},${cow.breed},${cow.totalYield.toFixed(1)}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dashboard_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <button 
          onClick={handleDownloadReport}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </button>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Cows</CardTitle>
            <Beef className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCows.length}</div>
            <p className="text-xs text-muted-foreground">{cowsAttention} require attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Milk</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysMilk.toFixed(1)} L</div>
            <p className="text-xs text-muted-foreground">M: {todaysMorningMilk.toFixed(1)}L | E: {todaysEveningMilk.toFixed(1)}L</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Feed Used</CardTitle>
            <Wheat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysFeed.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">Avg: {(todaysFeed / (activeCows.length || 1)).toFixed(1)} kg/cow</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${currentMonthProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{currentMonthProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              In: ₹{currentMonthIncome.toLocaleString()} | Out: ₹{currentMonthExpense.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Milk Production Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={milkTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="total" name="Total (L)" stroke="#166534" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="morning" name="Morning" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="evening" name="Evening" stroke="#d97706" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Health Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {healthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Insights and Alerts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Farm Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="flex h-2 w-2 mt-2 rounded-full bg-primary mr-3 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground font-medium">Consistent Yield:</strong> Overall milk production is stable compared to the last 7 days average.
                </p>
              </li>
              <li className="flex items-start">
                <span className="flex h-2 w-2 mt-2 rounded-full bg-amber-500 mr-3 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground font-medium">Feed Ratio:</strong> Feed consumption has slightly increased while milk production remained unchanged. Consider optimizing feed allocation.
                </p>
              </li>
              <li className="flex items-start">
                <span className="flex h-2 w-2 mt-2 rounded-full bg-primary mr-3 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground font-medium">Top Performer:</strong> COW-001 (Lakshmi) is currently the highest milk-producing cow this week.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.slice(0, 4).map(alert => (
              <div key={alert.id} className="mb-4 last:mb-0 flex items-start p-3 rounded-lg border border-border bg-muted/50">
                <div className={`mr-3 mt-0.5 rounded-full p-1 ${
                  alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-600' : 
                  alert.severity === 'WARNING' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{format(new Date(alert.date), 'MMM dd, hh:mm a')}</p>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No active alerts.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Top Yielding Cows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
            Top Yielding Cows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 w-16">Rank</th>
                  <th className="px-4 py-3">Cow Details</th>
                  <th className="px-4 py-3">Breed</th>
                  <th className="px-4 py-3 text-right">Total Yield (L)</th>
                </tr>
              </thead>
              <tbody>
                {topCows.map((cow, index) => (
                  <tr key={cow.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{cow.name}</div>
                      <div className="text-xs text-muted-foreground">{cow.id} • {cow.tagNumber}</div>
                    </td>
                    <td className="px-4 py-3">{cow.breed}</td>
                    <td className="px-4 py-3 text-right font-bold text-primary">{cow.totalYield.toFixed(1)} L</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
