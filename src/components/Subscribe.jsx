import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';

export default function Subscribe() {
	useEffect(() => {
		const script = document.createElement('script');
		// script['data-form'] = '0e812940-80b3-11ef-b8ee-b9da8a9bf8bc'
		script.async = true;
		script.src =
			'https://eomail5.com/form/0e812940-80b3-11ef-b8ee-b9da8a9bf8bc.js';
		script.setAttribute('data-form', '0e812940-80b3-11ef-b8ee-b9da8a9bf8bc');
		console.log(script);
		document.querySelector('#subscribe').append(script);
	}, []);

	return <div id="subscribe"></div>;
}
