"use client";

import React, { useState } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface ExpandableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  renderExpanded: (item: T) => React.ReactNode;
}

export function ExpandableTable<T>({ data, columns, keyExtractor, renderExpanded }: ExpandableTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (key: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(key)) {
      newExpandedRows.delete(key);
    } else {
      newExpandedRows.add(key);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-800">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="bg-black text-xs uppercase text-gray-400 border-b border-gray-800">
          <tr>
            <th className="px-6 py-4 w-10"></th>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4 font-medium">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const key = keyExtractor(item);
            const isExpanded = expandedRows.has(key);
            return (
              <React.Fragment key={key}>
                <tr 
                  className="border-b border-gray-800 bg-black/50 hover:bg-gray-900 cursor-pointer transition-colors"
                  onClick={() => toggleRow(key)}
                >
                  <td className="px-6 py-4">
                    <span className="text-cyan-500 font-bold transition-transform duration-200 block text-center" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                      ▶
                    </span>
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key])}
                    </td>
                  ))}
                </tr>
                {isExpanded && (
                  <tr className="bg-gray-900/30 border-b border-gray-800">
                    <td colSpan={columns.length + 1} className="p-0">
                      <div className="px-12 py-6 animate-in slide-in-from-top-2 fade-in duration-200">
                        {renderExpanded(item)}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
