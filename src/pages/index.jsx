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
      <Row className="spacer"> &nbsp; </Row>
      <Row className="bg-dark p-3 pb-0">
        <Col sm={8}>
          <LatestBook latest={data.allDatoCmsBook.nodes[0]} />
        </Col>
        <Col sm={4}>
            <Subscribe />
        </Col>
      </Row>
      <Row className="spacer"> &nbsp; </Row>
      <Row className="bg-dark p-3 pb-0">
        <Col md={{ span: 6, offset: 3 }}>
          <About 
            aboutTextIntro={data.allDatoCmsHomepage.nodes[0].landingPageText}
            aboutTextBody={data.allDatoCmsHomepage.nodes[0].landingPageBody}
          />
        </Col>
      </Row>
      <Row className="spacer"> &nbsp; </Row>
      <Row>
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
    allDatoCmsBook {
      nodes {
        bookCover {
          gatsbyImageData
        }
        slug
        title
        description {
          value
        }
      }
    }
  }
`