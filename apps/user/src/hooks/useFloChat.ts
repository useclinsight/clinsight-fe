'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { getChatTokenAction } from '@/actions/patient-session';
import type { ChatMessage } from '@/lib/patient-api';

type WireMessage = {
	id: string;
	sender_type: 'patient' | 'ai' | 'file';
	content: string;
	sent_at: string;
	file?: ChatMessage['file'];
};

function websocketUrl(): string {
	const url = new URL(process.env.NEXT_PUBLIC_API_BASE_URL ?? '');
	url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
	url.pathname = '/api/v1/ws/chat';
	url.search = '';
	url.hash = '';
	return url.toString();
}

function toChatMessage(message: WireMessage, caseId: string): ChatMessage {
	return {
		id: message.id,
		medical_case_id: caseId,
		user_id: null,
		sender_type: message.sender_type,
		content: { text: message.content },
		file: message.file ?? null,
		sent_at: message.sent_at,
	};
}

/**
 * Authenticated chat with Flo over the backend WebSocket.
 *
 * The HTTP chat endpoint only persists a message — AI replies are produced by
 * the WebSocket endpoint, so the web app must use it to get answers back.
 */
export function useFloChat(caseId: string, initialMessages: ChatMessage[]) {
	const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
	const [streaming, setStreaming] = useState<string | null>(null);
	const [connected, setConnected] = useState(false);
	const socketRef = useRef<WebSocket | null>(null);
	const readyRef = useRef(false);
	const streamRef = useRef('');

	useEffect(() => {
		let active = true;
		let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

		const connect = async () => {
			const token = await getChatTokenAction();
			if (!active || !token) return;

			const socket = new WebSocket(websocketUrl());
			socketRef.current = socket;

			socket.onopen = () => {
				if (!active) return;
				socket.send(JSON.stringify({ type: 'init', case_id: caseId, token }));
			};

			socket.onmessage = (event) => {
				let data: Record<string, unknown>;
				try {
					data = JSON.parse(String(event.data)) as Record<string, unknown>;
				} catch {
					return;
				}

				switch (data.type) {
					case 'history': {
						const wire = (data.messages ?? []) as WireMessage[];
						setMessages(wire.map((message) => toChatMessage(message, caseId)));
						readyRef.current = true;
						setConnected(true);
						break;
					}
					case 'token': {
						streamRef.current += String(data.content ?? '');
						setStreaming(streamRef.current);
						break;
					}
					case 'done': {
						const text = streamRef.current.trim();
						if (text) {
							setMessages((current) => [
								...current,
								{
									id: String(data.message_id ?? crypto.randomUUID()),
									medical_case_id: caseId,
									user_id: null,
									sender_type: 'ai',
									content: { text },
									file: null,
									sent_at: new Date().toISOString(),
								},
							]);
						}
						streamRef.current = '';
						setStreaming(null);
						break;
					}
					case 'queued':
						toast.info(`Your message is queued (position ${data.position ?? 2}).`);
						break;
					case 'error':
						toast.error(String(data.detail ?? 'Flo could not answer that. Please try again.'));
						streamRef.current = '';
						setStreaming(null);
						break;
					case 'pong':
						break;
					default:
						break;
				}
			};

			socket.onclose = () => {
				readyRef.current = false;
				setConnected(false);
				if (active) reconnectTimer = setTimeout(() => void connect(), 3000);
			};

			socket.onerror = () => socket.close();
		};

		void connect();

		return () => {
			active = false;
			readyRef.current = false;
			if (reconnectTimer) clearTimeout(reconnectTimer);
			const socket = socketRef.current;
			socketRef.current = null;
			if (socket && socket.readyState < WebSocket.CLOSING) socket.close();
		};
	}, [caseId]);

	const send = useCallback(
		(value: string) => {
			const text = value.trim();
			if (!text) return;
			setMessages((current) => [
				...current,
				{
					id: `temp-${Date.now()}`,
					medical_case_id: caseId,
					user_id: null,
					sender_type: 'patient',
					content: { text },
					file: null,
					sent_at: new Date().toISOString(),
				},
			]);
			const socket = socketRef.current;
			if (!socket || socket.readyState !== WebSocket.OPEN || !readyRef.current) {
				toast.error('Flo is reconnecting. Please try again in a moment.');
				return;
			}
			streamRef.current = '';
			setStreaming('');
			socket.send(JSON.stringify({ type: 'message', content: text }));
		},
		[caseId],
	);

	return { messages, streaming, connected, send };
}
