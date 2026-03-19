import { AuditLogs } from '@/components/warehouse/audit/audit-logs';

export const metadata = {
  title: 'Audit Logs - Warehouse Management',
  description: 'View and manage warehouse audit logs',
};

export default function AuditLogsPage() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-8">
        <AuditLogs />
      </div>
    </main>
  );
}
