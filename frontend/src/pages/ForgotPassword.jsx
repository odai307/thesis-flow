import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="h-full bg-surface text-on-surface antialiased flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <h2 className="mt-6 text-center text-display-lg font-display-lg tracking-tight text-on-surface">
          ThesisFlow
        </h2>
        <p className="mt-2 text-center text-body-base font-body-base text-on-surface-variant">
          Academic Portal
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container-lowest py-8 px-4 shadow-ambient sm:rounded-lg sm:px-10 border border-outline-variant">
          {!sent ? (
            <div>
              <div className="mb-6">
                <h3 className="text-headline-md font-headline-md text-on-surface">Reset Password</h3>
                <p className="mt-1 text-body-sm font-body-sm text-on-surface-variant">
                  Enter your university email address and we&apos;ll send you a link to reset your
                  password.
                </p>
              </div>
              <form className="space-y-6" method="POST" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface" htmlFor="email">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      autoComplete="email"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="netid@university.edu"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded border border-outline-variant py-2.5 px-3 text-on-surface shadow-sm focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container focus:shadow-[0_0_0_3px_rgba(53,56,205,0.2)] bg-surface-container-lowest text-body-base font-body-base transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded bg-primary-container py-2.5 px-3 text-label-md font-label-md text-on-primary shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-200"
                  >
                    Send reset link
                  </button>
                </div>
              </form>
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-label-md font-label-md text-primary hover:text-primary-container transition-colors duration-200 group"
                >
                  <span className="material-symbols-outlined text-[18px] mr-1 group-hover:-translate-x-1 transition-transform">
                    arrow_back
                  </span>
                  Back to log in
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-fixed mb-4">
                <span className="material-symbols-outlined text-on-primary-fixed">mark_email_read</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Check your inbox</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-6">
                We&apos;ve sent a password reset link to{' '}
                <span className="font-medium text-on-surface">{email || 'your email'}</span>. It may
                take a few minutes to arrive.
              </p>
              <div className="rounded bg-surface-container-low p-4 text-left border border-outline-variant mb-6">
                <p className="text-label-xs font-label-xs text-on-surface-variant uppercase tracking-wider mb-2">
                  Didn&apos;t receive the email?
                </p>
                <ul className="text-body-sm font-body-sm text-on-surface-variant space-y-1 list-disc list-inside">
                  <li>Check your spam folder</li>
                  <li>Verify you used your university email</li>
                  <li>
                    <button
                      type="button"
                      className="text-primary hover:text-primary-container underline transition-colors"
                    >
                      Click here to resend
                    </button>
                  </li>
                </ul>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center text-label-md font-label-md text-primary hover:text-primary-container transition-colors duration-200 group"
              >
                <span className="material-symbols-outlined text-[18px] mr-1 group-hover:-translate-x-1 transition-transform">
                  arrow_back
                </span>
                Back to log in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
