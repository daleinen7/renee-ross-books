import React from 'react';
import { Link } from 'gatsby';
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import {
  Row, 
  Col
} from 'react-bootstrap';

import styled from 'styled-components';

const StyledDiv = styled.section`
  h2 {
    font-size: 1.2rem;
  }
  h3 {
    font-size: 1.1rem;
  }
`;

export default function BookList({books}) {
  return (
  <>
    <h2><center>Book List</center></h2>
    { books.map((book, idx) => {
      return (
        <Col sm key={idx} bg="dark" className="mb-5">
          <Row className="p-3" style={{height: "100px", padding: "5px"}}>
            <h3 className="book-title">
              <center>
                {book.title}
              </center>
            </h3>
          </Row>
          <Row style={{ height: "400px", padding: "10px"}}>
            <Link to={`/${book.slug}`} alt={book.bookCover}>
              <span className="screen-reader-text">{books.title}</span>
              <GatsbyImage image={getImage(book.bookCover)} className="zoom" alt={books.title} style={{ border: "1px solid #fff"}} />
            </Link>
          </Row>
      </Col>
    )
            
    })}
      </>
  )
}