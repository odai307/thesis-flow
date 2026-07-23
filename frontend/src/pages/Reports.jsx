import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { api } from '../lib/api';

function Icon({ name, className = 'text-[20px]' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function Reports() {
  const [theses, setTheses] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [thesesRes, supervisorsRes] = await Promise.all([
          api.getTheses().catch(() => ({ theses: [] })),
          api.getSupervisors().catch(() => ({ supervisors: [] })),
        ]);
        if (!active) return;
        setTheses(thesesRes.theses || []);
        setSupervisors(supervisorsRes.supervisors || []);
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Compute status metrics
  const totalCount = theses.length;
  const submittedCount = theses.filter((t) => t.status === 'submitted').length;
  const reviewCount = theses.filter((t) => t.status === 'under_review').length;
  const revisionsCount = theses.filter((t) => t.status === 'revisions_requested').length;
  const approvedCount = theses.filter((t) => t.status === 'approved').length;

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface font-bold">Analytics & Reports</h2>
          <p className="font-body-base text-body-base text-secondary mt-1">
            Department-wide thesis progress and supervisor workload analytics.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="font-body-base text-body-base text-secondary animate-pulse">Loading analytical reports…</p>
        </div>
      ) : error ? (
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded-lg px-4 py-3">
          {error}
        </p>
      ) : (
        <div className="space-y-8">
          {/* Status Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
              <span className="font-label-md text-label-md text-secondary block mb-1">Submitted</span>
              <span className="font-display-lg text-display-lg text-primary font-bold">{submittedCount}</span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
              <span className="font-label-md text-label-md text-secondary block mb-1">Under Review</span>
              <span className="font-display-lg text-display-lg text-tertiary font-bold">{reviewCount}</span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
              <span className="font-label-md text-label-md text-secondary block mb-1">Revisions Requested</span>
              <span className="font-display-lg text-display-lg text-amber-600 font-bold">{revisionsCount}</span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
              <span className="font-label-md text-label-md text-secondary block mb-1">Approved Archive</span>
              <span className="font-display-lg text-display-lg text-[#059669] font-bold">{approvedCount}</span>
            </div>
          </div>

          {/* Supervisor Workload Table */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
              <h3 className="font-section-header text-section-header text-on-surface flex items-center gap-2">
                <Icon name="groups" className="text-primary" />
                Department Supervisor Roster ({supervisors.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant font-label-xs text-label-xs text-secondary uppercase tracking-wider">
                    <th className="py-3.5 px-6 font-semibold">Supervisor Name</th>
                    <th className="py-3.5 px-6 font-semibold">Email</th>
                    <th className="py-3.5 px-6 font-semibold">Assigned Theses</th>
                    <th className="py-3.5 px-6 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-outline-variant/40">
                  {supervisors.map((s) => {
                    const supervisorName = `${s.firstName} ${s.lastName}`;
                    const assignedTheses = theses.filter((t) => t.supervisorId === s.id);
                    return (
                      <tr key={s.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-xs font-bold">
                            {(s.firstName?.[0] ?? '') + (s.lastName?.[0] ?? '')}
                          </div>
                          <span className="font-semibold text-on-surface">{supervisorName}</span>
                        </td>
                        <td className="py-4 px-6 text-secondary">{s.email}</td>
                        <td className="py-4 px-6 font-bold text-primary">
                          {assignedTheses.length} Assigned Thesis
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="px-2.5 py-1 rounded-full font-label-xs text-label-xs bg-[#D1FAE5] text-[#059669] border border-[#059669]/20 font-bold">
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {supervisors.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-secondary">
                        No supervisors registered in this department yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
