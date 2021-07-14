import React from "react"
import { Link } from 'gatsby';
import { createGlobalStyle } from "styled-components"
import "@fontsource/tangerine";
import "@fontsource/raleway";
import Menu from './Menu';
import Footer from './Footer';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container'



const GlobalStyle = createGlobalStyle`
  body {
    color: #FCFDFE;
    margin: 0;
    font-family: 'Poppins', sans-serif;
    font-weight: 200; 
    h1 {
      font-family: 'Tangerine', script; 
    }
    h2, h3, h4, h5, h6 {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .05rem; 
      &:hover {
      text-shadow: 2px 2px 40px #a81010;
    }
    }
  }
`

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
      text-shadow: 2px 2px 40px #a81010;
    }
  }

  [role] {
    font-family: 'Raleway', serif;
    font-size: 1.3rem;
  }
`;

export default function Layout({ children }) {
  return (
    <>
      <GlobalStyle />
      <Menu />
      <Logo><Link to='/'>Renee Ross Books</Link>
        <div role="doc-subtitle">Gothic Romance the Way You Remember...</div>
        </Logo>
      <Container fluid>
        {children}
      </Container>
      <Footer/>
    </>
  )
}