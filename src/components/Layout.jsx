import React from "react"
import { createGlobalStyle } from "styled-components"
import { StaticImage } from 'gatsby-plugin-image';
import "@fontsource/tangerine"
import "@fontsource/raleway"
import Menu from './Menu';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #202122;
    background: url();
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
export default function Layout({ children }) {
  return (
    <>
      <StaticImage className="bg" src="../images/HeaderwotextDark.jpg" />
      <GlobalStyle />
      <h1>Renee Ross Books</h1>
      <Menu/>
      {children}
    </>
  )
}