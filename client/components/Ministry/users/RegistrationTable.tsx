import Image from 'next/image';
import type { UserRequest, RoleFilter } from '@/types/UserManagement';
import {
  ROLE_BADGE_STYLES,
  STATUS_STYLES,
  ROLE_FILTERS,
  PAGE_SIZE,
  TOTAL_REQUESTS,
} from '@/types/UserManagement';

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface RegistrationTableProps {
  requests:      UserRequest[];
  activeFilter:  RoleFilter;
  currentPage:   number;
  onFilterChange: (filter: RoleFilter) => void;
  onPageChange:   (page: number) => void;
  onViewDocs:     (id: string) => void;
  onApprove:      (id: string) => void;
  onReject:       (id: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegistrationTable({
  requests,
  activeFilter,
  currentPage,
  onFilterChange,
  onPageChange,
  onViewDocs,
  onApprove,
  onReject,
}: RegistrationTableProps) {
  const totalPages = Math.ceil(TOTAL_REQUESTS / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end   = Math.min(currentPage * PAGE_SIZE, TOTAL_REQUESTS);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Table toolbar */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-bold">Registration Requests</h3>

        <div className="flex items-center gap-3">
          {/* Role filter tabs */}
          <div
            role="tablist"
            aria-label="Filter by role"
            className="flex rounded-lg border border-slate-200 dark:border-slate-800 p-1 bg-slate-50 dark:bg-slate-800/50"
          >
            {ROLE_FILTERS.map((filter) => (
              <button
                key={filter}
                role="tab"
                aria-pressed={activeFilter === filter}
                onClick={() => onFilterChange(filter)}
                className={
                  activeFilter === filter
                    ? 'px-3 py-1 rounded-md bg-white dark:bg-slate-700 shadow-sm text-xs font-bold transition-all'
                    : 'px-3 py-1 rounded-md text-slate-500 dark:text-slate-400 text-xs font-medium hover:text-primary transition-colors'
                }
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Filter button */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">User Details</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Reg. Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-slate-400 font-medium"
                >
                  No registration requests match your current filter.
                </td>
              </tr>
            ) : (
              requests.map((user) => {
                const roleBadge  = ROLE_BADGE_STYLES[user.role];
                const statusStyle = STATUS_STYLES[user.status];
                const isPending  = user.status === 'Pending';

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* User details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative shrink-0">
                          <Image
                            src={user.avatarUrl}
                            alt={`${user.name} avatar`}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{user.name}</p>
                          <p className="text-xs text-slate-500">ID: #{user.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${roleBadge}`}
                      >
                        {user.role.toUpperCase()}
                      </span>
                    </td>

                    {/* Registration date */}
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(user.registeredAt)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${statusStyle.dot}`} />
                        <span className={`text-sm font-medium ${statusStyle.text}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {isPending ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => onViewDocs(user.id)}
                            className="px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                          >
                            View Docs
                          </button>
                          <button
                            aria-label={`Approve ${user.name}`}
                            onClick={() => onApprove(user.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined text-xl">check_circle</span>
                          </button>
                          <button
                            aria-label={`Reject ${user.name}`}
                            onClick={() => onReject(user.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined text-xl">cancel</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-medium italic text-slate-400">
                          {user.resolution}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing{' '}
          <span className="font-bold">
            {start}–{end}
          </span>{' '}
          of <span className="font-bold">{TOTAL_REQUESTS}</span> pending requests
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-bold disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1 rounded-lg bg-primary text-slate-900 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}