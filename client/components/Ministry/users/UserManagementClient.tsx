'use client';

import { useState, useMemo } from 'react';
import UserManagementSidebar from './Sidebar';
import UserStatCards from './StatCards';
import RegistrationTable from './RegistrationTable';
import {
  INITIAL_USER_REQUESTS,
} from '@/types/UserManagement';
import type { UserRequest, RoleFilter, UserStatus } from '@/types/UserManagement';

export default function UserManagementPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [requests, setRequests]         = useState<UserRequest[]>(INITIAL_USER_REQUESTS);
  const [search, setSearch]             = useState('');
  const [activeFilter, setActiveFilter] = useState<RoleFilter>('All');
  const [currentPage, setCurrentPage]   = useState(1);

  // ── Derived ────────────────────────────────────────────────────────────────
  const filteredRequests = useMemo(() => {
    return requests.filter((u) => {
      const matchesRole =
        activeFilter === 'All' || u.role === activeFilter;
      const matchesSearch =
        search.trim() === '' ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.id.toLowerCase().includes(search.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [requests, activeFilter, search]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  function updateStatus(id: string, status: UserStatus, resolution?: string) {
    setRequests((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status, resolution: resolution ?? u.resolution } : u,
      ),
    );
  }

  function handleApprove(id: string) {
    updateStatus(id, 'Verified', 'Approved by Admin');
  }

  function handleReject(id: string) {
    updateStatus(id, 'Rejected', 'Rejected by Admin');
  }

  function handleViewDocs(id: string) {
    // TODO: open docs drawer/modal
    console.log('View docs for:', id);
  }

  function handleFilterChange(filter: RoleFilter) {
    setActiveFilter(filter);
    setCurrentPage(1); // reset to first page on filter change
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <UserManagementSidebar />

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">verified_user</span>
            <h2 className="text-lg font-bold">User Management Dashboard</h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative max-w-md w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or ID"
                aria-label="Search users by name or ID"
                className="w-full pl-10 pr-4 py-1.5 rounded-lg border-none bg-slate-100 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>

            {/* Icon buttons */}
            <div className="flex gap-2">
              <button
                aria-label="View notifications"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
                  notifications
                </span>
              </button>
              <button
                aria-label="View account"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
                  account_circle
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-8">
          <UserStatCards />

          <RegistrationTable
            requests={filteredRequests}
            activeFilter={activeFilter}
            currentPage={currentPage}
            onFilterChange={handleFilterChange}
            onPageChange={setCurrentPage}
            onViewDocs={handleViewDocs}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </main>
    </div>
  );
}