"use client"
import { JSX, useState } from 'react';
import { Calendar, CheckCircle, XCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Hook, Prisma } from '@prisma/client'



type Props = {
  data: Hook[]
}


 


// Type for sort configuration
interface SortConfig {
  key: keyof Hook;
  direction: 'ascending' | 'descending';
}



export default function HooksTable({ data }: Props): JSX.Element {
  const [hooks, setHooks] = useState<Hook[]>(data);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'id',
    direction: 'descending'
  });
  
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // optional: use 12-hour clock with AM/PM
    });
  };
  
  const handleSort = (key: keyof Hook): void => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (columnName: keyof Hook): JSX.Element | null => {
    if (sortConfig.key !== columnName) return null;
    
    return sortConfig.direction === 'ascending' 
      ? <ChevronUp className="inline w-4 h-4" /> 
      : <ChevronDown className="inline w-4 h-4" />;
  };
  
  const sortedHooks = [...hooks].sort((a: Hook, b: Hook) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
  
  const filteredHooks = sortedHooks.filter(hook => 
    hook.hook?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full px-4 py-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Hooks</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search hooks..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th 
                className="p-4 font-semibold text-gray-700 border-b-2 border-gray-200 cursor-pointer"
                onClick={() => handleSort('id')}
              >
                ID {getSortIcon('id')}
              </th>
              <th 
                className="p-4 font-semibold text-gray-700 border-b-2 border-gray-200 cursor-pointer"
                onClick={() => handleSort('hook')}
              >
                Action {getSortIcon('hook')}
              </th>
              <th 
                className="p-4 font-semibold text-gray-700 border-b-2 border-gray-200 cursor-pointer"
                onClick={() => handleSort('isAuth')}
              >
                Authorized {getSortIcon('isAuth')}
              </th>
              <th 
                className="p-4 font-semibold text-gray-700 border-b-2 border-gray-200 cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                Created {getSortIcon('createdAt')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredHooks.length > 0 ? (
              filteredHooks.map((hook) => (
                <tr 
                  key={hook.id} 
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-800">{hook.id}</td>
                  <td className="p-4">
                    <span className="font-medium text-blue-600">{hook.hook || 'Unnamed Hook'}</span>
                  </td>
                  <td className="p-4">
                    {hook.isAuth ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" />
                        <span>Yes</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <XCircle className="w-5 h-5 mr-1" />
                        <span>No</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(hook.createdAt)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No hooks found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredHooks.length} of {hooks.length} hooks
      </div>
    </div>
  );
}