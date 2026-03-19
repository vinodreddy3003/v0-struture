import { AuditLog } from '../types';

interface AuditLogDetailsProps {
  log: AuditLog;
}

export function AuditLogDetails({ log }: AuditLogDetailsProps) {
  return (
    <div className="space-y-4 px-4 py-3 bg-slate-50 dark:bg-slate-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Location Information */}
        <div>
          <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
            Location Hierarchy
          </h4>
          <div className="space-y-1 text-sm">
            {log.zone && (
              <div>
                <span className="font-medium text-slate-600 dark:text-slate-400">Zone:</span>{' '}
                <span className="text-slate-900 dark:text-slate-100">{log.zone}</span>
              </div>
            )}
            {log.section && (
              <div>
                <span className="font-medium text-slate-600 dark:text-slate-400">Section:</span>{' '}
                <span className="text-slate-900 dark:text-slate-100">{log.section}</span>
              </div>
            )}
            {log.shelf && (
              <div>
                <span className="font-medium text-slate-600 dark:text-slate-400">Shelf:</span>{' '}
                <span className="text-slate-900 dark:text-slate-100">{log.shelf}</span>
              </div>
            )}
            {log.sourceLocation && (
              <div>
                <span className="font-medium text-slate-600 dark:text-slate-400">From:</span>{' '}
                <span className="text-slate-900 dark:text-slate-100">{log.sourceLocation}</span>
              </div>
            )}
            {log.destinationLocation && (
              <div>
                <span className="font-medium text-slate-600 dark:text-slate-400">To:</span>{' '}
                <span className="text-slate-900 dark:text-slate-100">{log.destinationLocation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quantity Information */}
        <div>
          <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
            Quantity Change
          </h4>
          <div className="space-y-1 text-sm">
            {log.beforeQuantity !== undefined && (
              <div>
                <span className="font-medium text-slate-600 dark:text-slate-400">Before:</span>{' '}
                <span className="text-slate-900 dark:text-slate-100">{log.beforeQuantity} units</span>
              </div>
            )}
            {log.afterQuantity !== undefined && (
              <div>
                <span className="font-medium text-slate-600 dark:text-slate-400">After:</span>{' '}
                <span className="text-slate-900 dark:text-slate-100">{log.afterQuantity} units</span>
              </div>
            )}
            <div>
              <span className="font-medium text-slate-600 dark:text-slate-400">Change:</span>{' '}
              <span className={`text-base font-semibold ${log.sign === '+' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {log.sign}{log.quantity} units
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reference and Description */}
      <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
        {log.referenceId && (
          <div className="mb-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Reference ID:
            </span>{' '}
            <span className="text-sm text-slate-900 dark:text-slate-100 font-mono">{log.referenceId}</span>
          </div>
        )}
        {log.requestId && (
          <div className="mb-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Request ID:
            </span>{' '}
            <span className="text-sm text-slate-900 dark:text-slate-100 font-mono">{log.requestId}</span>
          </div>
        )}
        {log.actionDescription && (
          <div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide block mb-1">
              Action:
            </span>
            <span className="text-sm text-slate-900 dark:text-slate-100">{log.actionDescription}</span>
          </div>
        )}
      </div>
    </div>
  );
}
