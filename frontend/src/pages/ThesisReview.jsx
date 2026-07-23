import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatusTimeline from '../components/StatusTimeline';
import { api } from '../lib/api';

function Icon({ name, className = 'text-[20px]' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
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
  submitted: 'Submitted',
  under_review: 'Under Review',
  revisions_requested: 'Revisions Requested',
  approved: 'Approved',
};

// Modal dialog for confirming supervisor actions
function ConfirmModal({ isOpen, title, description, confirmText, confirmClass, onConfirm, onClose, busy }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
            <Icon name="help_outline" className="text-[24px]" />
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">{title}</h3>
        </div>
        <p className="font-body-base text-body-base text-secondary mb-6 leading-relaxed">
          {description}
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`px-5 py-2.5 rounded-lg text-white font-label-md text-label-md transition-colors disabled:opacity-50 shadow-sm ${confirmClass}`}
          >
            {busy ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ThesisReview() {
  const { id } = useParams();
  const [thesis, setThesis] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [busy, setBusy] = useState(false);

  // Modal State
  const [activeModal, setActiveModal] = useState(null); // 'start' | 'approve' | 'revisions' | null

  const currentSubmission = thesis?.currentSubmission;

  async function loadData() {
    try {
      const data = await api.getThesis(id);
      setThesis(data.thesis);
      if (data.thesis.currentSubmission) {
        const c = await api.getComments(data.thesis.currentSubmission.id);
        setComments(c.comments);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  async function handleStartReview() {
    setBusy(true);
    setError('');
    try {
      await api.startReview(id);
      setActiveModal(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleApprove() {
    setBusy(true);
    setError('');
    try {
      await api.approve(id);
      setActiveModal(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRequestRevisions() {
    setBusy(true);
    setError('');
    try {
      await api.requestRevisions(id);
      setActiveModal(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handlePost(e) {
    e.preventDefault();
    if (!draft.trim() || !currentSubmission) return;
    setPosting(true);
    try {
      const { comment } = await api.postComment(currentSubmission.id, draft.trim());
      setComments((prev) => [...prev, comment]);
      setDraft('');
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  if (loading) {
    return (
      <AppLayout role="supervisor">
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="font-body-base text-body-base text-secondary animate-pulse">Loading review page…</p>
        </div>
      </AppLayout>
    );
  }

  if (error && !thesis) {
    return (
      <AppLayout role="supervisor">
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded-lg px-4 py-3">
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
  const fileUrl = currentSubmission?.fileUrl;

  return (
    <AppLayout role="supervisor">
      {/* Action Modals */}
      <ConfirmModal
        isOpen={activeModal === 'start'}
        title="Start Thesis Review"
        description="Begin reviewing this thesis submission. The thesis status will change to 'Under Review', enabling revision requests or final approval."
        confirmText="Start Review"
        confirmClass="bg-primary hover:bg-primary-container"
        onConfirm={handleStartReview}
        onClose={() => setActiveModal(null)}
        busy={busy}
      />

      <ConfirmModal
        isOpen={activeModal === 'revisions'}
        title="Request Thesis Revisions"
        description="Request changes from the student. The status will change to 'Revisions Requested', allowing the student to upload an updated version."
        confirmText="Request Revisions"
        confirmClass="bg-tertiary-container text-on-tertiary-container hover:bg-tertiary"
        onConfirm={handleRequestRevisions}
        onClose={() => setActiveModal(null)}
        busy={busy}
      />

      <ConfirmModal
        isOpen={activeModal === 'approve'}
        title="Approve Thesis Submission"
        description="Approve this thesis submission. This marks the thesis as Approved and forwards it to the Department Coordinator's dashboard."
        confirmText="Approve Thesis"
        confirmClass="bg-[#059669] hover:bg-[#047857]"
        onConfirm={handleApprove}
        onClose={() => setActiveModal(null)}
        busy={busy}
      />

      {/* Top Header & Verdict Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm mb-6">
        <div>
          <div className="flex items-center gap-2 text-label-md font-label-md text-secondary mb-1">
            <Link to="/supervisor" className="hover:text-primary transition-colors">
              Supervisor Dashboard
            </Link>
            <Icon name="chevron_right" className="text-sm" />
            <span className="text-on-surface">Review Thesis</span>
          </div>
          <h2 className="font-display-lg text-display-lg text-on-surface font-bold">
            {thesis.title}
          </h2>
          <p className="font-body-base text-body-base text-secondary mt-1">
            Student: <strong className="text-on-surface">{studentName}</strong> • Version {version} • Status:{' '}
            <strong className="capitalize text-primary">{thesis.status.replace('_', ' ')}</strong>
          </p>
        </div>

        {/* Action Buttons for Supervisor Verdict */}
        <div className="flex flex-wrap items-center gap-3">
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2 shadow-sm"
            >
              <Icon name="download" />
              Download PDF
            </a>
          )}

          {/* STEP 1: Student submitted -> Supervisor can ONLY click 'Start Review' */}
          {thesis.status === 'submitted' && (
            <button
              onClick={() => setActiveModal('start')}
              disabled={busy}
              className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors disabled:opacity-50 shadow-sm cursor-pointer flex items-center gap-2"
            >
              <Icon name="rate_review" />
              Start Review
            </button>
          )}

          {/* STEP 2: Under Review -> Supervisor CAN click 'Request Revisions' OR 'Approve Thesis' */}
          {thesis.status === 'under_review' && (
            <>
              <button
                onClick={() => setActiveModal('revisions')}
                disabled={busy}
                className="px-5 py-2.5 bg-tertiary-container text-on-tertiary-container rounded-lg font-label-md text-label-md hover:bg-tertiary transition-colors disabled:opacity-50 shadow-sm cursor-pointer flex items-center gap-2"
              >
                <Icon name="edit_note" />
                Request Revisions
              </button>
              <button
                onClick={() => setActiveModal('approve')}
                disabled={busy}
                className="px-5 py-2.5 bg-[#059669] text-white rounded-lg font-label-md text-label-md hover:bg-[#047857] transition-colors disabled:opacity-50 shadow-sm cursor-pointer flex items-center gap-2"
              >
                <Icon name="check_circle" />
                Approve Thesis
              </button>
            </>
          )}

          {/* Approved state */}
          {thesis.status === 'approved' && (
            <span className="px-4 py-2 bg-[#D1FAE5] text-[#059669] rounded-lg font-label-md text-label-md font-bold flex items-center gap-2 border border-[#059669]/20">
              <Icon name="verified" />
              Thesis Approved
            </span>
          )}

          {/* Revisions requested state */}
          {thesis.status === 'revisions_requested' && (
            <span className="px-4 py-2 bg-tertiary-container text-on-tertiary-container rounded-lg font-label-md text-label-md font-medium flex items-center gap-2">
              <Icon name="pending" />
              Awaiting Student Re-submission
            </span>
          )}
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[700px]">
        {/* Left: Document Viewer */}
        <div className="flex-1 flex flex-col bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="h-12 border-b border-outline-variant flex items-center justify-between px-5 bg-surface-bright flex-shrink-0">
            <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-2">
              <Icon name="description" className="text-primary" />
              Document Viewer (v{version})
            </span>
            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary font-label-xs text-label-xs hover:underline flex items-center gap-1"
              >
                Open in Full Window <Icon name="open_in_new" className="text-[14px]" />
              </a>
            )}
          </div>

          <div className="flex-1 bg-[#F3F4F6] min-h-[650px] flex items-center justify-center relative p-2">
            {fileUrl ? (
              <iframe
                src={fileUrl}
                title="Thesis Document Review"
                className="w-full h-full min-h-[650px] border-0 rounded"
              />
            ) : (
              <div className="text-center p-8 border-2 border-dashed border-outline-variant rounded-xl max-w-md bg-white">
                <Icon name="find_in_page" className="text-[40px] text-outline mb-2" />
                <h3 className="font-headline-md text-headline-md text-on-surface mb-1">No Document Available</h3>
                <p className="font-body-sm text-body-sm text-secondary">
                  The student has not uploaded a file for this submission yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Feedback & Discussion Panel */}
        <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-outline-variant bg-surface-bright">
            <h3 className="font-section-header text-section-header text-on-surface mb-3">
              Review Progress Timeline
            </h3>
            <StatusTimeline current={thesis.status} />
          </div>

          <div className="flex-grow overflow-y-auto p-5 flex flex-col gap-4 min-h-[350px]">
            <h4 className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-2">
              <Icon name="forum" className="text-primary text-[18px]" />
              Feedback & Comments ({comments.length})
            </h4>
            {comments.length === 0 && (
              <div className="text-center my-auto py-6">
                <p className="font-body-sm text-body-sm text-secondary">
                  No comments yet. Leave revision feedback or notes for the student below.
                </p>
              </div>
            )}
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-xs shrink-0 font-bold">
                  {(c.author?.firstName?.[0] ?? '?') + (c.author?.lastName?.[0] ?? '')}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      {c.author ? `${c.author.firstName} ${c.author.lastName}` : 'Unknown'}
                    </span>
                    <span className="font-label-xs text-label-xs text-secondary">
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 text-on-surface font-body-sm text-body-sm border border-outline-variant/60">
                    {c.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Supervisor Feedback Input */}
          <form onSubmit={handlePost} className="p-4 border-t border-outline-variant bg-surface-container-lowest">
            <div className="flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type revision notes or feedback..."
                disabled={!currentSubmission || posting}
                className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2 text-on-surface focus:outline-none focus:border-primary text-body-sm disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!draft.trim() || !currentSubmission || posting}
                className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
              >
                {posting ? '...' : <Icon name="send" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
