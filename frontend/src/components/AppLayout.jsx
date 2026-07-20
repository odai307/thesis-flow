import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuth } from '../context/AuthContext';

export default function AppLayout({ role, children }) {
  const { user } = useAuth();
  const activeRole = role ?? user?.role ?? 'student';
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="text-on-surface font-body-base h-screen flex overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar role={activeRole} />
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar role={activeRole} onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar onMenuClick={() => setDrawerOpen(true)} user={user} />
        <main className="flex-1 overflow-y-auto w-full">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-section-gap flex flex-col gap-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
