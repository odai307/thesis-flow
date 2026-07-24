import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatusBadge from '../components/StatusBadge';
import StatusTimeline from '../components/StatusTimeline';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { getSocket, joinThesisRoom, leaveThesisRoom, joinSubmissionRoom, leaveSubmissionRoom } from '../lib/socket';

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

function getEmbedUrl(fileUrl) {
  if (!fileUrl) return '';
  const lower = fileUrl.toLowerCase();
  const isCloudinaryRaw = lower.includes('/raw/upload/');
  const isDocx = lower.endsWith('.docx') || lower.includes('format=docx');
  if (isCloudinaryRaw || isDocx) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
  }
  return fileUrl;
}

// Modal dialog for status actions
function Modal({ isOpen, title, description, confirmText, confirmClass, onConfirm, onClose, children, busy }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 className="font-headline-md text-headline-md text-on-surface font-bold mb-2">{title}</h3>
        {description && (
          <p className="font-body-base text-body-base text-secondary mb-4">{description}</p>
        )}
        {children}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`px-4 py-2 rounded-lg text-white font-label-md text-label-md transition-colors disabled:opacity-50 shadow-sm ${confirmClass}`}
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
  const [searchParams] = useSearchParams();
  const requestedSubmissionId = searchParams.get('submissionId');
  const { user } = useAuth();

  const [thesis, setThesis] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);

  // Modals for actions
  const [activeModal, setActiveModal] = useState(null); // 'review' | 'approve' | 'revisions' | 'reopen'
  const [revisionNotes, setRevisionNotes] = useState('');
  const [actionBusy, setActionBusy] = useState(false);

  const isCoordinator = user?.role === 'coordinator';

  const submissions = thesis?.submissions ?? [];
  const activeSubmission =
    submissions.find((s) => s.id === requestedSubmissionId) ??
    thesis?.currentSubmission ??
    submissions[0];

  async function loadData() {
    try {
      const data = await api.getThesis(id);
      setThesis(data.thesis);

      const targetSub =
        data.thesis.submissions?.find((s) => s.id === requestedSubmissionId) ??
        data.thesis.currentSubmission ??
        data.thesis.submissions?.[0];

      if (targetSub) {
        const c = await api.getComments(targetSub.id);
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
  }, [id, requestedSubmissionId]);

  // Real-time socket events & interval polling
  useEffect(() => {
    if (!id) return;
    joinThesisRoom(id);

    const socket = getSocket();

    const handleStatusChanged = () => {
      loadData();
    };

    socket.on('thesis:statusChanged', handleStatusChanged);
    socket.on('thesis:paperUploaded', handleStatusChanged);

    const interval = setInterval(loadData, 4000);

    return () => {
      leaveThesisRoom(id);
      socket.off('thesis:statusChanged', handleStatusChanged);
      socket.off('thesis:paperUploaded', handleStatusChanged);
      clearInterval(interval);
    };
  }, [id]);

  // Submission room socket listener for comments
  useEffect(() => {
    if (!activeSubmission?.id) return;
    joinSubmissionRoom(activeSubmission.id);

    const socket = getSocket();

    const handleNewComment = (newComment) => {
      if (newComment && newComment.submissionId === activeSubmission.id) {
        setComments((prev) => {
          if (prev.some((c) => c.id === newComment.id)) return prev;
          return [...prev, newComment];
        });
      }
    };

    socket.on('comment:created', handleNewComment);

    return () => {
      leaveSubmissionRoom(activeSubmission.id);
      socket.off('comment:created', handleNewComment);
    };
  }, [activeSubmission?.id]);

  async function handleStatusAction(newStatus, extraBody = {}) {
    setActionBusy(true);
    setError('');
    try {
      await api.updateThesisStatus(id, newStatus, extraBody);
      setActiveModal(null);
      setRevisionNotes('');
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionBusy(false);
    }
  }

  async function handlePost(e) {
    e.preventDefault();
    if (!draft.trim() || !activeSubmission) return;
    setPosting(true);
    try {
      const { comment } = await api.postComment(activeSubmission.id, draft.trim());
      setComments((prev) => {
        if (prev.some((c) => c.id === comment.id)) return prev;
        return [...prev, comment];
      });
      setDraft('');
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  if (loading) {
    return (
      <AppLayout role={user?.role}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="font-body-base text-body-base text-secondary animate-pulse">
            Loading review workspace…
          </p>
        </div>
      </AppLayout>
    );
  }

  if (error && !thesis) {
    return (
      <AppLayout role={user?.role}>
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded-lg px-4 py-3">
          {error}
        </p>
      </AppLayout>
    );
  }

  if (!thesis) return null;

  const version = activeSubmission?.versionNumber ?? thesis._count?.submissions ?? 1;
  const fileUrl = activeSubmission?.fileUrl;
  const embedUrl = getEmbedUrl(fileUrl);
  const isLatestVersion = activeSubmission?.id === thesis.currentSubmission?.id;

  return (
    <AppLayout role={user?.role}>
      {/* Action Modals */}
      <Modal
        isOpen={activeModal === 'review'}
        title="Start Review Process?"
        description={`Mark "${thesis.title}" as "Under Review". This signals to the student that you are evaluating Version ${version}.`}
        confirmText="Start Review"
        confirmClass="bg-primary hover:bg-primary-container"
        onConfirm={() => handleStatusAction('under_review')}
        onClose={() => setActiveModal(null)}
        busy={actionBusy}
      />

      <Modal
        isOpen={activeModal === 'approve'}
        title="Approve Thesis?"
        description={`Are you sure you want to approve "${thesis.title}"? This finalizes Version ${version} as approved.`}
        confirmText="Approve Thesis"
        confirmClass="bg-[#059669] hover:bg-[#047857]"
        onConfirm={() => handleStatusAction('approved')}
        onClose={() => setActiveModal(null)}
        busy={actionBusy}
      />

      <Modal
        isOpen={activeModal === 'revisions'}
        title="Request Revisions?"
        description={`Specify feedback/required changes for Version ${version}. The student will be notified to upload a new draft.`}
        confirmText="Send Revision Request"
        confirmClass="bg-amber-600 hover:bg-amber-700"
        onConfirm={() => handleStatusAction('revisions_requested', { feedback: revisionNotes })}
        onClose={() => setActiveModal(null)}
        busy={actionBusy}
      >
        <textarea
          value={revisionNotes}
          onChange={(e) => setRevisionNotes(e.target.value)}
          placeholder="Explain the required revisions..."
          rows={4}
          className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-on-surface font-body-sm text-body-sm focus:outline-none focus:border-primary"
        />
      </Modal>

      <Modal
        isOpen={activeModal === 'reopen'}
        title="Reopen Approved Thesis?"
        description={`As Department Coordinator, you are overriding the status of "${thesis.title}" back to "Revisions Requested" so the student can submit updated work.`}
        confirmText="Reopen Thesis"
        confirmClass="bg-purple-700 hover:bg-purple-800"
        onConfirm={() => handleStatusAction('revisions_requested', { feedback: revisionNotes || 'Reopened by Coordinator.' })}
        onClose={() => setActiveModal(null)}
        busy={actionBusy}
      >
        <textarea
          value={revisionNotes}
          onChange={(e) => setRevisionNotes(e.target.value)}
          placeholder="Reason for reopening this thesis..."
          rows={3}
          className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-on-surface font-body-sm text-body-sm focus:outline-none focus:border-primary"
        />
      </Modal>

      {/* Header */}
      <div className="flex flex-col gap-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-label-md font-label-md text-secondary mb-1">
              <Link to="/supervisor/dashboard" className="hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Icon name="chevron_right" className="text-sm" />
              <span className="text-on-surface">Review Thesis</span>
            </div>
            <h2 className="font-display-lg text-display-lg text-on-surface font-bold flex items-center gap-3">
              {thesis.title}
              <StatusBadge status={thesis.status} />
              {!isLatestVersion && (
                <span className="bg-amber-100 text-amber-800 text-label-xs px-2.5 py-1 rounded-full border border-amber-300 font-semibold">
                  Viewing Historical Version (v{version})
                </span>
              )}
            </h2>
            <p className="font-body-base text-body-base text-secondary mt-1">
              Student: <strong>{thesis.student?.firstName} {thesis.student?.lastName}</strong> ({thesis.student?.email}) • Version: <strong>v{version}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Version Selector */}
            {submissions.length > 1 && (
              <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2">
                <Icon name="history" className="text-secondary" />
                <select
                  value={activeSubmission?.id ?? ''}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    window.location.href = `/thesis/${id}/review?submissionId=${selectedId}`;
                  }}
                  className="bg-transparent text-on-surface font-label-md text-label-md focus:outline-none cursor-pointer"
                >
                  {submissions.map((s) => (
                    <option key={s.id} value={s.id}>
                      Version {s.versionNumber} ({formatDate(s.submittedAt)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action buttons based on status */}
            {thesis.status === 'submitted' && !isCoordinator && (
              <button
                onClick={() => setActiveModal('review')}
                className="bg-primary text-on-primary px-4 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
              >
                <Icon name="play_arrow" />
                Mark Under Review
              </button>
            )}

            {['submitted', 'under_review'].includes(thesis.status) && !isCoordinator && (
              <>
                <button
                  onClick={() => setActiveModal('revisions')}
                  className="bg-amber-600 text-white px-4 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-amber-700 transition-colors shadow-sm cursor-pointer"
                >
                  <Icon name="edit_note" />
                  Request Revisions
                </button>
                <button
                  onClick={() => setActiveModal('approve')}
                  className="bg-[#059669] text-white px-4 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-[#047857] transition-colors shadow-sm cursor-pointer"
                >
                  <Icon name="check_circle" />
                  Approve Thesis
                </button>
              </>
            )}

            {/* Coordinator Reopen Override */}
            {thesis.status === 'approved' && isCoordinator && (
              <button
                onClick={() => setActiveModal('reopen')}
                className="bg-purple-700 text-white px-4 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-purple-800 transition-colors shadow-sm cursor-pointer"
              >
                <Icon name="lock_open" />
                Reopen Thesis for Revisions
              </button>
            )}

            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="bg-surface-container-lowest border border-outline-variant text-on-surface px-4 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-surface-container-low transition-colors shadow-sm"
              >
                <Icon name="download" />
                Download (v{version})
              </a>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant">
          <StatusTimeline current={thesis.status} />
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[700px] mt-6">
        {/* Left: Document Viewer */}
        <div className="flex-1 flex flex-col bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="h-12 border-b border-outline-variant flex items-center justify-between px-5 bg-surface-bright flex-shrink-0">
            <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-2">
              <Icon name="description" className="text-primary" />
              Thesis Document (v{version})
            </span>
            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary font-label-xs text-label-xs hover:underline flex items-center gap-1"
              >
                Open Original <Icon name="open_in_new" className="text-[14px]" />
              </a>
            )}
          </div>

          <div className="flex-1 bg-[#F3F4F6] min-h-[600px] flex items-center justify-center p-2">
            {fileUrl ? (
              <iframe
                src={embedUrl}
                title={`Thesis Document v${version}`}
                className="w-full h-full min-h-[650px] border-0 rounded"
              />
            ) : (
              <div className="text-center p-8">
                <Icon name="find_in_page" className="text-[48px] text-outline mb-2" />
                <p className="font-body-base text-body-base text-secondary">
                  No document file has been uploaded for Version {version} yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Feedback & Discussion */}
        <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="h-12 border-b border-outline-variant flex items-center px-5 flex-shrink-0 bg-surface-bright">
            <h3 className="font-section-header text-section-header text-on-surface flex items-center gap-2">
              <Icon name="forum" className="text-primary text-[20px]" />
              Feedback Notes (v{version})
            </h3>
            <span className="ml-auto bg-surface-container text-on-surface-variant font-label-xs text-label-xs px-2.5 py-0.5 rounded-full border border-outline-variant">
              {comments.length}
            </span>
          </div>

          <div className="flex-grow overflow-y-auto p-5 flex flex-col gap-4 min-h-[400px]">
            {comments.length === 0 && (
              <div className="text-center my-auto py-8">
                <Icon name="chat_bubble_outline" className="text-[36px] text-outline mb-2" />
                <p className="font-body-sm text-body-sm text-secondary">
                  No comments yet on Version {version}. Type a note below.
                </p>
              </div>
            )}
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 font-label-md text-label-md font-bold">
                  {(c.author?.firstName?.[0] ?? '?') + (c.author?.lastName?.[0] ?? '')}
                </div>
                <div className="flex flex-col w-full">
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

          {/* Post Feedback Form */}
          <form onSubmit={handlePost} className="p-4 border-t border-outline-variant bg-surface-container-lowest">
            <div className="flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={activeSubmission ? `Add feedback on v${version}...` : 'No active submission'}
                disabled={!activeSubmission || posting}
                className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2 text-on-surface focus:outline-none focus:border-primary text-body-sm disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!draft.trim() || !activeSubmission || posting}
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
