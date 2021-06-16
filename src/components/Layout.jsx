import React from "react"
import { createGlobalStyle } from "styled-components"
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #202122;
  }
`
export default function Layout({ children }) {
  return (
    <>
      <GlobalStyle />
      <h1>Renee Ross Books</h1>
      {children}
    </>
  )
}