import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Card, CardContent } from '../components/ui/Card';
import { format } from 'date-fns';
import { Wheat, Plus, Download, Filter } from 'lucide-react';

const Feed = () => {
  const { feedRecords, cows } = useFarm();
  const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM-dd'));

  const filteredRecords = feedRecords
    .filter(record => record.date === dateFilter)
    .map(record => ({
      ...record,
      cow: cows.find(c => c.id === record.cowId)
    }));

  const totalFeed = filteredRecords.reduce((sum, r) => sum + r.quantity, 0);
  const totalCost = filteredRecords.reduce((sum, r) => sum + (r.cost * r.quantity), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Feed Management</h1>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <Plus className="mr-2 h-4 w-4" />
            Add Feed Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-amber-500/20 text-amber-600 rounded-full">
              <Wheat className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Feed Consumed Today</p>
              <h3 className="text-2xl font-bold">{totalFeed.toFixed(1)} kg</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-amber-500/20 text-amber-600 rounded-full">
              <Wheat className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estimated Feed Cost Today</p>
              <h3 className="text-2xl font-bold">₹{totalCost.toFixed(2)}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50 rounded-t-xl">
          <h3 className="font-semibold">Daily Feed Records</h3>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-sm border border-input rounded-md px-2 py-1 bg-background"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3">Cow ID</th>
                <th className="px-4 py-3">Cow Name</th>
                <th className="px-4 py-3">Feed Type</th>
                <th className="px-4 py-3 text-right">Quantity</th>
                <th className="px-4 py-3 text-right">Est. Cost</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{record.cow?.id}</td>
                    <td className="px-4 py-3">{record.cow?.name}</td>
                    <td className="px-4 py-3">{record.feedType}</td>
                    <td className="px-4 py-3 text-right font-medium">{record.quantity.toFixed(1)} {record.unit}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">₹{(record.cost * record.quantity).toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-primary hover:underline text-xs">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No feed records found for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Feed;
