import * as React from "react";
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import About from '../components/About';
import BookList from '../components/BookList';
import LatestBook from '../components/LatestBook';
import Subscribe from '../components/Subscribe';
import "../styles/global.scss";
import {
    Row,
    Col
} from 'react-bootstrap';

// markup
const IndexPage = ({data}) => {
  return (
    <Layout>
      <Row style={{backgroundColor: "#000000"}}>
        <Col className="col-8">
          <LatestBook latest={data.allDatoCmsBook.nodes[0]} />
        </Col>
        <Col className="col-4">
          <Subscribe />
        </Col>
      </Row>
      <Row>
        <Col className="spacer">
          &nbsp; 
        </Col>
      </Row>
      <Row style={{backgroundColor: "#000000"}}>
        <Col md={{ span: 6, offset: 3 }} className="mt-5 mb-5">
          <h3 className="header"><span>About the Author</span></h3>
          <About 
            aboutTextIntro={data.allDatoCmsHomepage.nodes[0].landingPageText}
            aboutTextBody={data.allDatoCmsHomepage.nodes[0].landingPageBody}
          />
        </Col>
      </Row>
      <Row>
        <Col className="spacer">
          &nbsp; 
        </Col>
      </Row>
      <Row style={{backgroundColor: "#000000"}}>
        <BookList books={data.allDatoCmsBook.nodes} />
      </Row>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query landingPage {
    allDatoCmsHomepage {
      nodes {
        landingPageText {
          value
        }
        landingPageBody {
          value
        }
      }
    }
    allDatoCmsBook(sort: {fields: meta___firstPublishedAt, order: DESC}) {
      nodes {
        title
        slug
        description {
          value
        }
        bookCover {
          gatsbyImageData
        }
        meta {
          firstPublishedAt
        }
      }
    }
  }
`