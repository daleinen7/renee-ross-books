import * as React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import About from "../components/About";
import BookList from "../components/BookList";
import LatestBook from "../components/LatestBook";
import Subscribe from "../components/Subscribe";
import "../styles/global.scss";
import { Row, Col } from "react-bootstrap";

const IndexPage = ({ data }) => {
  return (
    <Layout
      title="Renee Ross Books"
      metaDescription="Gothic Romance the way you remember it. A site for Author Renee Ross."
    >
      <Row style={{ backgroundColor: "#0a080c" }}>
        <Col className="col-8" lg={8} md={12} sm={12} xs={12}>
          <LatestBook latest={data.allDatoCmsBook.nodes[0]} />
        </Col>
        <Col className="col-4" lg={4} md={12} sm={12} xs={12}>
          <Subscribe />
        </Col>
      </Row>
      <Row>
        <Col className="spacer">&nbsp;</Col>
      </Row>
      <Row style={{ backgroundColor: "#0a080c" }}>
        <Col md={{ span: 6, offset: 3 }} className="mt-5 mb-5">
          <h3 className="header">
            <span>About the Author</span>
          </h3>
          <About
            authorPhoto={data.allDatoCmsAuthorPhoto.nodes[0].authorPhoto}
            aboutTextIntro={data.allDatoCmsHomepage.nodes[0].landingPageText}
            aboutTextBody={data.allDatoCmsHomepage.nodes[0].landingPageBody}
          />
        </Col>
      </Row>
      <Row>
        <Col className="spacer">&nbsp;</Col>
      </Row>
      <Row style={{ backgroundColor: "#0a080c" }} className="mt-5 mb-5 pt-5">
        <BookList books={data.allDatoCmsBook.nodes} />
      </Row>
    </Layout>
  );
};

export default IndexPage;

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
    allDatoCmsAuthorPhoto {
      nodes {
        authorPhoto {
          gatsbyImageData
        }
      }
    }
    allDatoCmsBook(sort: { fields: publishDate, order: DESC }) {
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
`;
