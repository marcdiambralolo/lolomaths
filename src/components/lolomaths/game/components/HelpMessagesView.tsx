import React from 'react';

interface HelpMessagesViewProps {
  messages: string[];
}

export const HelpMessagesView: React.FC<HelpMessagesViewProps> = ({ messages }) => {
  if (messages.length === 0) return null;

  return (
    <div className="p-2 text-center text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
      {messages.map((msg, idx) => (
        <div key={idx}>{msg}</div>
      ))}
    </div>
  );
};