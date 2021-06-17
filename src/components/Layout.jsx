import React from "react"
import { createGlobalStyle } from "styled-components"
import "@fontsource/tangerine"
import "@fontsource/raleway"
import Menu from './Menu';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #202122;
    color: #FCFDFE;

    font-family: 'Raleway', sans-serif;

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Tangerine', serif;
    }
  }
`
export default function Layout({ children }) {
  return (
    <>
      <GlobalStyle />
      <h1>Renee Ross Books</h1>
      <Menu/>
      {children}
    </>
  )
}