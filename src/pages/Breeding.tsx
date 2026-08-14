import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Card, CardContent } from '../components/ui/Card';
import { HeartHandshake, Plus, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

const Breeding = () => {
  const { cows } = useFarm();
  const [searchTerm, setSearchTerm] = useState('');

  // Determine breeding status summary
  const pregnantCount = cows.filter(c => c.pregnancyStatus === 'Pregnant').length;
  const inseminatedCount = cows.filter(c => c.pregnancyStatus === 'Inseminated').length;
  const heatDetectedCount = cows.filter(c => c.pregnancyStatus === 'Heat Detected').length;

  const filteredCows = cows.filter(cow => 
    cow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cow.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Breeding Management</h1>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          <Plus className="mr-2 h-4 w-4" />
          Add Breeding Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-pink-50 border-pink-200">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-pink-200 text-pink-700 rounded-full">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Confirmed Pregnant</p>
              <h3 className="text-2xl font-bold text-pink-700">{pregnantCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-purple-200 text-purple-700 rounded-full">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recently Inseminated</p>
              <h3 className="text-2xl font-bold text-purple-700">{inseminatedCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-rose-50 border-rose-200">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-rose-200 text-rose-700 rounded-full">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Heat Detected</p>
              <h3 className="text-2xl font-bold text-rose-700">{heatDetectedCount}</h3>
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
              placeholder="Search by cow ID or name..."
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border border-input rounded-md hover:bg-muted text-muted-foreground">
            <Filter className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3">Cow ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Calving</th>
                <th className="px-4 py-3">Expected Calving</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCows.length > 0 ? (
                filteredCows.map((cow) => (
                  <tr key={cow.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{cow.id} ({cow.name})</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        cow.pregnancyStatus === 'Pregnant' ? 'bg-pink-100 text-pink-800' :
                        cow.pregnancyStatus === 'Inseminated' ? 'bg-purple-100 text-purple-800' :
                        cow.pregnancyStatus === 'Heat Detected' ? 'bg-rose-100 text-rose-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {cow.pregnancyStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">{cow.lastCalvingDate ? format(new Date(cow.lastCalvingDate), 'MMM dd, yyyy') : '-'}</td>
                    <td className="px-4 py-3 font-medium text-pink-700">
                      {cow.expectedCalvingDate ? format(new Date(cow.expectedCalvingDate), 'MMM dd, yyyy') : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-primary hover:underline text-xs">Update Status</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No cows found matching the search.
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

export default Breeding;
