import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Smile,
  Users,
  Ear,
  MessageSquare,
  Bookmark,
  AlertTriangle,
  Search,
  Plus,
  Shield,
  Flag,
  Send,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';
import { Post, Comment, CategoryType } from '../types';
import { CreatePostModal } from '../components/modals/CreatePostModal';
import { PostCardSkeleton } from '../components/common/LoadingStates';
import { SEO } from '../components/common/SEO';

export const HerSpaceFeed: React.FC = () => {
  const { userId, pseudonym } = useUser();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Comments state
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [activeComments, setActiveComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Reporting state
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('harassment');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const categories: Array<{ label: string; value: CategoryType }> = [
    { label: 'All Discussions', value: 'all' },
    { label: 'Domestic Abuse', value: 'domestic_abuse' },
    { label: 'Workplace Harassment', value: 'harassment' },
    { label: 'Sexual Violence', value: 'sexual_violence' },
    { label: 'Relationships', value: 'relationships' },
    { label: 'Discrimination', value: 'discrimination' },
    { label: 'Recovery & Healing', value: 'recovery' },
  ];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.getPosts({
        category: selectedCategory,
        sort: sortBy,
        search: searchQuery || undefined,
        userId,
      });
      setPosts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleToggleReaction = async (postId: string, type: string) => {
    try {
      await api.toggleReaction(postId, type, userId, pseudonym);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmark = async (postId: string) => {
    try {
      await api.toggleBookmark(postId, userId, pseudonym);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenComments = async (postId: string) => {
    if (expandedCommentsPostId === postId) {
      setExpandedCommentsPostId(null);
      return;
    }
    setExpandedCommentsPostId(postId);
    setLoadingComments(true);
    try {
      const comments = await api.getComments(postId);
      setActiveComments(comments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newCommentText.trim()) return;
    setSubmittingComment(true);
    try {
      await api.addComment(postId, newCommentText, pseudonym, userId);
      setNewCommentText('');
      const comments = await api.getComments(postId);
      setActiveComments(comments);
      fetchPosts();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReportPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingPostId) return;

    try {
      await api.reportContent({
        targetType: 'post',
        targetId: reportingPostId,
        reason: reportReason,
        details: reportDetails,
        reporterPseudonym: pseudonym,
      });
      setReportSuccess(true);
      setTimeout(() => {
        setReportingPostId(null);
        setReportSuccess(false);
        setReportDetails('');
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SEO
        title="HerSpace Anonymous Community Feed"
        description="Share your story pseudonymously and receive supportive, nonjudgmental solidarity from community members across domestic abuse, harassment, and recovery."
      />

      {/* Feed Banner Header (Clean, Decluttered) */}
      <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-purple-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-900/50 rounded-full text-xs font-semibold text-purple-200 border border-purple-700/40">
            <Shield className="w-3.5 h-3.5 text-purple-300" aria-hidden="true" />
            <span>HerSpace Anonymous Solidarity Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Share Your Truth. Heal in Solidarity.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Every story is published under an anonymous pseudonym. Connect with empathy, receive encouragement, and break the silence without compromising your personal safety.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition active:scale-95"
          aria-label="Open post creation modal"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Share Story</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearch} className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiences or keywords..."
              aria-label="Search community posts"
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-purple-600 shadow-xs"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" aria-hidden="true" />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-zinc-500 font-medium">Sort by:</span>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                sortBy === 'newest'
                  ? 'bg-purple-100 text-purple-900'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                sortBy === 'popular'
                  ? 'bg-purple-100 text-purple-900'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Most Supported
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                role="tab"
                aria-selected={isSelected}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
                  isSelected
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:border-purple-300'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="space-y-4">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200 space-y-3 shadow-xs">
          <Shield className="w-10 h-10 text-zinc-300 mx-auto" aria-hidden="true" />
          <h3 className="text-base font-bold text-zinc-800">No stories found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Be the first courageous voice to share an experience in this category.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold shadow"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Share a Story</span>
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => {
            const hasHeart = post.userReactions?.includes('purple_heart');
            const hasHug = post.userReactions?.includes('empathy_hug');
            const hasSolidarity = post.userReactions?.includes('solidarity');
            const hasListening = post.userReactions?.includes('listening_ear');

            return (
              <article
                key={post.id}
                className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs hover:shadow-md transition-shadow space-y-4"
              >
                {/* Post Author Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white text-xs font-bold"
                      aria-label={`Avatar for ${post.pseudonym}`}
                    >
                      {post.pseudonym.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-zinc-900">
                          {post.pseudonym}
                        </span>
                        {post.isVerified && (
                          <span className="text-[10px] bg-purple-100 text-purple-700 font-semibold px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString()}</time>
                        <span>•</span>
                        <span className="capitalize">{post.category.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleBookmark(post.id)}
                      title="Bookmark post"
                      aria-label="Bookmark this post"
                      className={`p-1.5 rounded-lg transition ${
                        post.isBookmarked
                          ? 'text-purple-600 bg-purple-50'
                          : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => setReportingPostId(post.id)}
                      title="Report inappropriate content"
                      aria-label="Report this post"
                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Flag className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Trigger warning banner */}
                {post.triggerWarning && (
                  <div className="p-2.5 bg-amber-50/70 border-l-4 border-amber-400 rounded-r-lg text-xs text-amber-900 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
                    <span>
                      <strong>Content Advisory:</strong> {post.triggerWarning}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900 leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Empathetic Reaction Bar (Generic Lucide Icons, Clean) */}
                <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Purple Heart */}
                    <button
                      onClick={() => handleToggleReaction(post.id, 'purple_heart')}
                      title="Send Heart"
                      aria-label="Send heart reaction"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition ${
                        hasHeart
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-zinc-50 hover:bg-purple-50 text-zinc-600'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasHeart ? 'fill-purple-600 text-purple-600' : 'text-zinc-500'}`} aria-hidden="true" />
                      <span>{post.reactionCounts?.purple_heart || 0}</span>
                    </button>

                    {/* Empathy Hug */}
                    <button
                      onClick={() => handleToggleReaction(post.id, 'empathy_hug')}
                      title="Send Empathy Hug"
                      aria-label="Send empathy hug reaction"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition ${
                        hasHug
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-zinc-50 hover:bg-amber-50 text-zinc-600'
                      }`}
                    >
                      <Smile className={`w-3.5 h-3.5 ${hasHug ? 'text-amber-600' : 'text-zinc-500'}`} aria-hidden="true" />
                      <span>{post.reactionCounts?.empathy_hug || 0}</span>
                    </button>

                    {/* Solidarity */}
                    <button
                      onClick={() => handleToggleReaction(post.id, 'solidarity')}
                      title="Solidarity"
                      aria-label="Send solidarity reaction"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition ${
                        hasSolidarity
                          ? 'bg-indigo-100 text-indigo-900'
                          : 'bg-zinc-50 hover:bg-indigo-50 text-zinc-600'
                      }`}
                    >
                      <Users className={`w-3.5 h-3.5 ${hasSolidarity ? 'text-indigo-600' : 'text-zinc-500'}`} aria-hidden="true" />
                      <span>{post.reactionCounts?.solidarity || 0}</span>
                    </button>

                    {/* Listening Ear */}
                    <button
                      onClick={() => handleToggleReaction(post.id, 'listening_ear')}
                      title="Listening Ear"
                      aria-label="Send listening ear reaction"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition ${
                        hasListening
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-zinc-50 hover:bg-emerald-50 text-zinc-600'
                      }`}
                    >
                      <Ear className={`w-3.5 h-3.5 ${hasListening ? 'text-emerald-600' : 'text-zinc-500'}`} aria-hidden="true" />
                      <span>{post.reactionCounts?.listening_ear || 0}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleOpenComments(post.id)}
                    aria-label={`View ${post.commentCount || 0} supportive comments`}
                    className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-purple-700 font-semibold px-2 py-1 rounded"
                  >
                    <MessageSquare className="w-4 h-4 text-purple-600" aria-hidden="true" />
                    <span>{post.commentCount || 0} Comments</span>
                  </button>
                </div>

                {/* Comments Section Drawer */}
                {expandedCommentsPostId === post.id && (
                  <div className="pt-4 border-t border-zinc-100 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Supportive Community Messages
                    </h3>

                    {loadingComments ? (
                      <div className="py-4 text-center text-xs text-zinc-400">Loading comments...</div>
                    ) : activeComments.length === 0 ? (
                      <div className="p-4 bg-zinc-50 rounded-xl text-center text-xs text-zinc-500">
                        No comments yet. Send a gentle note of support or solidarity.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {activeComments.map((comment) => (
                          <div
                            key={comment.id}
                            className="p-3 bg-zinc-50 rounded-xl space-y-1 text-xs"
                          >
                            <div className="flex items-center justify-between text-zinc-500 text-[11px]">
                              <span className="font-bold text-purple-900">{comment.pseudonym}</span>
                              <time dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleDateString()}</time>
                            </div>
                            <p className="text-zinc-700 leading-relaxed">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add comment input */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder={`Leave a supportive comment as ${pseudonym}...`}
                        aria-label="Add comment text"
                        className="flex-1 px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-purple-600"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                      />
                      <button
                        disabled={submittingComment || !newCommentText.trim()}
                        onClick={() => handleAddComment(post.id)}
                        aria-label="Submit comment"
                        className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Reporting Modal */}
      {reportingPostId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Flag className="w-4 h-4 text-red-600" aria-hidden="true" />
              <span>Report Community Content</span>
            </h3>

            {reportSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs">
                ✓ Thank you. Our moderation council has received the report and will review it promptly.
              </div>
            ) : (
              <form onSubmit={handleReportPost} className="space-y-3">
                <p className="text-xs text-zinc-600">
                  Please let us know why this content should be reviewed by moderators:
                </p>

                <div>
                  <label htmlFor="report-reason" className="block text-xs font-semibold text-zinc-700 mb-1">Reason</label>
                  <select
                    id="report-reason"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs"
                  >
                    <option value="harassment">Harassment or abusive remarks</option>
                    <option value="doxxing">Exposing personal or private information (Doxxing)</option>
                    <option value="hate_speech">Hate speech or victim-blaming</option>
                    <option value="spam">Commercial spam or irrelevant promotion</option>
                    <option value="other">Other safety violation</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="report-details" className="block text-xs font-semibold text-zinc-700 mb-1">
                    Details (Optional)
                  </label>
                  <textarea
                    id="report-details"
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide additional context if needed..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportingPostId(null)}
                    className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={() => {
          fetchPosts();
          navigate('/thank-you?type=story');
        }}
      />
    </div>
  );
};
