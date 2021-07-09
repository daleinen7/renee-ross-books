import React from 'react';
import { Link } from 'gatsby';
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
            <h5>
              <center>
                {book.title}
              </center>
            </h5>
          </Row>
          <Row style={{ height: "400px", padding: "10px"}}>
            <Link to={`/${book.slug}`}>
              <GatsbyImage image={getImage(book.bookCover)} className="zoom" alt={books.title} style={{ border: "1px solid #fff"}} />
            </Link>
            </Row>
      </Col>
    )
            
    })}
      </>
  )
}