import React from 'react';
import { StructuredText } from 'react-datocms';
import { GatsbyImage, getImage } from "gatsby-plugin-image";

export default function LatestBook({latest}) {
  const image = getImage(latest.bookCover);

  return(
    <section className="latest">
      <h2>Latest Release</h2>
      <h3>{latest.title}</h3>
      <GatsbyImage
        image={image}
        alt={latest.title}
        style={{ boxShadow: "1px 1px 15px 0px gray", margin: "20px 50px", float: "left"}}
      />
      <StructuredText data={latest.description.value} />
    </section>
  )
}