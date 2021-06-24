import React from 'react';

export default function BookList({books}) {
  return(
    <ul className="booklist">
      {books.map((book, idx) => {
        return (
          <li key={idx}>
            <h2>{book.title}</h2>
          </li>
        )
      })}
    </ul>
  )
}