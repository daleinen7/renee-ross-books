import React from 'react';
import { GatsbyImage, getImage } from "gatsby-plugin-image"


export default function BookList({books}) {
  return(
    <ul className="booklist">
      {books.map((book, idx) => {
        return (
          <li key={idx}>
            <h2>{book.title}</h2>
            <GatsbyImage image={getImage(book.bookCover)} alt={books.title} />
          </li>
        )
      })}
    </ul>
  )
}