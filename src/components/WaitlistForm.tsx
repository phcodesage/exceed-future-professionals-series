import { FormEvent, useState } from 'react';

const programOptions = [
  'Future Dentist',
  'Young Artist',
  'Young Chef',
  'Future Scientist',
  'Future Vet',
  'Future Pharmacist',
  'Future Lawyer',
  'Young Designer',
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

    const rawBaseUrl = import.meta.env.VITE_API_URL;
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
        <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl text-center text-base sm:text-lg">
          Thank you! You&apos;re on the list. We&apos;ll reach out with program updates soon.
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-[#ca3433] focus:border-[#ca3433]"
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
                    className="h-5 w-5 rounded border-gray-300 text-[#ca3433] focus:ring-[#ca3433]"
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
    </div>
  );
}
