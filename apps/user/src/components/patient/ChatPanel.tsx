'use client';

import { useState, useTransition } from 'react';
import { LoaderCircle, Send, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input } from '@clinsight/ui';

import { requestSecondOpinionAction } from '@/actions/patient-data';
import { useFloChat } from '@/hooks/useFloChat';
import type { ChatMessage } from '@/lib/patient-api';

function messageText(content: ChatMessage['content']) {
	if (typeof content === 'object' && content && 'text' in content) return String(content.text ?? '');
	if (typeof content === 'string') return content;
	return JSON.stringify(content);
}

export function ChatPanel({
	caseId,
	messages: initialMessages,
	suggestedQuestions = [],
	hasLabs = false,
}: {
	caseId: string;
	messages: ChatMessage[];
	suggestedQuestions?: string[];
	hasLabs?: boolean;
}) {
	const iceBreakers =
		suggestedQuestions.length > 0
			? suggestedQuestions
			: hasLabs
				? ['Explain my results in simple terms', 'Which values should I ask my doctor about?', 'Are any of these results urgent?']
				: [];
	const [text, setText] = useState('');
	const [pending, startTransition] = useTransition();
	const { messages, streaming, connected, send } = useFloChat(caseId, initialMessages);

	const submit = (value: string) => {
		if (!value.trim()) return;
		send(value);
		setText('');
	};

	const secondOpinion = () => {
		startTransition(async () => {
			const result = await requestSecondOpinionAction(caseId);
			if (!result.ok) {
				toast.error(result.message);
				return;
			}
			toast.success('Your second-opinion request has been sent.');
		});
	};

	return (
		<section aria-labelledby="chat-heading" className="space-y-4">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h2 id="chat-heading" className="text-lg font-semibold text-gray-900">
					Chat with Flo
				</h2>
				<span className="text-xs text-slate-500">{connected ? 'Flo is online' : 'Connecting to Flo…'}</span>
				<Button size="sm" variant="outline" onClick={secondOpinion} disabled={pending} className="gap-2">
					<Stethoscope aria-hidden="true" className="size-4" />
					Get a doctor’s second opinion
				</Button>
			</div>

			<div className="max-h-120 space-y-3 overflow-y-auto rounded-xl border border-outline-border bg-white p-4">
				{messages.length === 0 ? (
					<p role="status" className="py-8 text-center text-sm text-slate-600">
						Ask a question about your results to start the conversation.
					</p>
				) : (
					<>
						{messages.map((message) => {
						const mine = message.sender_type === 'patient';
						return (
							<div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
								<p
									className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
										mine
											? 'rounded-tr-none bg-primary-blue text-white'
											: 'rounded-tl-none bg-slate-100 text-gray-800'
									}`}
								>
									{messageText(message.content)}
								</p>
							</div>
						);
					})}
					{streaming !== null ? (
						<div className="flex justify-start">
							<p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tl-none bg-slate-100 px-4 py-2.5 text-sm text-gray-800">
								{streaming || <span className="text-slate-500">Flo is thinking…</span>}
							</p>
						</div>
						) : null}
					</>
				)}
			</div>

			{iceBreakers.length > 0 ? (
				<div className="flex flex-wrap gap-2" aria-label="Suggested questions">
					{iceBreakers.map((question) => (
						<Button
							key={question}
							size="xs"
							variant="outline"
							disabled={pending}
							onClick={() => submit(question)}
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
					submit(text);
				}}
			>
				<Input
					value={text}
					onChange={(event) => setText(event.target.value)}
					placeholder="Ask Flo about your results…"
					aria-label="Message"
					className="flex-1"
				/>
				<Button type="submit" variant="brand" disabled={pending || !text.trim()} className="gap-2">
					{pending ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Send aria-hidden="true" className="size-4" />}
					Send
				</Button>
			</form>
			<p className="text-xs text-slate-500">
				Clinsight provides AI-powered explanations, not medical diagnoses.
			</p>
		</section>
	);
}
