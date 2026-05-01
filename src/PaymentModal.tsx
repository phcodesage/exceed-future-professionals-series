"use client";

import { useState, useEffect } from "react";
import { X, CreditCard, Banknote, Send, CheckCircle2, Loader2, Banknote as CashIcon } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  cashPrice: string;   // e.g. "$160"
  cardPrice: string;   // e.g. "$166.40" (price + 4%)
  stripeLink: string;
}

interface RegistrationForm {
  parentName: string;
  childName: string;
  email: string;
  phone: string;
  gradeLevel: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  courseName,
  cashPrice,
  cardPrice,
  stripeLink,
}: PaymentModalProps) {
  // Lock background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const [step, setStep] = useState<"register" | "choose" | "zelle" | "done">("register");
  const [regForm, setRegForm] = useState<RegistrationForm>({
    parentName: "",
    childName: "",
    email: "",
    phone: "",
    gradeLevel: "",
  });
  const [zelleReference, setZelleReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  function handleClose() {
    setStep("register");
    setRegForm({
      parentName: "",
      childName: "",
      email: "",
      phone: "",
      gradeLevel: "",
    });
    setZelleReference("");
    setLoading(false);
    setError("");
    onClose();
  }

  function handleCardPay() {
    window.open(stripeLink, "_blank", "noopener,noreferrer");
    handleClose();
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const baseUrl = rawBaseUrl.replace(/\/+$/, '');

      const response = await fetch(`${baseUrl}/api/waitlist`, { // Reusing waitlist API for enrollment
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...regForm,
          programInterests: [courseName],
        }),
      });

      if (!response.ok) throw new Error('Failed to save registration');

      setStep("choose");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleZelleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Small delay to simulate sending
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep("done");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      style={{ animation: "fadeIn 0.2s ease" }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full md:max-w-2xl lg:max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b bg-[#05264d]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
              Payment Options
            </p>
            <h2 className="text-lg font-bold text-white mt-0.5">{courseName}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Price Note Banner */}
        <div className="bg-[#f7e0e0] border-b border-[#ca3433]/20 px-4 sm:px-6 py-3 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0e1f3e]">
            <span className="text-[#ca3433] text-lg shrink-0">🎓</span>
            <div className="flex flex-wrap items-center">
              Full Program: <span className="text-[#ca3433] text-lg font-black ml-1">$559</span>
              <span className="text-[#0e1f3e]/60 font-normal ml-2">— flat rate, no fees</span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain">
          {/* STEP: Register */}
          {step === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <p className="text-sm text-gray-600 mb-2 font-medium">
                Fill up the form to enroll in <span className="text-[#ca3433] font-bold">{courseName}</span>.
              </p>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#05264d] uppercase tracking-wider">Parent / Guardian Name *</label>
                  <input
                    required
                    type="text"
                    value={regForm.parentName}
                    onChange={(e) => setRegForm(f => ({ ...f, parentName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#ca3433] outline-none transition-all text-base"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#05264d] uppercase tracking-wider">Child&apos;s Name *</label>
                  <input
                    required
                    type="text"
                    value={regForm.childName}
                    onChange={(e) => setRegForm(f => ({ ...f, childName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#ca3433] outline-none transition-all text-base"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#05264d] uppercase tracking-wider">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={regForm.email}
                      onChange={(e) => setRegForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#ca3433] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#05264d] uppercase tracking-wider">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      value={regForm.phone}
                      onChange={(e) => setRegForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#ca3433] outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#05264d] uppercase tracking-wider">Child&apos;s Grade Level *</label>
                  <select
                    required
                    value={regForm.gradeLevel}
                    onChange={(e) => setRegForm(f => ({ ...f, gradeLevel: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#ca3433] outline-none transition-all"
                  >
                    <option value="">Select Grade</option>
                    <option value="K">Kindergarten</option>
                    <option value="1-2">Grades 1-2</option>
                    <option value="3-4">Grades 3-4</option>
                    <option value="5-6">Grades 5-6</option>
                  </select>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full py-4 bg-[#ca3433] text-white font-bold text-lg rounded-full hover:bg-[#b1302f] transition-all shadow-lg mt-4 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Continue to Payment"}
              </button>
            </form>
          )}

          {/* STEP: Choose */}
          {step === "choose" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => setStep("register")}
                  className="text-xs font-bold text-gray-500 hover:text-[#ca3433] flex items-center gap-1"
                >
                  &larr; Back to Registration
                </button>
                <span className="text-xs font-bold text-gray-400">Step 2 of 2</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Choose your preferred payment method below.
              </p>
              
              {/* Cash / Zelle */}
              <button
                onClick={() => setStep("zelle")}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-green-200 bg-green-50 hover:border-green-400 hover:bg-green-100 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                  SAVE 4%
                </div>
                <div className="w-11 h-11 rounded-xl bg-green-600 flex items-center justify-center shrink-0">
                  <Banknote className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Pay with Cash (Zelle)</p>
                  <p className="text-sm text-gray-600">
                    Pay only <strong className="text-green-700">$536.64</strong> via Zelle
                  </p>
                </div>
              </button>

              {/* Card */}
              <button
                onClick={handleCardPay}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#05264d] flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Pay by Card</p>
                  <p className="text-sm text-gray-600">
                    Standard rate: <strong className="text-[#05264d]">$559.00</strong>
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* STEP: Zelle form */}
          {step === "zelle" && (
            <div>
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl text-xs sm:text-sm text-green-800">
                <p className="font-bold mb-1">How to pay via Zelle:</p>
                <ol className="list-decimal list-inside space-y-1 text-green-700">
                  <li>Open your banking app and go to Zelle</li>
                  <li>
                    Send <strong className="text-green-900">$536.64</strong> to:
                    <div className="bg-white/60 p-2 mt-1 rounded-lg break-all font-mono text-center select-all">
                      payments@exceedlearningcenterny.com
                    </div>
                  </li>
                  <li>Note your reference number</li>
                  <li>Fill it in below to confirm</li>
                </ol>
              </div>

              <form onSubmit={handleZelleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#05264d] uppercase tracking-wider">
                    Zelle Reference / Confirmation Number *
                  </label>
                  <input
                    required
                    type="text"
                    value={zelleReference}
                    onChange={(e) => setZelleReference(e.target.value)}
                    placeholder="e.g. ZL123456789"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-[#05264d]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("choose")}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    disabled={loading}
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? "Submitting..." : "Confirm Zelle Payment"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP: Done */}
          {step === "done" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Zelle Payment Confirmed!
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Thank you, <strong>{regForm.parentName}</strong>! We have received your Zelle payment
                confirmation for <strong>{regForm.childName}</strong>. Our team will verify your payment and send you enrollment details
                shortly.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-3 rounded-xl bg-[#05264d] text-white font-bold text-sm hover:bg-[#05264d]/90 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
