import React from 'react';
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import {
  Row, 
  Col
} from 'react-bootstrap';


export default function BookList({books}) {
  return (
  <>
    { books.map((book, idx) => {
      return (
        <Col sm key={idx} bg="dark" className="mb-5">
          <Row className="p-3" style={{height: "100px", padding: "5px"}}>
            <h4>
              <center>
                {book.title}
              </center>
            </h4>
          </Row>
          <Row style={{ height: "400px", padding: "10px"}}>
            <GatsbyImage image={getImage(book.bookCover)} className="zoom" alt={books.title} style={{ border: "1px solid #fff"}} />
            </Row>
      </Col>
    )
            
    })}
      </>
  )
}