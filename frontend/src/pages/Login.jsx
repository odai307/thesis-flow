import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MaterialIcon({ name, className = 'text-3xl' }) {
  return <span className={`material-symbols-outlined text-primary ${className}`}>{name}</span>;
}

// Where to send a user after login, based on their role.
function homeForRole(role) {
  if (role === 'supervisor') return '/supervisor';
  if (role === 'coordinator') return '/coordinator';
  return '/dashboard';
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(homeForRole(user.role));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-background min-h-screen flex items-center justify-center font-body-base text-on-surface antialiased p-margin-mobile md:p-gutter">
      <div className="w-full max-w-md">
        {/* Logo header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MaterialIcon name="menu_book" />
            <h1 className="font-headline-md text-headline-md text-primary">ThesisFlow</h1>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Sign in to your academic portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="block w-full rounded border border-outline-variant px-3 py-2 bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_0_3px_rgba(53,56,205,0.1)] transition-all sm:text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded border border-outline-variant px-3 py-2 bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_0_3px_rgba(53,56,205,0.1)] transition-all sm:text-sm"
              />
            </div>

            {error && (
              <p className="font-body-sm text-body-sm text-error bg-error-container border border-error/20 rounded px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block font-body-sm text-body-sm text-on-surface-variant cursor-pointer"
              >
                Remember me for 30 days
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded bg-primary-container font-label-md text-label-md text-on-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-opacity shadow-sm disabled:opacity-60"
              >
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center font-body-sm text-body-sm text-on-surface-variant">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
