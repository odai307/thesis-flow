import { Link } from 'react-router-dom';

function Icon({ name, className = 'text-outline' }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: "'FILL' 0" }}
    >
      {name}
    </span>
  );
}

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center font-body-base text-on-surface antialiased">
      <main className="w-full max-w-md px-margin-mobile md:px-0">
        {/* Brand header */}
        <div className="text-center mb-section-gap">
          <h1 className="font-headline-md text-headline-md text-primary tracking-tight">ThesisFlow</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Academic Portal</p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-ambient p-8 hover:border-outline transition-colors duration-200">
          <div className="mb-8 text-center">
            <Icon name="lock_reset" className="text-primary text-[48px] mb-4" />
            <h2 className="font-section-header text-section-header text-on-surface">Reset your password</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
              Please enter your new password below.
            </p>
          </div>

          <form className="space-y-stack-gap">
            <div className="space-y-1">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="new-password">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="lock" />
                </div>
                <input
                  id="new-password"
                  name="new-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface font-body-base text-body-base placeholder-outline focus:outline-none focus:border-primary focus:ring-0 focus:shadow-[0_0_0_3px_rgba(53,56,205,0.2)] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="lock_clock" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface font-body-base text-body-base placeholder-outline focus:outline-none focus:border-primary focus:ring-0 focus:shadow-[0_0_0_3px_rgba(53,56,205,0.2)] transition-all"
                />
              </div>
              <p className="font-label-xs text-label-xs text-on-surface-variant mt-1">
                Must be at least 8 characters long.
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded shadow-sm font-label-md text-label-md text-on-primary bg-primary-container hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Update password
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="font-body-sm text-body-sm text-primary-container hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <Icon name="arrow_back" className="text-[16px]" />
              Back to login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
