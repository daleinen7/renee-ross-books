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
        style={{ boxShadow: "1px 1px 1px 1px gray, 10px 10px 0 1px white", margin: "20px 50px", float: "left"}}
      />
      <p>
        <StructuredText data={latest.description.value} />
      </p>

    </section>
  )
}