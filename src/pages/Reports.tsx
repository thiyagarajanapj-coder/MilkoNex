import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { FileText, Download, Printer, Filter } from 'lucide-react';
import { format } from 'date-fns';

const Reports = () => {
  const [reportType, setReportType] = useState('milk');
  const [dateRange, setDateRange] = useState('month');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Farm Reports</h1>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Report Type</label>
                <select 
                  className="w-full border-input bg-background rounded-md text-sm p-2"
                  value={reportType}
                  onChange={e => setReportType(e.target.value)}
                >
                  <option value="milk">Milk Production</option>
                  <option value="feed">Feed Consumption</option>
                  <option value="health">Health & Vaccination</option>
                  <option value="finance">Financial (P&L)</option>
                  <option value="complete">Complete Farm Report</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Period</label>
                <select 
                  className="w-full border-input bg-background rounded-md text-sm p-2"
                  value={dateRange}
                  onChange={e => setDateRange(e.target.value)}
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-muted h-10 px-4 py-2 mt-4">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="min-h-[600px] flex flex-col">
            <div className="flex-1 p-8 bg-white text-black">
              {/* Mock PDF Document Layout */}
              <div className="border-b-2 border-gray-200 pb-4 mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wider">Green Acres Farm</h2>
                  <p className="text-sm text-gray-500">123 Farm Road, Countryside District</p>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-semibold text-gray-700 capitalize">{reportType.replace('-', ' ')} Report</h3>
                  <p className="text-sm text-gray-500">Generated: {format(new Date(), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-semibold border-b border-gray-200 mb-3 pb-1 text-gray-700">Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-500">Total Period Output</p>
                      <p className="text-lg font-bold">1,245.5 L</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-500">Average Daily Yield</p>
                      <p className="text-lg font-bold">41.5 L</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-500">Top Performing Cow</p>
                      <p className="text-lg font-bold">Lakshmi (COW-001)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold border-b border-gray-200 mb-3 pb-1 text-gray-700">Detailed Data</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 text-left">
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Morning Yield</th>
                        <th className="py-2 px-3">Evening Yield</th>
                        <th className="py-2 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-2 px-3">Oct 01, 2026</td>
                        <td className="py-2 px-3">22.4 L</td>
                        <td className="py-2 px-3">19.8 L</td>
                        <td className="py-2 px-3 text-right font-medium">42.2 L</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">Oct 02, 2026</td>
                        <td className="py-2 px-3">21.9 L</td>
                        <td className="py-2 px-3">20.1 L</td>
                        <td className="py-2 px-3 text-right font-medium">42.0 L</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">Oct 03, 2026</td>
                        <td className="py-2 px-3">23.1 L</td>
                        <td className="py-2 px-3">19.5 L</td>
                        <td className="py-2 px-3 text-right font-medium">42.6 L</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-12 text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
                  End of Report. Generated by Smart Dairy Farm Management System.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
