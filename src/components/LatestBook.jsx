import React from 'react';
import { StructuredText } from 'react-datocms';
import { GatsbyImage, getImage } from "gatsby-plugin-image"

export default function LatestBook({latest}) {
  const image = getImage(latest.bookCover);
  return(
    <section className="latest">
      <h2>Latest Release</h2>
      <h3>{latest.title}</h3>
      <GatsbyImage image={image} alt={latest.title} />
      <StructuredText data={latest.description.value}/> 
    </section>
  )
}