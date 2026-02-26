import { FormEvent, useState } from 'react';

const programOptions = [
  'Future Doctor',
  'Future Dentist',
];

interface FormState {
  parentName: string;
  childName: string;
  email: string;
  phone: string;
  gradeLevel: string;
  programInterests: string[];
  interests: string;
}

export default function WaitlistForm() {
  const [form, setForm] = useState<FormState>({
    parentName: '',
    childName: '',
    email: '',
    phone: '',
    gradeLevel: '',
    programInterests: [],
    interests: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: FormState) => ({ ...prev, [name]: value }));
  };

  const handleProgramInterestChange = (e: any) => {
    const { value, checked } = e.target as HTMLInputElement;
    setForm((prev: FormState) => {
      if (checked) {
        if (prev.programInterests.includes(value)) {
          return prev;
        }
        return { ...prev, programInterests: [...prev.programInterests, value] };
      }

      return {
        ...prev,
        programInterests: prev.programInterests.filter((v) => v !== value),
      };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      parentName: form.parentName,
      childName: form.childName,
      email: form.email,
      phone: form.phone,
      gradeLevel: form.gradeLevel,
      programInterests: form.programInterests,
      interests: form.interests,
    };

    const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const baseUrl = rawBaseUrl.replace(/\/+$/, '');

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting waitlist form', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10 sm:p-12">
      <h2 className="text-4xl font-bold text-[#0e1f3e] mb-3 text-center">Join the Interest List</h2>
      <p className="text-gray-700 mb-2 text-center text-base sm:text-lg">
        Exceed&apos;s Future Professionals Series is <span className="font-semibold">coming soon</span>.
      </p>
      <p className="text-gray-700 mb-7 text-center text-sm sm:text-base">
        No payment needed yet this is just a waitlist so we can keep you posted.
      </p>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl text-center">
          <p className="text-base sm:text-lg font-semibold mb-4">
            Thank you! You&apos;re on the list. We&apos;ll reach out with program updates soon.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#ca3433] text-white text-base font-semibold shadow-md hover:bg-[#b1302f] transition-colors"
            >
              Register Now
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  parentName: '',
                  childName: '',
                  email: '',
                  phone: '',
                  gradeLevel: '',
                  programInterests: [],
                  interests: '',
                });
              }}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white border-2 border-gray-300 text-gray-700 text-base font-semibold hover:bg-gray-50 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-7">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm sm:text-base">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-semibold text-[#0e1f3e] mb-2" htmlFor="parentName">
                Parent / Guardian Name
              </label>
              <input
                id="parentName"
                name="parentName"
                type="text"
                required
                value={form.parentName}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#ca3433] focus:border-[#ca3433]"
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-[#0e1f3e] mb-2" htmlFor="childName">
                Child&apos;s Name
              </label>
              <input
                id="childName"
                name="childName"
                type="text"
                required
                value={form.childName}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#ca3433] focus:border-[#ca3433]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-semibold text-[#0e1f3e] mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#ca3433] focus:border-[#ca3433]"
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-[#0e1f3e] mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#ca3433] focus:border-[#ca3433]"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-[#0e1f3e] mb-2" htmlFor="gradeLevel">
              Child&apos;s Grade Level
            </label>
            <select
              id="gradeLevel"
              name="gradeLevel"
              required
              value={form.gradeLevel}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-[#ca3433] focus:border-[#ca3433] accent-[#ca3433]"
            >
              <option value="">Select grade</option>
              <option value="K">Kindergarten</option>
              <option value="1-2">Grades 1-2</option>
              <option value="3-4">Grades 3-4</option>
              <option value="5-6">Grades 5-6</option>
            </select>
          </div>

          <div>
            <p className="block text-base font-semibold text-[#0e1f3e] mb-3">
              Which careers is your child most interested in? (Choose all that apply)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {programOptions.map((option) => (
                <label key={option} className="inline-flex items-center gap-3 text-sm sm:text-base text-[#0e1f3e]">
                  <input
                    type="checkbox"
                    value={option}
                    checked={form.programInterests.includes(option)}
                    onChange={handleProgramInterestChange}
                    className="h-5 w-5 rounded border-gray-300 text-[#ca3433] focus:ring-[#ca3433] accent-[#ca3433]"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-[#0e1f3e] mb-2" htmlFor="interests">
              Anything else we should know? (optional)
            </label>
            <textarea
              id="interests"
              name="interests"
              rows={4}
              value={form.interests}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#ca3433] focus:border-[#ca3433]"
              placeholder="e.g., scheduling needs, additional interests, questions"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex justify-center px-10 py-3.5 rounded-full bg-[#ca3433] text-white text-base sm:text-lg font-semibold shadow-md hover:bg-[#b1302f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Join Waitlist'}
          </button>
        </form>
      )}

      {/* Payment Options Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}>
          <div
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-[#0e1f3e] mb-4 text-center">Choose Your Registration</h3>
              <p className="text-gray-600 mb-6 text-center">Select the option that works best for you:</p>

              <div className="space-y-4">
                <a
                  href="https://buy.stripe.com/5kQ28k9Kk9se9S92SfdfG01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-4 rounded-xl bg-[#ca3433] text-white text-center font-semibold shadow-md hover:bg-[#b1302f] transition-colors"
                >
                  <div className="text-lg mb-1">Semester 1 Only</div>
                  <div className="text-sm opacity-90">Single semester registration</div>
                </a>

                <a
                  href="https://buy.stripe.com/14A14g8Gg47Uc0hgJ5dfG07"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-4 rounded-xl bg-[#0e1f3e] text-white text-center font-semibold shadow-md hover:bg-[#1f2a4d] transition-colors"
                >
                  <div className="text-lg mb-1">2 Semesters</div>
                  <div className="text-sm opacity-90">Full year registration</div>
                </a>
              </div>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="mt-6 w-full px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
