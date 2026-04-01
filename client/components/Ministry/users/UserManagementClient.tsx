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