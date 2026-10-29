import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  EyeOff,
  Trash2,
  Flag,
  Loader2,
  Clock,
  UserCheck,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import { useUser } from '../context/UserContext';
import { SEO } from '../components/common/SEO';

export const ModerationDashboard: React.FC = () => {
  const { isModerator } = useUser();
  const [queue, setQueue] = useState<{ pendingReports: any[]; flaggedPosts: any[] }>({
    pendingReports: [],
    flaggedPosts: [],
  });
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const data = await api.getModerationQueue();
      setQueue(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAction = async (reportId?: string, targetId?: string, action?: string) => {
    if (!action) return;
    try {
      await api.applyModerationAction({
        reportId,
        targetId,
        action,
      });
      setActionMessage(`Action '${action}' executed successfully.`);
      setTimeout(() => setActionMessage(null), 2500);
      fetchQueue();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SEO
        title="Moderation Console & Community Safety Queue"
        description="Administrative moderation dashboard to review community reports, resolve auto-flagged PII or toxicity alerts, and protect platform safety."
      />
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold border border-amber-200">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
          <span>Moderator Safety Council</span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
          Community Content Moderation Queue
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
          Her Voice maintains strict community standards to shield survivors from harassment, victim-blaming, doxxing, and bad-faith manipulation.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold">
          ✓ {actionMessage}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <p className="text-xs text-zinc-500">Loading moderation queue...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 1: User Reports */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Flag className="w-4 h-4 text-red-600" />
                <span>Pending Community Reports ({queue.pendingReports.length})</span>
              </h2>
            </div>

            {queue.pendingReports.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-zinc-200 text-center text-xs text-zinc-500 flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>No pending user reports in the moderation queue. Community is safe.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {queue.pendingReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white rounded-2xl p-5 border border-red-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-red-700 uppercase bg-red-50 px-2 py-0.5 rounded">
                        Reason: {report.reason}
                      </span>
                      <span className="text-zinc-400">
                        Reported by: {report.reporter?.pseudonym || 'Anonymous'}
                      </span>
                    </div>

                    {report.details && (
                      <p className="text-xs text-zinc-600 italic bg-zinc-50 p-2.5 rounded-lg">
                        “{report.details}”
                      </p>
                    )}

                    {report.post && (
                      <div className="p-3 bg-purple-50/50 rounded-xl space-y-1 text-xs">
                        <div className="font-bold text-zinc-900">{report.post.title}</div>
                        <p className="text-zinc-600 line-clamp-2">{report.post.content}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 text-xs">
                      <button
                        onClick={() => handleAction(report.id, report.targetId, 'dismiss_report')}
                        className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg font-semibold"
                      >
                        Dismiss Report
                      </button>
                      <button
                        onClick={() => handleAction(report.id, report.targetId, 'hide')}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
                      >
                        Hide Content Immediately
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Flagged Posts */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Flagged Posts Requiring Review ({queue.flaggedPosts.length})</span>
            </h2>

            {queue.flaggedPosts.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-zinc-200 text-center text-xs text-zinc-500 flex flex-col items-center justify-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>No flagged posts currently require manual intervention.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {queue.flaggedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-3 text-xs"
                  >
                    <div className="flex justify-between items-center text-zinc-500 text-[11px]">
                      <span className="font-bold text-purple-900">Author: {post.pseudonym}</span>
                      <span>Status: {post.moderationStatus}</span>
                    </div>

                    <div className="font-bold text-sm text-zinc-900">{post.title}</div>
                    <p className="text-zinc-700 leading-relaxed whitespace-pre-line">{post.content}</p>

                    <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                      <button
                        onClick={() => handleAction(undefined, post.id, 'approve')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                      >
                        Approve Post
                      </button>
                      <button
                        onClick={() => handleAction(undefined, post.id, 'hide')}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
                      >
                        Hide Post
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

