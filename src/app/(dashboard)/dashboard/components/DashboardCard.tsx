import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function DashboardCard({ title, value, icon, trend }: DashboardCardProps) {
  return (
    <div className="border border-gray-800 p-6 rounded-xl h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-white">{value}</h3>
          {trend && (
            <div className="mt-2 flex items-center text-sm text-white">
              {trend.isPositive ? (
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {trend.value}
            </div>
          )}
        </div>
        <div className="p-2 bg-white rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="border border-gray-800 p-6 rounded-xl h-28 animate-pulse">
      <div className="h-4 bg-gray-800 rounded w-3/4"></div>
      <div className="h-6 bg-gray-800 rounded mt-2 w-1/2"></div>
    </div>
  );
}
