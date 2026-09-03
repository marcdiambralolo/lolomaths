'use client';

const BackgroundEffects = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15" />
    <div className="absolute right-0 top-28 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15" />
    <div className="absolute bottom-20 left-0 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl dark:bg-fuchsia-500/10" />
  </div>
);

export default BackgroundEffects;  