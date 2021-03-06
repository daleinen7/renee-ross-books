import React from 'react';
import { Link } from 'gatsby';
import { createGlobalStyle } from 'styled-components';
import '@fontsource/tangerine';
import '@fontsource/raleway';
import Menu from './Menu';
import Footer from './Footer';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import { Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

const GlobalStyle = createGlobalStyle`
  body {
    color: #FCFDFE;
    margin: 0;
    font-family: 'Poppins', sans-serif;
    font-weight: 200; 
    h1 {
      font-family: 'Tangerine', script; 
      margin: 0;
      padding: 0;
    }
    h2, h3, h4, h5, h6 {
      margin: 0;
      padding: 0;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .05rem; 
    }
  }
`;

const Logo = styled.h1`
	font-size: 96px;
	margin: 2rem 0 2rem 2rem;
	text-shadow: 7px 7px 4px #202020;
	text-align: center;
	min-height: 200px;
	max-height: 200px;

	a {
		text-decoration: none;
		color: white;
		&:hover {
			text-shadow: 7px 7px 6px #584e75;
		}
	}

	[role] {
		font-family: 'Raleway', serif;
		font-size: 1.3rem;
	}
`;

export default function Layout({ children, title, metaDescription }) {
	return (
		<>
			<Container fluid className="min-vh-100">
				<GlobalStyle />
				<Helmet
					htmlAttributes={{
						lang: 'en',
					}}
				>
					<meta charSet="utf-8" />
					<title>{title}</title>
					<meta name="description" content={metaDescription} />
					{/* <link rel="canonical" href="http://mysite.com/example" /> */}
				</Helmet>
				<Row>
					<Menu />
				</Row>
				<Row className="logo-row">
					<Logo>
						<Link to="/">Renee Ross Books</Link>
						<div role="doc-subtitle">
							Gothic Romance the Way You Remember...
						</div>
					</Logo>
				</Row>
				{children}
				<Footer />
			</Container>
		</>
	);
}
