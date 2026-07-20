import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

function Icon({ name, className = 'text-[20px]' }) {
  return <span className={`material-symbols-outlined text-outline ${className}`}>{name}</span>;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    departmentId: '',
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load the real department list from the backend so we send valid UUIDs.
  useEffect(() => {
    api
      .getDepartments()
      .then((data) => setDepartments(data.departments))
      .catch(() => setDepartments([]));
  }, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      // Students self-register, then log in (backend returns no token).
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center p-gutter font-body-base antialiased">
      <main className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-8 md:p-10">
        {/* Logo header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-primary-container rounded-lg flex items-center justify-center mb-4 text-on-primary shadow-sm border border-[#EAECF0]">
            <span className="material-symbols-outlined text-[28px]">description</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-1 text-center">
            Create your account
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
            Join ThesisFlow as a Student Researcher
          </p>
        </div>

        <form className="space-y-stack-gap" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-gap">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="first_name">
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-base text-body-base text-on-surface placeholder:text-outline focus:border-primary-container focus:ring-2 focus:ring-primary-fixed focus:outline-none transition-all duration-200"
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="last_name">
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-base text-body-base text-on-surface placeholder:text-outline focus:border-primary-container focus:ring-2 focus:ring-primary-fixed focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="email">
              University Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="mail" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="student@university.edu"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-3 py-2 font-body-base text-body-base text-on-surface placeholder:text-outline focus:border-primary-container focus:ring-2 focus:ring-primary-fixed focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="lock" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-3 py-2 font-body-base text-body-base text-on-surface placeholder:text-outline focus:border-primary-container focus:ring-2 focus:ring-primary-fixed focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="department">
              Academic Department
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="school" />
              </div>
              <select
                id="department"
                name="department"
                required
                value={form.departmentId}
                onChange={(e) => update('departmentId', e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-10 py-2 font-body-base text-body-base text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary-fixed focus:outline-none transition-all duration-200 appearance-none"
              >
                <option disabled value="">
                  Select your department...
                </option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Icon name="expand_more" />
              </div>
            </div>
          </div>

          {error && (
            <p className="font-body-sm text-body-sm text-error bg-error-container border border-error/20 rounded px-3 py-2">
              {error}
            </p>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg shadow-sm transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-60"
            >
              <span>{submitting ? 'Creating account…' : 'Create Account'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-outline-variant pt-6">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-primary-container font-medium transition-colors hover:underline underline-offset-4 ml-1"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
