"use client";

import { useState } from "react";
import type { ActiveMission } from "@/types/Transporter";
import { MISSION_STEPS, stepToStatus } from "@/types/Transporter";

interface Props {
  mission: ActiveMission;
  onStatusUpdate?: (missionId: number, newStatus: string) => void;
  isLoading?: boolean;
}

export default function ActiveMissionStrip({ mission, onStatusUpdate, isLoading: externalLoading }: Props) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading || internalLoading;
  const [currentStep, setCurrentStep] = useState(mission.currentStep);

  const handleUpdateStatus = async () => {
    const i = MISSION_STEPS.indexOf(currentStep);
    if (i < MISSION_STEPS.length - 1) {
      const nextStep = MISSION_STEPS[i + 1];
      const newStatus = stepToStatus[nextStep];
      
      if (onStatusUpdate) {
        setInternalLoading(true);
        await onStatusUpdate(mission.missionId, newStatus);
        setCurrentStep(nextStep);
        setInternalLoading(false);
      }
    }
  };

  const stepIndex = MISSION_STEPS.indexOf(currentStep);
  const isComplete = currentStep === "Delivered";

  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase text-slate-500">
          Active Mission #{mission.missionId}
        </h3>
        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold dark:bg-blue-900/40 dark:text-blue-300">
          {mission.status}
        </span>
      </div>

      <div className="bg-white dark:bg-[#1a2e1a] border border-slate-200 dark:border-slate-600 rounded-lg p-3 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold">{mission.cargo}</span>
          <span className="text-xs text-slate-500">
            ETA: {isComplete ? "Arrived" : `${mission.etaMins} mins`}
          </span>
        </div>

        {/* Step progress */}
        <div className="flex items-center justify-between text-xs mb-3">
          {MISSION_STEPS.map((step, idx) => {
            const isDone = idx < stepIndex;
            const isActive = step === currentStep;

            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all ${
                      isDone
                        ? "bg-primary border-primary text-black"
                        : isActive
                        ? "border-primary bg-white dark:bg-slate-800 animate-pulse"
                        : "border-slate-300 bg-slate-100 dark:bg-slate-800 dark:border-slate-600"
                    }`}
                  >
                    {isDone && <span className="material-icons text-[10px]">check</span>}
                  </div>
                  <span
                    className={
                      isDone || isActive
                        ? "text-primary-dark dark:text-primary font-semibold"
                        : "text-slate-400"
                    }
                  >
                    {step}
                  </span>
                </div>
                {idx < MISSION_STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-1 transition-all ${
                      isDone ? "bg-primary" : "bg-slate-200 dark:bg-slate-600"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleUpdateStatus}
          disabled={isLoading || isComplete}
          className="w-full bg-primary hover:bg-green-400 text-black font-bold py-2 px-4 rounded shadow-md transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="material-icons animate-spin text-sm">progress_activity</span>
          ) : isComplete ? (
            "Mission Complete ✓"
          ) : (
            "Update Status"
          )}
        </button>
      </div>
    </div>
  );
}