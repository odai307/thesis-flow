import { Link } from 'react-router-dom';

function Icon({ name, filled = false, className = '' }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}` }}
    >
      {name}
    </span>
  );
}

export default function NotFound() {
  return (
    <div className="h-full bg-background text-on-background flex flex-col antialiased">
      <header className="w-full flex justify-between items-center h-16 px-gutter sticky top-0 z-50 bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Icon name="book_4" filled className="text-primary text-2xl" />
          <span className="font-headline-md text-headline-md font-bold text-primary">ThesisFlow</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-gutter">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-primary-container opacity-10 rounded-full blur-2xl transform scale-150" />
            <div className="relative w-32 h-32 bg-surface-container-highest rounded-full flex items-center justify-center shadow-ambient border border-outline-variant z-10">
              <Icon name="find_in_page" className="text-6xl text-outline-variant" />
              <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-error-container rounded-full flex items-center justify-center border-2 border-surface">
                <Icon name="error" filled className="text-error text-2xl" />
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <h1 className="font-display-lg text-display-lg text-on-background">Page Not Found</h1>
            <p className="font-body-base text-body-base text-on-surface-variant max-w-sm mx-auto">
              The manuscript or resource you are looking for seems to have been misplaced in the
              archives. It might have been moved or deleted.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:bg-surface-tint transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Icon name="arrow_back" className="text-[20px]" />
              Back to Dashboard
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface text-secondary border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Previous Page
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
