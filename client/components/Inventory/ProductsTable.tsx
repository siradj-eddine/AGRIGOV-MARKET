import Image from "next/image";
import Link from "next/link";
import type { MyProduct } from "@/types/Inventory";

const PLACEHOLDER = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=200&q=70";

interface Props {
  products:   MyProduct[];
  isLoading:  boolean;
  onDelete:   (id: number) => Promise<void>;
  onToggleStock: (id: number, current: boolean) => Promise<void>;
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[64, 120, 60, 80, 70, 80].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className={`h-4 bg-slate-100 dark:bg-slate-800 rounded`} style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

function RatingStars({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <span
        className="material-symbols-outlined text-yellow-400 text-base"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        star
      </span>
      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
        {rating > 0 ? rating.toFixed(1) : "—"}
      </span>
      <span className="text-xs text-slate-400">({count})</span>
    </div>
  );
}

export default function ProductsTable({ products, isLoading, onDelete, onToggleStock }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary/5 border-b border-primary/10">
              {[
                { label: "Product",           align: "" },
                { label: "Category / Season", align: "" },
                { label: "Stock",             align: "text-center" },
                { label: "Price",             align: "" },
                { label: "Rating",            align: "" },
                { label: "Status",            align: "text-center" },
                { label: "Actions",           align: "text-right" },
              ].map(({ label, align }) => (
                <th
                  key={label}
                  className={`px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap ${align}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-primary/5">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <span
                    className="material-symbols-outlined text-5xl text-slate-200 dark:text-slate-700 block mb-3"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    inventory_2
                  </span>
                  <p className="text-sm font-semibold text-slate-500">No products found.</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or add a new listing.</p>
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const imageUrl = p.images[0]?.image ?? PLACEHOLDER;
                const price    = parseFloat(p.unit_price);

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors hover:bg-primary/5 ${!p.in_stock ? "opacity-60" : ""}`}
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-primary/10 relative shrink-0 bg-slate-50">
                          <Image
                            src={imageUrl}
                            alt={p.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                          {p.images.length > 1 && (
                            <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[9px] font-bold px-1 rounded-tl">
                              +{p.images.length - 1}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/marketplace/${p.id}`}
                            className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-primary-dark transition-colors truncate block"
                          >
                            {p.title}
                          </Link>
                          <p className="text-xs text-slate-400 truncate">{p.farm.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category / Season */}
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize block">
                        {p.category}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">{p.season.replace("_", " ")}</span>
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        p.stock > 50 ? "bg-green-100 text-green-700" :
                        p.stock > 10 ? "bg-yellow-100 text-yellow-700" :
                                       "bg-red-100 text-red-600"
                      }`}>
                        {p.stock.toLocaleString()}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {price.toLocaleString("fr-DZ")} DZD
                      </span>
                      <span className="text-xs text-slate-400 block">/ unit</span>
                    </td>

                    {/* Rating */}
                    <td className="px-5 py-4">
                      <RatingStars rating={p.average_rating} count={p.review_count} />
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        p.in_stock
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {p.in_stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end items-center gap-1">
                        {/* Edit */}
                        <Link
                          href={`/farmer/dashboard/products/${p.id}/edit`}
                          aria-label={`Edit ${p.title}`}
                          title="Edit"
                          className="p-2 text-slate-500 hover:text-primary-dark hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </Link>

                        {/* Toggle stock */}
                        <button
                          type="button"
                          aria-label={p.in_stock ? `Mark ${p.title} out of stock` : `Mark ${p.title} in stock`}
                          title={p.in_stock ? "Mark Out of Stock" : "Mark In Stock"}
                          onClick={() => onToggleStock(p.id, p.in_stock)}
                          className="p-2 text-slate-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">
                            {p.in_stock ? "inventory" : "add_box"}
                          </span>
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          aria-label={`Delete ${p.title}`}
                          title="Delete"
                          onClick={() => onDelete(p.id)}
                          className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">delete_outline</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}