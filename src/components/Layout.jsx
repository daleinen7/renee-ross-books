import React from "react"
import { Link } from 'gatsby';
import { createGlobalStyle } from "styled-components"
import { StaticImage } from 'gatsby-plugin-image';
import "@fontsource/tangerine"
import "@fontsource/raleway"
import Menu from './Menu';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';


const GlobalStyle = createGlobalStyle`
  body {
    background-color: #202122;
    color: #FCFDFE;
    margin: 0;

    font-family: 'Raleway', sans-serif;

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Tangerine', serif;
    }

    .bg {
      top: 0;
      position: absolute;
      z-index: -5;
    }
  }
`
const Logo = styled.h1`
  font-size: 96px;
  margin: 2rem 0 2rem 2rem;
  text-shadow: 7px 7px 4px #202020;

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
      <StaticImage className="bg" src="../images/HeaderwotextDark.jpg" />
      <GlobalStyle />
      <Logo><Link to='/'>Renee Ross Books</Link>
      <div role="doc-subtitle">Gothic Romance the Way You Remember...</div>
      </Logo>
      <Menu/>
      <Container>{children}</Container>
    </>
  )
}