import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Card, CardContent } from '../components/ui/Card';
import { format } from 'date-fns';
import { Droplets, Plus, Download, Filter, X } from 'lucide-react';

const Milk = () => {
  const { milkRecords, setMilkRecords, cows } = useFarm();
  const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    cowId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    morningQuantity: '',
    eveningQuantity: '',
  });

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.cowId) return;

    const morning = parseFloat(newRecord.morningQuantity) || 0;
    const evening = parseFloat(newRecord.eveningQuantity) || 0;

    const record = {
      id: Date.now().toString(),
      cowId: newRecord.cowId,
      date: newRecord.date,
      morningQuantity: morning,
      eveningQuantity: evening,
      totalQuantity: morning + evening,
      createdBy: 'admin',
    };

    setMilkRecords([...milkRecords, record]);
    setIsAddModalOpen(false);
    setNewRecord({
      cowId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      morningQuantity: '',
      eveningQuantity: '',
    });
  };

  const filteredRecords = milkRecords
    .filter(record => record.date === dateFilter)
    .map(record => ({
      ...record,
      cow: cows.find(c => c.id === record.cowId)
    }));

  const totalMorning = filteredRecords.reduce((sum, r) => sum + r.morningQuantity, 0);
  const totalEvening = filteredRecords.reduce((sum, r) => sum + r.eveningQuantity, 0);
  const totalDay = totalMorning + totalEvening;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Milk Production</h1>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-primary/20 text-primary rounded-full">
              <Droplets className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Morning Total</p>
              <h3 className="text-2xl font-bold">{totalMorning.toFixed(1)} L</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-primary/20 text-primary rounded-full">
              <Droplets className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Evening Total</p>
              <h3 className="text-2xl font-bold">{totalEvening.toFixed(1)} L</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-primary text-primary-foreground rounded-full">
              <Droplets className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Daily Total</p>
              <h3 className="text-2xl font-bold text-primary">{totalDay.toFixed(1)} L</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50 rounded-t-xl">
          <h3 className="font-semibold">Daily Milk Records</h3>
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
                <th className="px-4 py-3 text-right">Morning (L)</th>
                <th className="px-4 py-3 text-right">Evening (L)</th>
                <th className="px-4 py-3 text-right">Total (L)</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{record.cow?.id}</td>
                    <td className="px-4 py-3">{record.cow?.name}</td>
                    <td className="px-4 py-3 text-right">{record.morningQuantity.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right">{record.eveningQuantity.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right font-bold text-primary">{record.totalQuantity.toFixed(1)}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-primary hover:underline text-xs">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No milk records found for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="text-lg font-semibold">Add Milk Record</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <CardContent className="p-4">
              <form onSubmit={handleAddRecord} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newRecord.date}
                    onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                    className="w-full border border-input rounded-md px-3 py-2 bg-background text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Select Cow</label>
                  <select
                    required
                    value={newRecord.cowId}
                    onChange={(e) => setNewRecord({...newRecord, cowId: e.target.value})}
                    className="w-full border border-input rounded-md px-3 py-2 bg-background text-sm"
                  >
                    <option value="">Select a cow...</option>
                    {cows.filter(c => c.status === 'Active').map(cow => (
                      <option key={cow.id} value={cow.id}>
                        {cow.tagNumber} - {cow.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Morning (L)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={newRecord.morningQuantity}
                      onChange={(e) => setNewRecord({...newRecord, morningQuantity: e.target.value})}
                      className="w-full border border-input rounded-md px-3 py-2 bg-background text-sm"
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Evening (L)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={newRecord.eveningQuantity}
                      onChange={(e) => setNewRecord({...newRecord, eveningQuantity: e.target.value})}
                      className="w-full border border-input rounded-md px-3 py-2 bg-background text-sm"
                      placeholder="0.0"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium border border-input rounded-md hover:bg-accent hover:text-accent-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Milk;
