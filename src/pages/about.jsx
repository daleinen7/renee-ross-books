import * as React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import { StaticImage } from "gatsby-plugin-image";
import { StructuredText } from "react-datocms";
import { Row, Col } from "react-bootstrap";

const about = ({ data }) => {
  console.log(data);
  return (
    <Layout
      title="Renee Ross Books | About"
      metaDescription="About Renee Ross the Author."
    >
      <Row style={{ backgroundColor: "#000" }}>
        <Col md={{ span: 8, offset: 2 }} className="mt-5 mb-5"></Col>
        <h3 className="header">
          <span>About the Author</span>
        </h3>
        <Col md={{ span: 8, offset: 2 }} className="mt-5 mb-5">
          <img
            src={
              data.allDatoCmsAuthorPhoto.nodes[0].authorPhoto.gatsbyImageData
                .images.fallback.src
            }
            style={{ float: "left", marginRight: "1rem" }}
            alt="Author Renee Ross"
          />
          <StructuredText
            data={data.allDatoCmsHomepage.nodes[0].landingPageText.value}
          />
          <StructuredText
            data={data.allDatoCmsHomepage.nodes[0].landingPageBody.value}
          />
        </Col>
      </Row>
    </Layout>
  );
};

export default about;

export const query = graphql`
  query About {
    allDatoCmsHomepage {
      nodes {
        landingPageBody {
          value
        }
        landingPageText {
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
  }
`;
