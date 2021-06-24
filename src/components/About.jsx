import React from 'react'
import { StructuredText } from 'react-datocms';

export default function ({aboutText}) {
  return(
    <>
      <StructuredText data={aboutText}/>
    </>
  )
}