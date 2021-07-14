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
        <>
          <Col
            xxl={2}
            xl={2}
            lg={6}
            md={12}
            sm={12}
            xs={12}
          className="mb-5">
          <Row>
            <h3 className="book-title">
              <center>
                {book.title}
              </center>
            </h3>

            <Link to={`/${book.slug}`} alt={book.bookCover}>
                <span className="screen-reader-text">{books.title}</span>
                <center>
                  <GatsbyImage image={getImage(book.bookCover)} className="zoom" alt={books.title} style={{ border: "1px solid #fff" }} />
                  </center>
              </Link>
          </Row>
              </Col>
        </>
    )
            
    })}
      </>
  )
}