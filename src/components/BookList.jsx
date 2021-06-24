import React from 'react';

export default function BookList({books}) {
  return(
    <ul className="booklist">
      {books.map(book => {
        return (
          <li>
            <h2>{book.title}</h2>
          </li>
        )
      })}
    </ul>
  )
}