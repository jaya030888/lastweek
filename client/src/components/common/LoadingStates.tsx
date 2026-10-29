import React from 'react';

export const PostCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-xs space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-zinc-200" />
          <div className="space-y-1.5">
            <div className="w-28 h-3.5 bg-zinc-200 rounded" />
            <div className="w-20 h-2.5 bg-zinc-100 rounded" />
          </div>
        </div>
        <div className="w-12 h-4 bg-zinc-100 rounded" />
      </div>

      <div className="space-y-2">
        <div className="w-3/4 h-5 bg-zinc-200 rounded" />
        <div className="w-full h-3 bg-zinc-100 rounded" />
        <div className="w-5/6 h-3 bg-zinc-100 rounded" />
      </div>

      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-12 h-6 bg-zinc-100 rounded-lg" />
          <div className="w-12 h-6 bg-zinc-100 rounded-lg" />
        </div>
        <div className="w-16 h-4 bg-zinc-100 rounded" />
      </div>
    </div>
  );
};

export const CardGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs space-y-3 animate-pulse">
          <div className="flex justify-between items-start">
            <div className="w-3/5 h-4 bg-zinc-200 rounded" />
            <div className="w-12 h-4 bg-zinc-100 rounded-full" />
          </div>
          <div className="w-full h-3 bg-zinc-100 rounded" />
          <div className="w-4/5 h-3 bg-zinc-100 rounded" />
          <div className="pt-3 border-t border-zinc-100 flex justify-between">
            <div className="w-24 h-4 bg-zinc-100 rounded" />
            <div className="w-20 h-4 bg-zinc-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

