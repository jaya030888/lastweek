import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  Send,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { api } from '../../services/api';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const { pseudonym, avatarSeed } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('domestic_abuse');
  const [triggerWarning, setTriggerWarning] = useState('');
  const [hasAgreedGuidelines, setHasAgreedGuidelines] = useState(false);
  const [piiWarning, setPiiWarning] = useState<string[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Specific field error states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const errs: { [key: string]: string } = {};
    if (!title.trim()) {
      errs.title = 'Title is required to help community members find your story.';
    } else if (title.trim().length < 5) {
      errs.title = 'Title should be at least 5 characters long.';
    }

    if (!content.trim()) {
      errs.content = 'Please write a brief description of your experience or thoughts.';
    } else if (content.trim().length < 15) {
      errs.content = 'Content should be at least 15 characters long.';
    }

    if (!hasAgreedGuidelines) {
      errs.guidelines = 'You must confirm that you will adhere to safety and anti-doxxing guidelines.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (confirmPii = false) => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.createPost({
        title,
        content,
        category,
        triggerWarning: triggerWarning.trim() || undefined,
        pseudonym,
        avatarSeed,
        confirmPiiWarning: confirmPii,
      });

      if (response.warning?.requiresConfirmation) {
        setPiiWarning(response.warning.details || ['Potential identifying information detected.']);
        setIsSubmitting(false);
        return;
      }

      // Success
      setTitle('');
      setContent('');
      setTriggerWarning('');
      setPiiWarning(null);
      setErrors({});
      onPostCreated();
      onClose();
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to submit post' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-purple-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-zinc-900">
              Share Your Story in HerSpace
            </h2>
            <p className="text-xs text-purple-700 font-medium mt-0.5">
              Publishing pseudonymously as: <span className="font-bold underline">{pseudonym}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close story dialog"
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {errors.form && (
          <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" aria-hidden="true" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* PII Detection Warning Dialog */}
        {piiWarning && (
          <div role="alert" className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-600" aria-hidden="true" />
              <span>Safety Check: Identifying Details Detected</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Our safety filter detected potential identifying details (such as a phone number, email, or physical address). Publicly exposing personal information may compromise your safety:
            </p>
            <ul className="list-disc list-inside text-xs text-amber-900 space-y-1">
              {piiWarning.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPiiWarning(null)}
                className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-lg"
              >
                Edit &amp; Redact
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                I Understand, Post Anyway
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {/* Category */}
          <div>
            <label htmlFor="post-category" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Topic Category
            </label>
            <select
              id="post-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-purple-600"
            >
              <option value="domestic_abuse">Domestic Abuse &amp; Coercive Control</option>
              <option value="harassment">Workplace &amp; Public Harassment</option>
              <option value="sexual_violence">Sexual Violence &amp; Assault</option>
              <option value="relationships">Unhealthy Relationships &amp; Gaslighting</option>
              <option value="discrimination">Gender Discrimination</option>
              <option value="recovery">Healing &amp; Recovery Journeys</option>
            </select>
          </div>

          {/* Title with Form Error State */}
          <div>
            <label htmlFor="post-title" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Post Title
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
              }}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "post-title-error" : undefined}
              placeholder="e.g. Recognizing the signs of financial isolation"
              maxLength={150}
              className={`w-full bg-zinc-50 border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none ${
                errors.title
                  ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                  : 'border-zinc-200 focus:border-purple-600'
              }`}
            />
            {errors.title && (
              <p id="post-title-error" className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Trigger warning (optional) */}
          <div>
            <label htmlFor="post-warning" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Content Advisory <span className="font-normal text-zinc-400">(Optional)</span>
            </label>
            <input
              id="post-warning"
              type="text"
              value={triggerWarning}
              onChange={(e) => setTriggerWarning(e.target.value)}
              placeholder="e.g. Mentions emotional manipulation, panic attacks"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-purple-600"
            />
          </div>

          {/* Body Content with Form Error State */}
          <div>
            <label htmlFor="post-content" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Your Experience / Thoughts
            </label>
            <textarea
              id="post-content"
              rows={5}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) setErrors(prev => ({ ...prev, content: '' }));
              }}
              aria-invalid={Boolean(errors.content)}
              aria-describedby={errors.content ? "post-content-error" : undefined}
              placeholder="Share what happened, what helped, or what questions you have. Remember not to include real full names, phone numbers, or exact addresses."
              className={`w-full bg-zinc-50 border rounded-xl p-3.5 text-xs sm:text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none leading-relaxed ${
                errors.content
                  ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                  : 'border-zinc-200 focus:border-purple-600'
              }`}
            />
            {errors.content && (
              <p id="post-content-error" className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{errors.content}</span>
              </p>
            )}
          </div>

          {/* Guidelines agreement with Form Error State */}
          <div className="pt-2">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="guidelines-check"
                checked={hasAgreedGuidelines}
                onChange={(e) => {
                  setHasAgreedGuidelines(e.target.checked);
                  if (errors.guidelines) setErrors(prev => ({ ...prev, guidelines: '' }));
                }}
                aria-invalid={Boolean(errors.guidelines)}
                aria-describedby={errors.guidelines ? "guidelines-error" : undefined}
                className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="guidelines-check" className="text-xs text-zinc-600 cursor-pointer">
                I agree to the <strong>Community Guidelines</strong>: I will not post real names, doxx individuals, or publish abusive comments.
              </label>
            </div>
            {errors.guidelines && (
              <p id="guidelines-error" className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium pl-6">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{errors.guidelines}</span>
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(false)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isSubmitting ? 'Verifying...' : 'Publish Anonymously'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
