'use client';

import { motion } from 'framer-motion';
import { useDirection } from '@/context/DirectionContext';
import { Search, Filter, MoreHorizontal, Edit, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  onFilter?: (filter: string) => void;
  onEdit?: (row: any) => void;
  onView?: (row: any) => void;
  onDelete?: (row: any) => void;
  filterOptions?: { value: string; label: string }[];
  loading?: boolean;
}

const DataTable = ({
  columns,
  data,
  searchPlaceholder,
  onSearch,
  onFilter,
  onEdit,
  onView,
  onDelete,
  filterOptions,
  loading = false
}: DataTableProps) => {
  const { language, isRTL } = useDirection();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilter = (value: string) => {
    setSelectedFilter(value);
    onFilter?.(value);
  };

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  return (
    <div className="bg-obsidian/50 backdrop-blur-sm rounded-xl border border-desert-gold/20 overflow-hidden">
      {/* Table Header with Search and Filters */}
      <div className="p-6 border-b border-desert-gold/20">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-gray`} />
            <input
              type="text"
              placeholder={searchPlaceholder || (language === 'ar' ? 'البحث...' : 'Search...')}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className={`w-full bg-stone-gray/10 border border-desert-gold/20 rounded-lg ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 text-elegant-white placeholder-stone-gray focus:outline-none focus:border-desert-gold transition-colors duration-300`}
            />
          </div>

          {/* Filter */}
          {filterOptions && (
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => handleFilter(e.target.value)}
                className="bg-stone-gray/10 border border-desert-gold/20 rounded-lg px-4 py-2 text-elegant-white focus:outline-none focus:border-desert-gold transition-colors duration-300 appearance-none"
              >
                <option value="">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Filter className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-gray pointer-events-none`} />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-stone-gray/10">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-${isRTL ? 'right' : 'left'} text-xs font-medium text-stone-gray uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:text-desert-gold transition-colors duration-200' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <span>{column.label}</span>
                    {column.sortable && sortColumn === column.key && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-desert-gold"
                      >
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </motion.span>
                    )}
                  </div>
                </th>
              ))}
              <th className={`px-6 py-4 text-${isRTL ? 'left' : 'right'} text-xs font-medium text-stone-gray uppercase tracking-wider`}>
                {language === 'ar' ? 'الإجراءات' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-desert-gold/10">
            {loading ? (
              // Loading skeleton
              [...Array(5)].map((_, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      <div className="h-4 bg-stone-gray/20 rounded animate-pulse" />
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <div className="h-4 bg-stone-gray/20 rounded animate-pulse w-20" />
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                  <div className="text-stone-gray">
                    <div className="text-4xl mb-2">📋</div>
                    <p>{language === 'ar' ? 'لا توجد بيانات' : 'No data available'}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <motion.tr
                  key={row.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-stone-gray/5 transition-colors duration-200"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? column.render(row[column.key], row) : (
                        <span className="text-elegant-white">{row[column.key]}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      {onView && (
                        <motion.button
                          onClick={() => onView(row)}
                          className="p-2 text-stone-gray hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="h-4 w-4" />
                        </motion.button>
                      )}
                      {onEdit && (
                        <motion.button
                          onClick={() => onEdit(row)}
                          className="p-2 text-stone-gray hover:text-desert-gold hover:bg-desert-gold/10 rounded-lg transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                      )}
                      {onDelete && (
                        <motion.button
                          onClick={() => onDelete(row)}
                          className="p-2 text-stone-gray hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;