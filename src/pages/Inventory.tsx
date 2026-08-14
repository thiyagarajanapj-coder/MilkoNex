import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Package, Plus, Search, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock inventory data
  const inventoryItems = [
    { id: 'INV-01', name: 'Concentrate Feed', type: 'Feed', stock: 45, unit: 'kg', minStock: 50, cost: 60, expiry: '2026-12-01' },
    { id: 'INV-02', name: 'Green Fodder', type: 'Feed', stock: 1200, unit: 'kg', minStock: 500, cost: 30, expiry: '2026-08-20' },
    { id: 'INV-03', name: 'Dry Fodder', type: 'Feed', stock: 800, unit: 'kg', minStock: 300, cost: 15, expiry: '2027-01-01' },
    { id: 'INV-04', name: 'FMD Vaccine', type: 'Medicine', stock: 15, unit: 'doses', minStock: 20, cost: 250, expiry: '2027-05-15' },
    { id: 'INV-05', name: 'Calcium Supplement', type: 'Supplement', stock: 5, unit: 'bottles', minStock: 10, cost: 450, expiry: '2026-11-30' },
    { id: 'INV-06', name: 'Antibiotics', type: 'Medicine', stock: 8, unit: 'vials', minStock: 10, cost: 120, expiry: '2026-10-15' },
  ];

  const filteredItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventoryItems.filter(item => item.stock <= item.minStock);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-primary/20 text-primary rounded-full">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Inventory Items</p>
              <h3 className="text-2xl font-bold">{inventoryItems.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`${lowStockItems.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${lowStockItems.length > 0 ? 'bg-amber-200 text-amber-700' : 'bg-green-200 text-green-700'}`}>
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Low Stock Alerts</p>
              <h3 className={`text-2xl font-bold ${lowStockItems.length > 0 ? 'text-amber-700' : 'text-green-700'}`}>{lowStockItems.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 flex justify-between items-center bg-muted/30 border-b border-border">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search inventory..."
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3">Item Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Current Stock</th>
                <th className="px-4 py-3 text-right">Min. Threshold</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const isLow = item.stock <= item.minStock;
                return (
                  <tr key={item.id} className={`border-b border-border hover:bg-muted/30 ${isLow ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3">{item.type}</td>
                    <td className={`px-4 py-3 text-right font-bold ${isLow ? 'text-amber-600' : ''}`}>
                      {item.stock} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{item.minStock} {item.unit}</td>
                    <td className="px-4 py-3 text-right">₹{item.cost}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        isLow ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-primary hover:underline text-xs mr-2">Update</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Inventory;
