"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PersonalDetailsCard from "./PersonalDetailsCard";
import ProfileCompletion   from "./ProfileCompletion";
import { profileApi, ApiError } from "@/lib/api";
import type {
  ApiUser,
  BuyerProfile,
  BuyerExtras,
  EditableUserFields,
  SecuritySetting,
  OrderSummary,
  ReviewSummary,
} from "@/types/Profile";
import { DEFAULT_SECURITY_SETTINGS, ORDER_STATUS_STYLES } from "@/types/Profile";

// ── Orders panel ─────────────────────────────────────────────────────────────

function MyOrders({ orders, isLoading }: { orders: OrderSummary[]; isLoading: boolean }) {
  if (isLoading) return (
    <div className="space-y-3 animate-pulse">
      {[0,1,2].map((i) => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />)}
    </div>
  );
  if (orders.length === 0) return (
    <div className="py-10 text-center text-slate-400">
      <span className="material-symbols-outlined text-4xl block mb-2" style={{ fontVariationSettings: "'FILL' 0" }}>receipt_long</span>
      <p className="text-sm font-medium">No orders yet.</p>
      <Link href="/marketplace" className="mt-2 text-xs text-primary-dark font-bold hover:underline inline-block">Browse Marketplace →</Link>
    </div>
  );
  return (
    <div className="space-y-2.5">
      {orders.slice(0, 6).map((order) => (
        <Link key={order.id} href={`/orders/${order.id}`}
          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-primary/5 transition-colors group">
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-dark">
              {order.order_number}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {new Date(order.created_at).toLocaleDateString("en-DZ", { dateStyle: "medium" })}
              {" · "}{order.total_items} item{order.total_items !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-3 shrink-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${ORDER_STATUS_STYLES[order.status]}`}>
              {order.status.replace("_", " ")}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              {order.total} DZD
            </span>
          </div>
        </Link>
      ))}
      {orders.length > 6 && (
        <Link href="/orders" className="block text-center text-xs text-primary-dark font-bold py-2 hover:underline">
          View all {orders.length} orders →
        </Link>
      )}
    </div>
  );
}

// ── Reviews panel ────────────────────────────────────────────────────────────

function MyReviews({ reviews, isLoading }: { reviews: ReviewSummary[]; isLoading: boolean }) {
  if (isLoading) return (
    <div className="space-y-3 animate-pulse">
      {[0,1].map((i) => <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl" />)}
    </div>
  );
  if (reviews.length === 0) return (
    <div className="py-8 text-center text-slate-400">
      <span className="material-symbols-outlined text-4xl block mb-2" style={{ fontVariationSettings: "'FILL' 0" }}>rate_review</span>
      <p className="text-sm font-medium">No reviews yet.</p>
    </div>
  );
  return (
    <div className="space-y-3">
      {reviews.slice(0, 5).map((r) => (
        <div key={r.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{r.product_name}</p>
            <span className="flex shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`material-symbols-outlined text-sm ${i < r.rating ? "text-yellow-400" : "text-slate-200"}`}
                  style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              ))}
            </span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2">{r.comment}</p>
          <p className="text-xs text-slate-400 mt-1">
            {new Date(r.created_at).toLocaleDateString("en-DZ", { dateStyle: "medium" })}
          </p>
        </div>
      ))}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-60 bg-slate-200 rounded-xl" />
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 h-56 bg-slate-100 rounded-xl" />
        <div className="md:col-span-4 h-56 bg-slate-100 rounded-xl" />
        <div className="md:col-span-8 h-64 bg-slate-100 rounded-xl" />
        <div className="md:col-span-4 h-64 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

export default function BuyerProfilePage() {
  const [user,       setUser]      = useState<ApiUser | null>(null);
  const [profile,    setProfile]   = useState<BuyerProfile>({ age: null });
  const [extras,     setExtras]    = useState<BuyerExtras>({ orders_count: 0 });
  const [userForm,   setUserForm]  = useState<EditableUserFields>({ email: "", username: "", phone: "" });
  const [orders,     setOrders]    = useState<OrderSummary[]>([]);
  const [reviews,    setReviews]   = useState<ReviewSummary[]>([]);
  const [security,   setSecurity]  = useState<SecuritySetting[]>(DEFAULT_SECURITY_SETTINGS);
  const [isLoading,  setIsLoading] = useState(true);
  const [actLoading, setActLoading] = useState(true);
  const [isSaving,   setIsSaving]  = useState(false);
  const [error,      setError]     = useState("");
  const [toast,      setToast]     = useState("");

  useEffect(() => {
    profileApi.me()
      .then((res) => {
        const { user: u, profile: p, extras: e } = (res as any).data;
        setUser(u);
        setUserForm({ email: u.email, username: u.username, phone: u.phone });
        setProfile(p);
        setExtras(e);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load profile."))
      .finally(() => setIsLoading(false));

    Promise.all([
      profileApi.myOrders().catch(() => ({ results: [] })),
      profileApi.myReviews().catch(() => ({ results: [] })),
    ]).then(([ord, rev]) => {
      setOrders(ord.results);
      setReviews(rev.results);
    }).finally(() => setActLoading(false));
  }, []);


  const completionItems = [
    { label: "Email",    done: !!userForm.email      },
    { label: "Phone",    done: !!userForm.phone      },
    { label: "Age",      done: !!profile.age         },
    { label: "Verified", done: user?.is_verified ?? false },
  ];
  const percent = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

  if (isLoading) return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto"><Skeleton /></div>
    </div>
  );

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <main className="px-4 sm:px-6 py-8 pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-primary font-bold text-xs tracking-widest uppercase">Buyer Profile</span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">Account Overview</h1>
              <p className="text-sm text-slate-500 mt-1">{extras.orders_count} order{extras.orders_count !== 1 ? "s" : ""} placed</p>
            </div>
          </div>

          {error && <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"><span className="material-symbols-outlined text-base">error</span>{error}</div>}
          {toast && <div role="status" aria-live="polite" className="flex items-center gap-2 p-4 bg-primary/10 border border-primary/20 rounded-xl text-sm text-primary-dark font-medium"><span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>{toast}</div>}

          {user && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Personal info */}
              <PersonalDetailsCard user={user} form={userForm} onChange={(k, v) => setUserForm((p) => ({ ...p, [k]: v }))} />

              {/* Stats sidebar */}
              <section className="md:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-primary/10 space-y-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Account Stats</h3>
                {/* Age edit */}
                <div className="space-y-1.5">
                  <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Age</label>
                  <input type="number" min={18} value={profile.age ?? ""} onChange={(e) => setProfile({ age: parseInt(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                    placeholder="e.g. 30" />
                </div>
                {[
                  { icon: "receipt_long", label: "Total Orders",  value: actLoading ? "…" : String(orders.length || extras.orders_count) },
                  { icon: "rate_review",  label: "Reviews Given", value: actLoading ? "…" : String(reviews.length)  },
                  { icon: "verified",     label: "Status",        value: user.is_verified ? "Verified" : "Pending"   },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <span className="material-symbols-outlined text-primary-dark text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">{s.label}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{s.value}</p>
                    </div>
                  </div>
                ))}
              </section>

              {/* Orders */}
              <section className="md:col-span-8 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-primary/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                    My Orders
                  </h3>
                  <Link href="/orders" className="text-xs text-primary-dark font-bold hover:underline">View all</Link>
                </div>
                <MyOrders orders={orders} isLoading={actLoading} />
              </section>

              {/* Reviews */}
              <section className="md:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-primary/10">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>rate_review</span>
                  My Reviews
                </h3>
                <MyReviews reviews={reviews} isLoading={actLoading} />
              </section>
            </div>
          )}

          <ProfileCompletion percent={percent} items={completionItems} />
        </div>
      </main>
    </div>
  );
}