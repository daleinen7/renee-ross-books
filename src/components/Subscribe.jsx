import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { navigate } from 'gatsby';

const KIT_FORM_ACTION = process.env.GATSBY_KIT_FORM_ACTION;
const SUCCESS_PATH = '/success';

function subscribeToKit(name, email) {
	const body = new FormData();
	body.append('email_address', email);
	body.append('fields[first_name]', name);
	return fetch(KIT_FORM_ACTION, {
		method: 'POST',
		headers: { Accept: 'application/json' },
		body,
	}).then((res) => res.json());
}

function saveToNetlify(form) {
	return fetch('/', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams(new FormData(form)).toString(),
	});
}

export default function Subscribe() {
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	async function handleSubmit(event) {
		event.preventDefault();
		const form = event.currentTarget;
		const name = form.elements.name.value.trim();
		const email = form.elements.email.value.trim();
		setSubmitting(true);
		setError('');

		const [kit, netlify] = await Promise.allSettled([
			KIT_FORM_ACTION
				? subscribeToKit(name, email)
				: Promise.reject(new Error('Kit form action not configured')),
			saveToNetlify(form),
		]);

		const kitOk = kit.status === 'fulfilled' && kit.value.status !== 'failed';
		const netlifyOk = netlify.status === 'fulfilled' && netlify.value.ok;

		if (kitOk || netlifyOk) {
			navigate(SUCCESS_PATH);
			return;
		}
		setSubmitting(false);
		setError('Something went wrong. Please try again.');
	}

	return (
		<Card
			id="subscribe"
			className="shadow-sm mb-5 mt-5 bg-info text-dark rounded"
			border="secondary"
		>
			<Card.Title as="h2" className="subscribe-title">
				Subscribe to our mailing list to receive:
			</Card.Title>
			<ul className="subscribe">
				<li>A free novella, &ldquo;Terror at Fairmont Hall&rdquo;</li>
				<li>News about book releases, discounts, and freebies</li>
			</ul>
			<form
				className="subscribe-form"
				name="subscribe"
				method="POST"
				action={SUCCESS_PATH}
				data-netlify="true"
				data-netlify-honeypot="bot-field"
				onSubmit={handleSubmit}
			>
				<input type="hidden" name="form-name" value="subscribe" />
				<p className="subscribe-honeypot">
					<label htmlFor="bot-field">
						Leave this field empty
						<input id="bot-field" name="bot-field" tabIndex={-1} autoComplete="off" />
					</label>
				</p>
				<label htmlFor="subscribe-name">Name</label>
				<input
					id="subscribe-name"
					type="text"
					name="name"
					autoComplete="name"
					required
				/>
				<label htmlFor="subscribe-email">Email</label>
				<input
					id="subscribe-email"
					type="email"
					name="email"
					autoComplete="email"
					required
				/>
				<input
					className="submitButton"
					type="submit"
					value={submitting ? 'SIGNING UP…' : 'SIGN UP'}
					disabled={submitting}
				/>
				{error && (
					<p className="subscribe-error" role="alert">
						{error}
					</p>
				)}
			</form>
		</Card>
	);
}
