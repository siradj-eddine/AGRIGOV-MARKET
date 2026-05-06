"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiFarm } from "@/types/Product";
import { chatApi, ApiError } from "@/lib/api";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

interface Props {
  farm: ApiFarm;
  farmerName?: string;
}

export default function FarmerProfileWidget({ farm, farmerName }: Props) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const location = [farm.wilaya, farm.baladiya].filter(Boolean).join(", ");

  const handleChat = async () => {
    const role = getCookie("role");

    if (role !== "BUYER") {
      alert("Please login as a buyer to message farmers.");
      router.push("/Login");
      return;
    }

    const productId = (window as any).__currentProductId;
    
    if (!productId) {
      alert("Product information not available. Please refresh the page.");
      return;
    }
    console.log("Starting chat with:", { productId, farmId: farm.id, role });
    setStarting(true);
    try {
      const conv = await chatApi.start(farm.id);
      router.push(`/chat/${conv.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          router.push("/Login");
        } else {
          alert(err.message || "Failed to start chat.");
        }
      } else {
        alert("Failed to connect. Make sure the server is running.");
      }
    }
    setStarting(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-12 h-12 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-primary-dark text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              person
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-100 rounded-full border border-white flex items-center justify-center">
              <span
                className="material-symbols-outlined text-green-600"
                style={{ fontSize: "10px", fontVariationSettings: "'FILL' 1" }}
              >
                check
              </span>
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900">{farm.name}</h4>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-xs">location_on</span>
              {location || "Algeria"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Managed by {farmerName || "Farmer"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "Status", value: "Verified ✓" },
            { label: "Address", value: farm.address ?? "—" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-50 p-2.5 rounded-lg text-center">
              <span className="block text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                {stat.label}
              </span>
              <span className="text-xs font-semibold text-gray-800 truncate block">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleChat}
          disabled={starting}
          className="w-full py-3 text-sm font-bold bg-primary text-black rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          {starting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              Starting Chat...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">chat</span>
              Chat with Farmer
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 flex items-start gap-3">
        <span
          className="material-symbols-outlined text-primary-dark text-xl shrink-0 mt-0.5"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          verified
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-900">Ministry Verified Farm</p>
          <p className="text-xs text-gray-500 mt-0.5">
            This farm has been reviewed and approved by a Ministry agent. All
            transactions are protected by the National Agricultural Platform.
          </p>
        </div>
      </div>
    </div>
  );
}