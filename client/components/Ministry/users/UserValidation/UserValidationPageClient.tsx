'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import IdentityVerificationCard from './IdentityVerificationCard';
import FarmDocumentsCard from './Documents';
import ActivityHistoryCard from './ActivityHistoryCard';
import FarmLocationCard from './FarmLocationCard';
import VerificationPanel from './VerificationPanel';
import ApprovalSuccessOverlay from './ApprovalSuccessOverlay';
import {
  TOP_NAV,
  SIDEBAR_NAV,
  BREADCRUMBS,
  FARMER_SUBMISSION,
  IDENTITY_DETAILS,
  FARM_DOCUMENTS,
  ACTIVITY_HISTORY,
  VERIFICATION_STEPS,
  ADMIN_AVATAR_URL,
} from '@/types/UserValidation';

export default function FarmerVerificationPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [internalNote, setInternalNote]   = useState('');
  const [isConfirming, setIsConfirming]   = useState(false);
  const [isRejecting, setIsRejecting]     = useState(false);
  const [showSuccess, setShowSuccess]     = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────
  async function handleApprove() {
    setIsConfirming(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsConfirming(false);
    setShowSuccess(true);
  }

  async function handleReject() {
    setIsRejecting(true);
    // TODO: open rejection reason modal / call API
    await new Promise((r) => setTimeout(r, 600));
    setIsRejecting(false);
    console.log('Farmer rejected');
  }

  function handleRequestInfo() {
    // TODO: open request-info modal
    console.log('Request additional info');
  }

  function handleContinueAfterApproval() {
    setShowSuccess(false);
    // TODO: navigate to next pending review
    console.log('Continue to next review');
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Success overlay */}
      {showSuccess && (
        <ApprovalSuccessOverlay
          farmerName={FARMER_SUBMISSION.name}
          onContinue={handleContinueAfterApproval}
        />
      )}

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col h-full w-64 fixed left-0 top-0 z-40 bg-white dark:bg-slate-900 border-r border-primary/10 py-4 pt-20 space-y-2">
        <div className="px-6 mb-8">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 text-xl">Modern Homestead</h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Agri-Management System</p>
        </div>
        <nav className="flex-1 space-y-1 px-2" aria-label="Sidebar navigation">
          {SIDEBAR_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={
                item.active
                  ? 'bg-primary/10 text-primary rounded-xl px-4 py-3 mx-2 flex items-center gap-3 text-sm font-medium tracking-wide uppercase'
                  : 'text-slate-600 dark:text-slate-400 px-4 py-3 mx-2 flex items-center gap-3 hover:bg-primary/10 hover:text-primary transition-all rounded-xl text-sm font-medium tracking-wide uppercase'
              }
            >
              <span
                className="material-symbols-outlined"
                style={item.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-2 space-y-1 pt-4 border-t border-primary/10">
          <button className="w-full bg-primary text-slate-900 rounded-full py-3 px-4 font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-90 active:scale-95 transition-all">
            <span className="material-symbols-outlined">add</span>
            New Record
          </button>
          {[{ label: 'Help', icon: 'help', href: '#' }, { label: 'Logout', icon: 'logout', href: '#' }].map((item) => (
            <Link key={item.label} href={item.href} className="text-slate-600 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-sm font-medium tracking-wide uppercase">
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-24 pb-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">

          {/* Page header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              {/* Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="flex text-xs font-bold uppercase tracking-widest text-slate-500 gap-2 mb-2">
                {BREADCRUMBS.map((crumb, i) => (
                  <span key={crumb} className="flex items-center gap-2">
                    {i < BREADCRUMBS.length - 1 ? (
                      <>
                        <span className="hover:text-primary cursor-pointer transition-colors">{crumb}</span>
                        <span>/</span>
                      </>
                    ) : (
                      <span className="text-primary font-semibold">{crumb}</span>
                    )}
                  </span>
                ))}
              </nav>

              {/* Farmer identity row */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm relative shrink-0">
                  <Image
                    src={FARMER_SUBMISSION.avatarUrl}
                    alt={`${FARMER_SUBMISSION.name} profile portrait`}
                    fill
                    sizes="64px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight">
                    {FARMER_SUBMISSION.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      {FARMER_SUBMISSION.role}
                    </span>
                    <span className="text-slate-500 text-sm font-medium italic">
                      • Submitted {FARMER_SUBMISSION.submittedAt}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                onClick={handleReject}
                disabled={isRejecting}
                className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 active:scale-95 transition-all hover:bg-red-200 dark:hover:bg-red-900/30 disabled:opacity-60"
              >
                {isRejecting ? (
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-lg">block</span>
                )}
                Reject
              </button>
              <button
                onClick={handleRequestInfo}
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 active:scale-95 transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <span className="material-symbols-outlined text-lg">info</span>
                Request Info
              </button>
              <button
                onClick={handleApprove}
                disabled={isConfirming}
                className="bg-primary text-slate-900 px-8 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-all hover:opacity-90 disabled:opacity-60"
              >
                {isConfirming ? (
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                ) : (
                  <span
                    className="material-symbols-outlined text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
                Approve Verification
              </button>
            </div>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column */}
            <div className="lg:col-span-8 space-y-6">
              <IdentityVerificationCard
                idCardUrl={FARMER_SUBMISSION.idCardUrl}
                details={IDENTITY_DETAILS}
                selfieVerified
                onViewFullScreen={() => console.log('View full screen')}
              />
              <FarmDocumentsCard
                documents={FARM_DOCUMENTS}
                onOpenDoc={(id) => console.log('Open doc:', id)}
              />
              <ActivityHistoryCard events={ACTIVITY_HISTORY} />
            </div>

            {/* Right column */}
            <div className="lg:col-span-4 space-y-6">
              <FarmLocationCard
                mapImageUrl={FARMER_SUBMISSION.mapImageUrl}
                farmName={FARMER_SUBMISSION.farmName}
                farmCoords={FARMER_SUBMISSION.farmCoords}
                farmHectares={FARMER_SUBMISSION.farmHectares}
                onFullMap={() => console.log('Open full map')}
              />
              <VerificationPanel
                steps={VERIFICATION_STEPS}
                internalNote={internalNote}
                onNoteChange={setInternalNote}
                onConfirmApproval={handleApprove}
                isConfirming={isConfirming}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}