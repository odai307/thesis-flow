import { useEffect, useRef, useState } from 'react';
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

export default function ThesisWorkspace() {
  const { id } = useParams();
  const [thesis, setThesis] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const currentSubmission = thesis?.currentSubmission;

  async function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { submission, status } = await api.uploadSubmission(id, file);
      // Refresh thesis + submissions to reflect the new version.
      const data = await api.getThesis(id);
      setThesis(data.thesis);
      if (data.thesis.currentSubmission) {
        const c = await api.getComments(data.thesis.currentSubmission.id);
        setComments(c.comments);
      }
      console.log('Uploaded version', submission.versionNumber, '->', status);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function loadComments() {
    if (!currentSubmission) return;
    try {
      const data = await api.getComments(currentSubmission.id);
      setComments(data.comments);
    } catch (e) {
      setError(e.message);
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

  async function handlePost(e) {
    e.preventDefault();
    const content = draft.trim();
    if (!content || !currentSubmission) return;
    setPosting(true);
    try {
      const { comment } = await api.postComment(currentSubmission.id, content);
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
      <AppLayout>
        <p className="font-body-base text-body-base text-secondary">Loading workspace…</p>
      </AppLayout>
    );
  }
  if (error && !thesis) {
    return (
      <AppLayout>
        <p className="font-body-base text-body-base text-error bg-error-container border border-error/20 rounded px-3 py-2">
          {error}
        </p>
      </AppLayout>
    );
  }
  if (!thesis) return null;

  const version = currentSubmission?.versionNumber ?? thesis._count?.submissions ?? 1;

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col gap-6 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-section-header text-section-header text-on-surface">
              {thesis.title}
            </h1>
            <p className="font-body-sm text-body-sm text-secondary mt-1">
              Submitted on {formatDate(currentSubmission?.submittedAt)} • v{version}
            </p>
          </div>
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="px-5 py-2.5 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md flex items-center gap-2 shadow-ambient hover:bg-primary transition-colors disabled:opacity-60"
          >
            <Icon name="upload_file" className="text-[18px]" />
            {uploading ? 'Uploading…' : 'Upload/Resubmit'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Status timeline */}
        <div className="w-full relative py-6 px-4 bg-surface-container-lowest rounded-lg border border-outline-variant">
          <StatusTimeline current={thesis.status} />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-gutter flex-grow min-h-[600px]">
        {/* Left: document preview */}
        <div className="flex-grow lg:w-2/3 flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-ambient">
          <div className="h-12 border-b border-outline-variant bg-surface-container-low flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex items-center gap-4 text-on-surface-variant">
              <button className="hover:text-primary transition-colors flex items-center">
                <Icon name="zoom_out" />
              </button>
              <span className="font-label-md text-label-md">100%</span>
              <button className="hover:text-primary transition-colors flex items-center">
                <Icon name="zoom_in" />
              </button>
            </div>
            <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
              <button className="hover:text-primary transition-colors flex items-center">
                <Icon name="navigate_before" />
              </button>
              <span>Page 1 of 42</span>
              <button className="hover:text-primary transition-colors flex items-center">
                <Icon name="navigate_next" />
              </button>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant">
              <button className="hover:text-primary transition-colors flex items-center">
                <Icon name="search" />
              </button>
              <button className="hover:text-primary transition-colors flex items-center">
                <Icon name="download" />
              </button>
            </div>
          </div>

          <div className="flex-grow bg-[#E5E7EB] overflow-auto p-8 flex justify-center items-start">
            <div className="w-full max-w-[800px] aspect-[1/1.414] bg-white shadow-lg border border-outline-variant p-12 flex flex-col gap-6 relative">
              <div className="absolute top-[25%] left-[10%] right-[10%] h-8 bg-error-container/30 border border-error/50 rounded cursor-pointer" />
              <div className="w-1/2 h-8 bg-surface-container-high rounded mb-8" />
              <div className="w-full h-4 bg-surface-container-low rounded" />
              <div className="w-full h-4 bg-surface-container-low rounded" />
              <div className="w-11/12 h-4 bg-surface-container-low rounded" />
              <div className="w-full h-4 bg-surface-container-low rounded" />
              <div className="w-4/5 h-4 bg-surface-container-low rounded mb-6" />
              <div className="w-1/3 h-6 bg-surface-container-high rounded mb-4 mt-4" />
              <div className="w-full h-4 bg-surface-container-low rounded" />
              <div className="w-full h-4 bg-surface-container-low rounded" />
              <div className="w-10/12 h-4 bg-surface-container-low rounded" />
              <div className="mt-auto w-full flex justify-center">
                <div className="w-8 h-4 bg-surface-container-highest rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: comments panel */}
        <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-ambient">
          <div className="h-14 border-b border-outline-variant flex items-center px-5 flex-shrink-0 bg-surface-bright">
            <h2 className="font-section-header text-section-header text-on-surface flex items-center gap-2">
              <Icon name="forum" className="text-primary text-[20px]" />
              Supervisor Feedback
            </h2>
            <span className="ml-auto bg-error-container text-error font-label-xs text-label-xs px-2 py-1 rounded-full">
              {comments.length} {comments.length === 1 ? 'note' : 'notes'}
            </span>
          </div>

          <div className="flex-grow overflow-y-auto p-5 flex flex-col gap-6">
            {comments.length === 0 && (
              <p className="font-body-sm text-body-sm text-secondary text-center mt-8">
                No comments yet. Start the conversation below.
              </p>
            )}
            {comments.map((c) => (
              <div key={c.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 font-label-md text-label-md">
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
                  {c.author?.role && (
                    <span className="font-label-xs text-label-xs text-primary mb-2 capitalize">
                      {c.author.role}
                    </span>
                  )}
                  <div className="bg-surface-container p-3 rounded-r-lg rounded-bl-lg font-body-sm text-body-sm text-on-surface border border-outline-variant/50 relative">
                    {c.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply input */}
          <form onSubmit={handlePost} className="p-4 border-t border-outline-variant bg-surface-bright flex-shrink-0">
            <div className="border border-outline-variant rounded-lg bg-surface-container-lowest overflow-hidden focus-within:border-primary transition-all">
              <textarea
                className="w-full p-3 bg-transparent border-none focus:ring-0 resize-none font-body-sm text-body-sm text-on-surface outline-none"
                placeholder="Write a reply or add a general comment..."
                rows="2"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <div className="flex justify-between items-center px-3 py-2 border-t border-outline-variant/30 bg-surface-container-low">
                <div className="flex gap-1">
                  <button type="button" className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors">
                    <Icon name="format_bold" className="text-[18px]" />
                  </button>
                  <button type="button" className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors">
                    <Icon name="format_italic" className="text-[18px]" />
                  </button>
                  <button type="button" className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors">
                    <Icon name="attach_file" className="text-[18px]" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={posting || !draft.trim()}
                  className="bg-primary text-on-primary px-3 py-1.5 rounded font-label-md text-label-md hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  Post
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
