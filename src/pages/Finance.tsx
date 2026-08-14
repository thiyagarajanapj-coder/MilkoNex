import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Card, CardContent } from '../components/ui/Card';
import { format, isSameMonth } from 'date-fns';
import { DollarSign, TrendingUp, TrendingDown, Plus, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Finance = () => {
  const { expenses, income } = useFarm();
  const [activeTab, setActiveTab] = useState<'overview' | 'income' | 'expenses'>('overview');

  const currentMonth = new Date();
  
  const currentMonthIncome = income
    .filter(i => isSameMonth(new Date(i.date), currentMonth))
    .reduce((sum, i) => sum + i.amount, 0);
    
  const currentMonthExpense = expenses
    .filter(e => isSameMonth(new Date(e.date), currentMonth))
    .reduce((sum, e) => sum + e.amount, 0);
    
  const profit = currentMonthIncome - currentMonthExpense;

  // Prepare chart data (Monthly Income vs Expense)
  // Simplified for mock data - just using the current month and creating some fake historical data
  const chartData = [
    { name: format(new Date(new Date().setMonth(currentMonth.getMonth() - 2)), 'MMM'), income: currentMonthIncome * 0.8, expense: currentMonthExpense * 0.9 },
    { name: format(new Date(new Date().setMonth(currentMonth.getMonth() - 1)), 'MMM'), income: currentMonthIncome * 1.1, expense: currentMonthExpense * 1.05 },
    { name: format(currentMonth, 'MMM'), income: currentMonthIncome, expense: currentMonthExpense },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Financial Overview</h1>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            <Download className="mr-2 h-4 w-4" />
            Report
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Income</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">₹{currentMonthIncome.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-green-100 text-green-600 rounded-md">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Expenses</p>
                <h3 className="text-2xl font-bold mt-1 text-red-600">₹{currentMonthExpense.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-red-100 text-red-600 rounded-md">
                <TrendingDown className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={profit >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Profit (MTD)</p>
                <h3 className={`text-2xl font-bold mt-1 ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ₹{profit.toLocaleString()}
                </h3>
              </div>
              <div className={`p-2 rounded-md ${profit >= 0 ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="border-b border-border p-4 bg-muted/30">
              <h3 className="font-semibold">Income vs Expenses (Last 3 Months)</h3>
            </div>
            <CardContent className="p-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }} />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="border-b border-border p-4 flex justify-between items-center bg-muted/30">
              <h3 className="font-semibold">Recent Transactions</h3>
            </div>
            <CardContent className="p-0">
              <div className="flex border-b border-border">
                <button 
                  className={`flex-1 py-2 text-sm text-center ${activeTab === 'overview' ? 'border-b-2 border-primary font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  All
                </button>
                <button 
                  className={`flex-1 py-2 text-sm text-center ${activeTab === 'income' ? 'border-b-2 border-primary font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setActiveTab('income')}
                >
                  Income
                </button>
                <button 
                  className={`flex-1 py-2 text-sm text-center ${activeTab === 'expenses' ? 'border-b-2 border-primary font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setActiveTab('expenses')}
                >
                  Expenses
                </button>
              </div>
              
              <div className="divide-y divide-border">
                {(activeTab === 'overview' || activeTab === 'income') && income.slice(0, 3).map(inc => (
                  <div key={inc.id} className="p-4 flex justify-between items-center hover:bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">{inc.category}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(inc.date), 'MMM dd, yyyy')}</p>
                    </div>
                    <span className="font-medium text-green-600">+₹{inc.amount}</span>
                  </div>
                ))}
                
                {(activeTab === 'overview' || activeTab === 'expenses') && expenses.slice(0, 3).map(exp => (
                  <div key={exp.id} className="p-4 flex justify-between items-center hover:bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">{exp.category}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(exp.date), 'MMM dd, yyyy')}</p>
                    </div>
                    <span className="font-medium text-red-600">-₹{exp.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Finance;
