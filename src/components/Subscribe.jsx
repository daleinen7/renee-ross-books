import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';

export default function Subscribe() {
	useEffect(() => {
		const script = document.createElement('script');
		// script['data-form'] = 'be5ff0f4-84d6-11ef-a4c5-e557ffaeb4a6'
		script.async = true;
		script.src =
			'https://eomail5.com/form/be5ff0f4-84d6-11ef-a4c5-e557ffaeb4a6.js';
		script.setAttribute('data-form', 'be5ff0f4-84d6-11ef-a4c5-e557ffaeb4a6');
		console.log(script);
		document.querySelector('#subscribe').append(script);
	}, []);

	return <div id="subscribe"></div>;
}
