'use client';

import { useState, useTransition } from 'react';
import { Send, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input } from '@clinsight/ui';

import { guestChatAction } from '@/actions/patient-guest';

type Message = { id: string; sender_type: string; content: Record<string, unknown> };

function textOf(content: Record<string, unknown>) {
  return typeof content.text === 'string' ? content.text : JSON.stringify(content);
}

export function GuestChat({
  caseId,
  messages,
  questions,
  summary,
}: {
  caseId: string;
  messages: Message[];
  questions: string[];
  summary?: string;
}) {
  const [text, setText] = useState('');
  const [pending, startTransition] = useTransition();

  const send = (value: string) => {
    if (!value.trim()) return;
    startTransition(async () => {
      const result = await guestChatAction(caseId, value);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setText('');
    });
  };

  return (
    <section aria-labelledby="guest-chat-heading" className="space-y-3">
      <h2 id="guest-chat-heading" className="text-lg font-semibold text-gray-900">
        Chat with Flo
      </h2>
      <div className="max-h-100 space-y-3 overflow-y-auto rounded-xl border border-outline-border bg-white p-4">
        {summary && (
          <p className="whitespace-pre-wrap rounded-2xl bg-slate-100 px-4 py-3 text-sm text-gray-800">
            {summary}
          </p>
        )}
        {messages.length === 0 && !summary ? (
          <p role="status" className="py-8 text-center text-sm text-slate-600">
            Ask a question about your results.
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_type === 'patient' ? 'justify-end' : 'justify-start'}`}
            >
              <p
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  message.sender_type === 'patient'
                    ? 'rounded-tr-none bg-primary-blue text-white'
                    : 'rounded-tl-none bg-slate-100 text-gray-800'
                }`}
              >
                {textOf(message.content)}
              </p>
            </div>
          ))
        )}
      </div>
      {questions.length > 0 ? (
        <div className="flex flex-wrap gap-2" aria-label="Suggested questions">
          {questions.map((question) => (
            <Button
              key={question}
              size="xs"
              variant="outline"
              disabled={pending}
              onClick={() => send(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      ) : null}
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          send(text);
        }}
      >
        <Input
          value={text}
          onChange={(event) => setText(event.target.value)}
          aria-label="Message"
          placeholder="Ask Flo about your results…"
          className="flex-1"
        />
        <Button type="submit" variant="brand" disabled={pending || !text.trim()} className="gap-2">
          {pending ? (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <Send aria-hidden="true" className="size-4" />
          )}
          Send
        </Button>
      </form>
    </section>
  );
}
