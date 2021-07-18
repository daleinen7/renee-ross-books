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
    <h3 className="header"><span>Book List</span></h3>
    { books.map((book, idx) => {
      return (
        <Col
          xxl={2}
          xl={2}
          lg={6}
          md={12}
          sm={12}
          xs={12}
          className="mb-5"
          key={idx}
        >
          <Row className="mt-5">
            <h3 className="book-title">
              <center>
                {book.title}
              </center>
            </h3>

            <Link to={`/${book.slug}`} alt={book.bookCover}>
              <span className="screen-reader-text">{book.title}</span>
              <center>
                <GatsbyImage image={getImage(book.bookCover)} className="zoom" alt={book.title} style={{ border: "1px solid #fff" }} />
              </center>
            </Link>
          </Row>
        </Col>
    )
            
    })}
      </>
  )
}