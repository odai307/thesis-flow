import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatusTimeline from '../components/StatusTimeline';
import { api } from '../lib/api';

function Icon({ name, filled = false, className = 'text-[20px]' }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}` }}
    >
      {name}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const STATUS_TO_LABEL = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  revisions_requested: 'Revisions Requested',
  approved: 'Approved',
};

export default function ThesisReview() {
  const { id } = useParams();
  const [thesis, setThesis] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);

  const currentSubmission = thesis?.currentSubmission;

  async function refresh() {
    const data = await api.getThesis(id);
    setThesis(data.thesis);
    if (data.thesis.currentSubmission) {
      const c = await api.getComments(data.thesis.currentSubmission.id);
      setComments(c.comments);
    }
  }

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api.getThesis(id);
        if (!active) return;
        setThesis(data.thesis);
        if (data.thesis.currentSubmission) {
          const c = await api.getComments(data.thesis.currentSubmission.id);
          if (active) setComments(c.comments);
        }
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  async function handleComment(e) {
    e.preventDefault();
    const content = draft.trim();
    if (!content || !currentSubmission) return;
    setBusy(true);
    try {
      const { comment } = await api.postComment(currentSubmission.id, content);
      setComments((prev) => [...prev, comment]);
      setDraft('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleVerdict(action) {
    setBusy(true);
    setError('');
    try {
      await action(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <AppLayout role="supervisor">
        <p className="font-body-base text-body-base text-secondary">Loading review…</p>
      </AppLayout>
    );
  }
  if (error && !thesis) {
    return (
      <AppLayout role="supervisor">
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      </AppLayout>
    );
  }
  if (!thesis) return null;

  const studentName = thesis.student
    ? `${thesis.student.firstName} ${thesis.student.lastName}`
    : 'Unknown student';
  const version = currentSubmission?.versionNumber ?? thesis._count?.submissions ?? 1;

  return (
    <AppLayout role="supervisor">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface m-0">Thesis Review</h2>
          <p className="font-body-base text-body-base text-on-surface-variant mt-1">
            {studentName} &mdash; {thesis.title}
          </p>
        </div>
        <button className="px-4 py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary transition-colors flex items-center gap-2">
          <Icon name="download" className="text-[18px]" />
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter flex-grow min-h-[600px]">
        {/* Document viewer */}
        <section className="lg:col-span-8 flex flex-col h-full bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-outline-variant bg-surface-bright flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-section-header text-section-header text-on-surface">
                  {studentName}
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-xs text-label-xs">
                  {STATUS_TO_LABEL[thesis.status] ?? thesis.status}
                </span>
              </div>
              <h3 className="font-body-base text-body-base text-secondary">
                {thesis.title} &mdash; v{version}
              </h3>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-[#F0F2F5] p-8 flex justify-center">
            <div className="bg-white w-full max-w-[800px] min-h-[1056px] shadow-sm border border-outline-variant rounded p-12">
              <div className="mb-12 border-b border-outline-variant pb-8 text-center">
                <h1 className="font-display-lg text-display-lg text-on-surface mb-4">
                  {thesis.title}
                </h1>
                <p className="font-body-base text-body-base text-secondary">
                  Version {version} • Submitted {formatDate(currentSubmission?.submittedAt)}
                </p>
              </div>
              <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-4 bg-surface-variant rounded w-full" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feedback panel */}
        <section className="lg:col-span-4 flex flex-col h-full bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-outline-variant bg-surface">
            <h3 className="font-section-header text-section-header text-on-surface mb-4">
              Review Progress
            </h3>
            <StatusTimeline current={thesis.status} />
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 bg-surface-bright">
            {comments.length === 0 && (
              <p className="font-body-sm text-body-sm text-secondary text-center mt-8">
                No feedback yet. Add the first comment below.
              </p>
            )}
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-xs shrink-0">
                  {(c.author?.firstName?.[0] ?? '?') + (c.author?.lastName?.[0] ?? '')}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-label-md text-label-md text-on-surface">
                      {c.author ? `${c.author.firstName} ${c.author.lastName}` : 'Unknown'}
                    </span>
                    <span className="font-label-xs text-[11px] text-secondary">
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg rounded-tl-none p-3 text-on-surface-variant font-body-sm text-body-sm border border-outline-variant/50">
                    {c.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-outline-variant bg-surface">
            <div className="relative">
              <textarea
                className="w-full rounded-lg border border-outline-variant text-body-sm font-body-sm bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary resize-none p-3 pr-10 shadow-sm"
                placeholder="Add a comment or highlight text to attach..."
                rows="2"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button
                onClick={handleComment}
                disabled={busy || !draft.trim()}
                className="absolute bottom-3 right-3 text-primary hover:text-primary-fixed-variant transition-colors flex items-center justify-center disabled:opacity-60"
              >
                <Icon name="send" filled />
              </button>
            </div>
          </div>

          {/* Verdict */}
          <div className="p-5 border-t border-outline-variant bg-surface-container-low flex flex-col gap-3">
            {error && (
              <p className="font-body-sm text-body-sm text-error bg-error-container border border-error/20 rounded px-2 py-1">
                {error}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => handleVerdict(api.requestRevisions)}
                disabled={busy}
                className="flex-1 bg-surface-container-lowest border border-error text-error hover:bg-error-container/20 font-label-md text-label-md py-2.5 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-60"
              >
                <Icon name="assignment_return" className="text-[18px]" />
                Request Revisions
              </button>
              <button
                onClick={() => handleVerdict(api.approve)}
                disabled={busy}
                className="flex-1 bg-primary text-on-primary hover:bg-primary/90 font-label-md text-label-md py-2.5 px-4 rounded-lg transition-colors shadow-sm flex justify-center items-center gap-2 disabled:opacity-60"
              >
                <Icon name="check_circle" filled className="text-[18px]" />
                Approve
              </button>
            </div>
            <div className="text-center mt-2">
              <button
                onClick={() => handleVerdict(api.startReview)}
                disabled={busy || thesis.status !== 'submitted'}
                className="font-label-xs text-label-xs text-secondary hover:text-primary transition-colors flex items-center justify-center gap-1 inline-flex disabled:opacity-50"
              >
                <Icon name="play_circle" className="text-[14px]" />
                Start Review
              </button>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
