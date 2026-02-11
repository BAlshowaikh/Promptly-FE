import React, { useEffect, useState } from "react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"

import api from "../../services/api"


const STEPS = ["Basics", "Models", "Review"]

const emptyModelConfig = {
  ai_model: "",
  temperature: 0.7,
  system_prompt: "",
}

const DevSessionModal = ({ open, onClose, onCreated }) => {
  const [step, setStep] = useState(0)

  // STEP 1 
  const [title, setTitle] = useState("");
  const [runMode, setRunMode] = useState("pipeline");

  // STEP 2
  const [coderConfig, setCoderConfig] = useState({ ...emptyModelConfig });
  const [explainerConfig, setExplainerConfig] = useState({
    ...emptyModelConfig,
  })

  // models
  const [aiModels, setAiModels] = useState([])
  const [modelsLoading, setModelsLoading] = useState(false)
  // submit
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // ----- Hook 1: reset fields when open/close
  useEffect(() => {
    if (!open) return

    setStep(0)
    setTitle("")
    setRunMode("pipeline")
    setCoderConfig({ ...emptyModelConfig })
    setExplainerConfig({ ...emptyModelConfig })
    setErrorMsg("")
  }, [open])

  // ---------- Hokk 2: fetch models list when modal opens
  useEffect(() => {
    if (!open) return

    const fetchModels = async () => {
      setModelsLoading(true)
      setErrorMsg("")
      try {
        // call the api that has the available_models
        const res = await api.get("/developing/sessions/")
        const models = res.data?.data?.available_models ?? []
        setAiModels(models)
      } catch (e) {
        console.error("Failed to load models:", e)
        setAiModels([])
        setErrorMsg("Failed to load available models")
      } finally {
        setModelsLoading(false)
      }
    }

    fetchModels()
  }, [open])


  // ------------ Function 1: Submit session create 
  const launch = async () => {
    if (!step1Valid || !step2Valid || submitting) return

    setSubmitting(true)
    setErrorMsg("")

    const payload = {
      title: title.trim(),
      run_mode: runMode,
      model_configs: [
        {
          role: "coder",
          ai_model: coderConfig.ai_model,
          temperature: Number(coderConfig.temperature),
          system_prompt: coderConfig.system_prompt || "",
          is_enabled: true,
        },
        {
          role: "explainer",
          ai_model: explainerConfig.ai_model,
          temperature: Number(explainerConfig.temperature),
          system_prompt: explainerConfig.system_prompt || "",
          is_enabled: true,
        },
      ],
    }

    try {
      const res = await api.post("/developing/sessions/", payload)
      const created = res.data?.data ?? null

      onCreated?.(created)
      onClose?.()
    } catch (e) {
      console.error("Create session failed:", e)
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.detail ||
        "Failed to create session"
      setErrorMsg(msg)
    } finally {
      setSubmitting(false)
    }
  }


  /* -------------- VALIDATION  */
  const step1Valid = title.trim().length >= 3;
  const step2Valid =
    coderConfig.ai_model && explainerConfig.ai_model;

  const canNext =
    (step === 0 && step1Valid) ||
    (step === 1 && step2Valid) ||
    step === 2

  /* ----------------- NAV  */
  const next = () => setStep((s) => Math.min(s + 1, 2))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="w-full max-w-3xl bg-[#1a1b26] rounded-xl border border-gray-800 shadow-2xl overflow-hidden">

        {/* Header + Step Nav (FULL WIDTH + HR LINE) */}
        <div className="border-b border-gray-800 bg-[#11121a]">
            {/* Top row: title + close */}
            <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-sm font-bold tracking-wider uppercase text-gray-200">
                Create Dev Session
            </h2>
            <button onClick={onClose}>
                <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
            </div>

            {/* Step Navigation */}
            <div className="px-6 pb-4">
            <div className="relative flex items-center justify-between">
                {/* HR line behind the steps */}
                <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-700" />

                {STEPS.map((label, i) => {
                const isActive = i === step
                const isDone = i < step

                return (
                    <div
                    key={label}
                    className="relative z-10 flex flex-col items-center flex-1"
                    >
                    {/* circle */}
                    <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center border text-xs font-bold
                        ${
                            isDone
                            ? "bg-blue-600 border-blue-600 text-white"
                            : isActive
                            ? "bg-[#1a1b26] border-blue-500 text-blue-400"
                            : "bg-[#1a1b26] border-gray-600 text-gray-500"
                        }
                        `}
                    >
                        {isDone ? <CheckIcon className="w-4 h-4" /> : i + 1}
                    </div>

                    {/* label */}
                    <span
                        className={`mt-2 text-[11px] tracking-wide
                        ${isActive || isDone ? "text-gray-200" : "text-gray-500"}
                        `}
                    >
                        {label}
                    </span>
                    </div>
                )
                })}
            </div>
            </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 min-h-[320px]">

            {/* STEP 1 */}
            {step === 0 && (
            <div className="space-y-6">
                <div>
                <label className="text-xs text-gray-400">Session Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 w-full bg-[#11121a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                    placeholder="e.g. Python Backend Debugging"
                />
                {!step1Valid && title && (
                    <div className="text-[11px] text-red-400 mt-1">
                    Title must be at least 3 characters
                    </div>
                )}
                </div>

                <div>
                <label className="text-xs text-gray-400">Run Mode</label>
                <select
                    value={runMode}
                    onChange={(e) => setRunMode(e.target.value)}
                    className="mt-2 w-full bg-[#11121a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                >
                    <option value="pipeline">Pipeline</option>
                    <option value="parallel">Parallel</option>
                </select>
                </div>
            </div>
            )}

            {/* STEP 2 */}
            {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                ["Coder", coderConfig, setCoderConfig],
                ["Explainer", explainerConfig, setExplainerConfig],
                ].map(([label, cfg, setCfg]) => (
                <div key={label} className="border border-gray-800 rounded-lg p-4">
                    <div className="text-xs font-bold text-gray-300 mb-4">
                    {label} Configuration
                    </div>

                    <div className="mb-4">
                    <label className="text-xs text-gray-400">AI Model</label>
                    <select
                        value={cfg.ai_model}
                        onChange={(e) => setCfg({ ...cfg, ai_model: e.target.value })}
                        className="mt-2 w-full bg-[#11121a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                    >
                        <option value="">Select model</option>
                        {aiModels.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.display_name}
                        </option>
                        ))}
                    </select>
                    </div>

                    <div className="mb-4">
                    <label className="text-xs text-gray-400">
                        Temperature ({cfg.temperature})
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={cfg.temperature}
                        onChange={(e) =>
                        setCfg({
                            ...cfg,
                            temperature: parseFloat(e.target.value),
                        })
                        }
                        className="w-full"
                    />
                    </div>

                    <div>
                    <label className="text-xs text-gray-400">
                        System Prompt (optional)
                    </label>
                    <textarea
                        rows={3}
                        value={cfg.system_prompt}
                        onChange={(e) => setCfg({ ...cfg, system_prompt: e.target.value })}
                        className="mt-2 w-full bg-[#11121a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                    />
                    </div>
                </div>
                ))}
            </div>
            )}

            {/* STEP 3 */}
            {step === 2 && (
            <div className="space-y-4 text-sm text-gray-300">
                <div>
                <span className="text-gray-400">Title:</span> {title}
                </div>
                <div>
                <span className="text-gray-400">Run Mode:</span> {runMode}
                </div>
                <div>
                <span className="text-gray-400">Coder Model:</span>{" "}
                {coderConfig.ai_model}
                </div>
                <div>
                <span className="text-gray-400">Explainer Model:</span>{" "}
                {explainerConfig.ai_model}
                </div>
            </div>
            )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 bg-[#11121a]">
            <button
            onClick={back}
            disabled={step === 0}
            className="flex items-center gap-2 text-sm text-gray-400 disabled:opacity-40"
            >
            <ChevronLeftIcon className="w-4 h-4" />
            Back
            </button>

            <button
            disabled={!canNext}
            onClick={step === 2 ? launch : next}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-40"
            >
            {submitting ? "Launching..." : step === 2 ? "Launch Session" : "Next"}
            {step !== 2 && <ChevronRightIcon className="w-4 h-4" />}
            </button>
        </div>
        </div>
    </div>
  )
}

export default DevSessionModal
