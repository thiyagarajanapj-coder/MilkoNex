import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Card, CardContent } from '../components/ui/Card';
import { Beef, Search, Plus, MoreVertical, Filter, ArrowUpDown, X, Download } from 'lucide-react';
import { format } from 'date-fns';

const Cows = () => {
  const { cows, setCows, milkRecords } = useFarm();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCow, setNewCow] = useState({
    name: '',
    tagNumber: '',
    breed: '',
    dateOfBirth: format(new Date(), 'yyyy-MM-dd'),
    lactationNumber: '0',
    weight: '400',
    color: 'Black & White'
  });

  const handleAddCow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCow.name || !newCow.tagNumber) return;

    const cowId = `COW-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const newCowRecord = {
      id: cowId,
      farmId: 'farm-001',
      cowCode: cowId,
      tagNumber: newCow.tagNumber,
      name: newCow.name,
      breed: newCow.breed || 'Holstein Friesian',
      gender: 'Female' as const,
      dateOfBirth: newCow.dateOfBirth,
      weight: parseFloat(newCow.weight) || 400,
      color: newCow.color,
      lactationNumber: parseInt(newCow.lactationNumber) || 0,
      healthStatus: 'Healthy' as const,
      pregnancyStatus: 'Not Ready' as const,
      status: 'Active' as const,
    };

    setCows([...cows, newCowRecord]);
    setIsAddModalOpen(false);
    setNewCow({
      name: '',
      tagNumber: '',
      breed: '',
      dateOfBirth: format(new Date(), 'yyyy-MM-dd'),
      lactationNumber: '0',
      weight: '400',
      color: 'Black & White'
    });
  };

  const filteredCows = cows.filter(cow => 
    (cow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cow.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cow.tagNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === 'All' || cow.healthStatus === filterStatus)
  );

  filteredCows.sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'age-asc') return new Date(b.dateOfBirth).getTime() - new Date(a.dateOfBirth).getTime();
    if (sortBy === 'age-desc') return new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime();
    if (sortBy === 'milk-desc') {
      const milkA = milkRecords.filter(r => r.cowId === a.id).reduce((sum, r) => sum + r.totalQuantity, 0);
      const milkB = milkRecords.filter(r => r.cowId === b.id).reduce((sum, r) => sum + r.totalQuantity, 0);
      return milkB - milkA;
    }
    return 0;
  });

  const handleDownloadReport = () => {
    const headers = ['ID', 'Tag Number', 'Name', 'Breed', 'Age (Yrs)', 'Lactation', 'Pregnancy Status', 'Health Status', 'Total Milk (L)'];
    const csvContent = [
      headers.join(','),
      ...filteredCows.map(cow => {
        const age = Math.floor((new Date().getTime() - new Date(cow.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365));
        const totalMilk = milkRecords.filter(r => r.cowId === cow.id).reduce((sum, r) => sum + r.totalQuantity, 0).toFixed(1);
        return `${cow.id},${cow.tagNumber},${cow.name},${cow.breed},${age},${cow.lactationNumber},${cow.pregnancyStatus},${cow.healthStatus},${totalMilk}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cows_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Cow Management</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDownloadReport}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Cow
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search cows by name, ID or tag..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex items-center">
            <Filter className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none pr-8 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Healthy">Healthy</option>
              <option value="Sick">Sick</option>
              <option value="Under Observation">Under Observation</option>
            </select>
          </div>
          <div className="relative flex items-center">
            <ArrowUpDown className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none pr-8 cursor-pointer"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="age-asc">Age (Youngest)</option>
              <option value="age-desc">Age (Oldest)</option>
              <option value="milk-desc">Milk (High-Low)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCows.map(cow => (
          <Card key={cow.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
            <div className="h-32 bg-muted relative">
              {cow.photoUrl ? (
                <img src={cow.photoUrl} alt={cow.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                  <Beef className="h-12 w-12 opacity-50" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  cow.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
                  cow.healthStatus === 'Sick' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {cow.healthStatus}
                </span>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg leading-none mb-1">{cow.name}</h3>
                  <p className="text-sm text-muted-foreground">{cow.id} • {cow.tagNumber}</p>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-y-2 mt-4 text-sm">
                <div className="text-muted-foreground">Breed:</div>
                <div className="font-medium text-right">{cow.breed}</div>
                
                <div className="text-muted-foreground">Age:</div>
                <div className="font-medium text-right">
                  {Math.floor((new Date().getTime() - new Date(cow.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365))} yrs
                </div>
                
                <div className="text-muted-foreground">Lactation:</div>
                <div className="font-medium text-right">{cow.lactationNumber}</div>
                
                <div className="text-muted-foreground">Pregnancy:</div>
                <div className="font-medium text-right">{cow.pregnancyStatus}</div>
                
                <div className="text-muted-foreground">Total Milk:</div>
                <div className="font-medium text-right text-primary font-bold">
                  {milkRecords.filter(r => r.cowId === cow.id).reduce((sum, r) => sum + r.totalQuantity, 0).toFixed(1)} L
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredCows.length === 0 && (
        <div className="text-center py-12">
          <Beef className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">No cows found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Adjust your search filter or add a new cow.
          </p>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-border sticky top-0 bg-card z-10">
              <h3 className="text-lg font-semibold">Add New Cow</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <CardContent className="p-4">
              <form onSubmit={handleAddCow} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={newCow.name}
                      onChange={(e) => setNewCow({...newCow, name: e.target.value})}
                      className="w-full border border-input rounded-md px-3 py-2 bg-background text-sm"
                      placeholder="e.g. Lakshmi"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium mb-1">Tag Number</label>
                    <input
                      type="text"
                      required
                      value={newCow.tagNumber}
                      onChange={(e) => setNewCow({...newCow, tagNumber: e.target.value})}
                      className="w-full border border-input rounded-md px-3 py-2 bg-background text-sm"
                      placeholder="e.g. TAG-105"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium mb-1">Breed</label>
                    <select
                      value={newCow.breed}
                      onChange={(e) => setNewCow({...newCow, breed: e.target.value})}
                      className="w-full border border-input rounded-md px-3 py-2 bg-background text-sm appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select a breed...</option>
                      <option value="Holstein Friesian">Holstein Friesian</option>
                      <option value="Jersey">Jersey</option>
                      <option value="Gir">Gir</option>
                      <option value="Sahiwal">Sahiwal</option>
                      <option value="Red Sindhi">Red Sindhi</option>
                      <option value="Tharparkar">Tharparkar</option>
                      <option value="Crossbreed">Crossbreed</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium mb-1">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={newCow.dateOfBirth}
                      onChange={(e) => setNewCow({...newCow, dateOfBirth: e.target.value})}
                      className="w-full border border-input rounded-md px-3 py-2 bg-background text-sm"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium mb-1">Lactation Number</label>
                    <input
                      type="number"
                      min="0"
                      value={newCow.lactationNumber}
                      onChange={(e) => setNewCow({...newCow, lactationNumber: e.target.value})}
                      className="w-full border border-input rounded-md px-3 py-2 bg-background text-sm"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      min="0"
                      value={newCow.weight}
                      onChange={(e) => setNewCow({...newCow, weight: e.target.value})}
                      className="w-full border border-input rounded-md px-3 py-2 bg-background text-sm"
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
                    Save Cow
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

export default Cows;
