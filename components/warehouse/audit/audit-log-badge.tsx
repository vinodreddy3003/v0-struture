import { AuditLogType, AuditLogStatus } from '../types';

interface AuditLogBadgeProps {
  type: AuditLogType;
  status?: AuditLogStatus;
}

export function AuditLogBadge({ type, status }: AuditLogBadgeProps) {
  const typeColors: Record<AuditLogType, { bg: string; text: string; label: string }> = {
    'stock-in': {
      bg: 'bg-green-50 dark:bg-green-950',
      text: 'text-green-700 dark:text-green-300',
      label: 'Stock In',
    },
    'stock-out': {
      bg: 'bg-red-50 dark:bg-red-950',
      text: 'text-red-700 dark:text-red-300',
      label: 'Stock Out',
    },
    'stock-transfer': {
      bg: 'bg-blue-50 dark:bg-blue-950',
      text: 'text-blue-700 dark:text-blue-300',
      label: 'Transfer',
    },
  };

  const statusColors: Record<AuditLogStatus, { bg: string; text: string; label: string }> = {
    pending: {
      bg: 'bg-yellow-50 dark:bg-yellow-950',
      text: 'text-yellow-700 dark:text-yellow-300',
      label: 'Pending',
    },
    picked: {
      bg: 'bg-blue-50 dark:bg-blue-950',
      text: 'text-blue-700 dark:text-blue-300',
      label: 'Picked',
    },
    completed: {
      bg: 'bg-green-50 dark:bg-green-950',
      text: 'text-green-700 dark:text-green-300',
      label: 'Completed',
    },
    failed: {
      bg: 'bg-red-50 dark:bg-red-950',
      text: 'text-red-700 dark:text-red-300',
      label: 'Failed',
    },
  };

  const typeColor = typeColors[type];
  const statusColor = status ? statusColors[status] : null;

  return (
    <div className="flex gap-2">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor.bg} ${typeColor.text}`}
      >
        {typeColor.label}
      </span>
      {statusColor && (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
        >
          {statusColor.label}
        </span>
      )}
    </div>
  );
}
