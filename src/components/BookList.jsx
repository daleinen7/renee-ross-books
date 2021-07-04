import React from 'react';
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import {
  CardDeck,
  Card
} from 'react-bootstrap';


export default function BookList({books}) {
  return(
    
    <CardDeck>
      {books.map((book, idx) => {
        return (
          <Card key={idx} bg="dark" style={{ width: "25rem" }} className="mb-5">
            <Card.Body>
      <Card.Title>{book.title}</Card.Title>
      <Card.Text>
          <GatsbyImage image={getImage(book.bookCover)} alt={books.title} />
              </Card.Text>
              </Card.Body>
      </Card>
        )
      })}
      </CardDeck>
  )
}