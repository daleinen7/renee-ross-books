import React from 'react'
import { StructuredText } from 'react-datocms';

export default function About({aboutText}) {
  return(
    <>
      <StructuredText data={aboutText}/>
    </>
  )
}