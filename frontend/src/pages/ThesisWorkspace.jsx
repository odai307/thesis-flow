import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatusTimeline from '../components/StatusTimeline';
import { api } from '../lib/api';
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

// Modal dialog for confirming student submission to supervisor
function ConfirmModal({ isOpen, title, description, confirmText, confirmClass, onConfirm, onClose, busy }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
            <Icon name="send" className="text-[24px]" />
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
            Cancel / Edit File
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`px-5 py-2.5 rounded-lg text-white font-label-md text-label-md transition-colors disabled:opacity-50 shadow-sm ${confirmClass}`}
          >
            {busy ? 'Submitting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ThesisWorkspace() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const requestedSubmissionId = searchParams.get('submissionId');

  const [thesis, setThesis] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const fileInputRef = useRef(null);

  const submissions = thesis?.submissions ?? [];
  const activeSubmission =
    submissions.find((s) => s.id === requestedSubmissionId) ??
    thesis?.currentSubmission ??
    submissions[0];

  async function loadThesisData() {
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
    loadThesisData();
  }, [id, requestedSubmissionId]);

  // Real-time socket events & interval polling
  useEffect(() => {
    if (!id) return;
    joinThesisRoom(id);

    const socket = getSocket();

    const handleStatusChanged = () => {
      loadThesisData();
    };

    socket.on('thesis:statusChanged', handleStatusChanged);
    socket.on('thesis:paperUploaded', handleStatusChanged);

    // Fallback polling interval every 4 seconds
    const interval = setInterval(loadThesisData, 4000);

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

  async function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      await api.uploadSubmission(id, file);
      await loadThesisData();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleConfirmSubmit() {
    setSubmitting(true);
    setError('');
    try {
      await api.submitToSupervisor(id);
      setShowSubmitModal(false);
      await loadThesisData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
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
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="font-body-base text-body-base text-secondary animate-pulse">Loading workspace…</p>
        </div>
      </AppLayout>
    );
  }

  if (error && !thesis) {
    return (
      <AppLayout>
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded-lg px-4 py-3">
          {error}
        </p>
      </AppLayout>
    );
  }

  if (!thesis) return null;

  const version = activeSubmission?.versionNumber ?? thesis._count?.submissions ?? 1;
  const fileUrl = activeSubmission?.fileUrl;
  const isLatestVersion = activeSubmission?.id === thesis.currentSubmission?.id;
  const canSubmitToSupervisor = ['draft', 'revisions_requested'].includes(thesis.status) && thesis.currentSubmissionId;

  return (
    <AppLayout>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx"
        className="hidden"
      />

      <ConfirmModal
        isOpen={showSubmitModal}
        title="Submit Thesis to Supervisor?"
        description={`Are you sure you want to submit Version ${version} to your supervisor? Once submitted, your supervisor will be notified and can begin reviewing your document.`}
        confirmText="Yes, Submit to Supervisor"
        confirmClass="bg-[#059669] hover:bg-[#047857]"
        onConfirm={handleConfirmSubmit}
        onClose={() => setShowSubmitModal(false)}
        busy={submitting}
      />

      {/* Header with status timeline */}
      <div className="flex flex-col gap-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-label-md font-label-md text-secondary mb-1">
              <Link to="/dashboard" className="hover:text-primary transition-colors">
                My Dashboard
              </Link>
              <Icon name="chevron_right" className="text-sm" />
              <span className="text-on-surface">Thesis Workspace</span>
            </div>
            <h2 className="font-display-lg text-display-lg text-on-surface font-bold flex items-center gap-3">
              {thesis.title}
              {!isLatestVersion && (
                <span className="bg-amber-100 text-amber-800 text-label-xs px-2.5 py-1 rounded-full border border-amber-300 font-semibold">
                  Viewing Historical Version (v{version})
                </span>
              )}
            </h2>
            <p className="font-body-base text-body-base text-secondary mt-1">
              Viewing Version <strong>v{version}</strong> • Status:{' '}
              <strong className="capitalize text-primary">{thesis.status.replace('_', ' ')}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Version Selector Dropdown */}
            {submissions.length > 1 && (
              <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2">
                <Icon name="history" className="text-secondary" />
                <select
                  value={activeSubmission?.id ?? ''}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    window.location.href = `/thesis/${id}/workspace?submissionId=${selectedId}`;
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

            {/* Upload File Button */}
            {['draft', 'revisions_requested'].includes(thesis.status) && (
              <button
                onClick={handleUploadClick}
                disabled={uploading || submitting}
                className="bg-surface-container-low border border-outline-variant text-on-surface px-4 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-surface-container-high transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
              >
                <Icon name="upload_file" />
                {uploading ? 'Uploading Paper...' : fileUrl ? 'Replace Paper File' : 'Upload Draft Paper'}
              </button>
            )}

            {/* Manual Submit Button */}
            {canSubmitToSupervisor && (
              <button
                onClick={() => setShowSubmitModal(true)}
                disabled={submitting}
                className="bg-[#059669] text-white px-5 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-[#047857] transition-colors disabled:opacity-50 shadow-sm cursor-pointer font-bold"
              >
                <Icon name="send" />
                Submit Version {version} to Supervisor
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
                Download PDF (v{version})
              </a>
            )}
          </div>
        </div>

        {/* Draft Notice Banner */}
        {['draft', 'revisions_requested'].includes(thesis.status) && fileUrl && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between gap-4 text-amber-900 font-body-sm text-body-sm">
            <div className="flex items-center gap-2">
              <Icon name="info" className="text-amber-700 text-[20px]" />
              <span>
                Your paper file (v{version}) is saved in your draft area. Your supervisor cannot see it until you click <strong>Submit to Supervisor</strong>.
              </span>
            </div>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-[#059669] text-white font-label-xs text-label-xs px-3 py-1.5 rounded-md hover:bg-[#047857] transition-colors flex items-center gap-1 shrink-0 font-bold"
            >
              Submit Now &rarr;
            </button>
          </div>
        )}

        <div className="pt-4 border-t border-outline-variant">
          <StatusTimeline current={thesis.status} />
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[700px] mt-6">
        {/* Left: Document Viewer / Upload Drop Zone */}
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

          <div className="flex-1 bg-[#F3F4F6] min-h-[600px] flex items-center justify-center relative p-2">
            {fileUrl ? (
              <iframe
                src={fileUrl}
                title={`Thesis Document v${version}`}
                className="w-full h-full min-h-[650px] border-0 rounded"
              />
            ) : (
              <div className="text-center p-8 border-2 border-dashed border-outline-variant rounded-xl max-w-md bg-white shadow-sm">
                <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-4 text-primary-container">
                  <Icon name="cloud_upload" className="text-[36px]" />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Upload Your Paper Draft</h3>
                <p className="font-body-sm text-body-sm text-secondary mb-6">
                  Select your thesis file (.pdf or .docx) to preview it in your workspace before submitting to your supervisor.
                </p>
                <button
                  onClick={handleUploadClick}
                  disabled={uploading}
                  className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50 mx-auto shadow-sm cursor-pointer"
                >
                  <Icon name="upload_file" />
                  {uploading ? 'Uploading...' : 'Select & Upload Paper File'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Feedback & Discussion Panel */}
        <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="h-12 border-b border-outline-variant flex items-center px-5 flex-shrink-0 bg-surface-bright">
            <h3 className="font-section-header text-section-header text-on-surface flex items-center gap-2">
              <Icon name="forum" className="text-primary text-[20px]" />
              Feedback on v{version}
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
                  No feedback notes for v{version}. Send a message below.
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

          {/* Comment input box */}
          <form onSubmit={handlePost} className="p-4 border-t border-outline-variant bg-surface-container-lowest">
            <div className="flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={activeSubmission ? `Comment on v${version}...` : 'Upload a paper first'}
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
