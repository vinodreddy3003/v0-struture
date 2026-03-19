'use client';

import { X } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogDetailsPanelProps {
  log: AuditLog;
  onClose: () => void;
}

export function AuditLogDetailsPanel({ log, onClose }: AuditLogDetailsPanelProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'stock-in':
        return 'Stock In';
      case 'stock-out':
        return 'Stock Out';
      case 'stock-transfer':
        return 'Transfer';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'picked':
        return 'text-blue-600 bg-blue-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="w-full md:w-96 bg-white border-l border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Details</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header Info */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{log.productName}</h3>
          <div className="flex items-center gap-3">
            <span className="inline-block px-3 py-1 rounded-lg font-medium text-sm bg-gray-100 text-gray-900">
              {getTypeLabel(log.type)}
            </span>
            <span className={`inline-block px-3 py-1 rounded-lg font-medium text-sm ${getStatusColor(log.status)}`}>
              {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Quantity Change */}
        <div className="space-y-3 pb-6 border-b border-gray-200">
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Quantity Change</h4>
          <div className="space-y-2">
            {log.beforeQuantity !== undefined && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Before:</span>
                <span className="font-semibold text-gray-900">{log.beforeQuantity} units</span>
              </div>
            )}
            {log.afterQuantity !== undefined && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">After:</span>
                <span className="font-semibold text-gray-900">{log.afterQuantity} units</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
              <span className="text-gray-600">Change:</span>
              <span className={`text-lg font-bold ${log.sign === '+' ? 'text-green-600' : 'text-red-600'}`}>
                {log.sign}{log.quantity} units
              </span>
            </div>
          </div>
        </div>

        {/* Location Hierarchy */}
        <div className="space-y-3 pb-6 border-b border-gray-200">
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Location Hierarchy</h4>
          <div className="space-y-2">
            {log.zone && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Zone:</span>
                <span className="font-semibold text-gray-900">{log.zone}</span>
              </div>
            )}
            {log.section && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Section:</span>
                <span className="font-semibold text-gray-900">{log.section}</span>
              </div>
            )}
            {log.shelf && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Shelf:</span>
                <span className="font-semibold text-gray-900">{log.shelf}</span>
              </div>
            )}
            {log.sourceLocation && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">From:</span>
                <span className="font-semibold text-gray-900">{log.sourceLocation}</span>
              </div>
            )}
            {log.destinationLocation && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">To:</span>
                <span className="font-semibold text-gray-900">{log.destinationLocation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Reference Info */}
        <div className="space-y-3 pb-6 border-b border-gray-200">
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Reference Information</h4>
          <div className="space-y-2">
            {log.referenceId && (
              <div>
                <span className="text-xs font-semibold text-gray-600 uppercase">Reference ID:</span>
                <div className="mt-1 p-2 bg-gray-50 rounded border border-gray-200 text-xs font-mono text-gray-900 break-all">
                  {log.referenceId}
                </div>
              </div>
            )}
            {log.requestId && (
              <div>
                <span className="text-xs font-semibold text-gray-600 uppercase">Request ID:</span>
                <div className="mt-1 p-2 bg-gray-50 rounded border border-gray-200 text-xs font-mono text-gray-900 break-all">
                  {log.requestId}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User and Timestamp */}
        <div className="space-y-3 pb-6 border-b border-gray-200">
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Action Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">User:</span>
              <span className="font-semibold text-gray-900">{log.user}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-semibold text-gray-900 text-right">{formatDate(log.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Action Description */}
        {log.actionDescription && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Action</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{log.actionDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
}
