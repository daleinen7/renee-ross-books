import React from 'react';
import {graphql} from 'gatsby';
import { StructuredText } from 'react-datocms';
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Layout from '../components/Layout';
import {
  Row, 
  Col
} from 'react-bootstrap';

export default function Book({data}) {
  const image = getImage(data.datoCmsBook.bookCover)
  return(
    <Layout>
      <Row style={{ backgroundColor: "#212629" }} className="p-5 mt-4">
        <center>
          <h2>{data.datoCmsBook.title}</h2>
        </center>
        <Col  md={{ span: 8, offset: 2 }} className="mt-5 mb-5">
          <GatsbyImage
            image={image}
            alt={data.datoCmsBook.title}
            style={{ boxShadow: "1px 1px 1px 1px gray, 10px 10px 0 1px white", margin: "20px 50px", float: "left" }}
            className="zoom"
            />
          <StructuredText data={data.datoCmsBook.description} />
        </Col>
      </Row>
    </Layout>
  )
}

export const query = graphql`
  query ($slug: String!) {
    datoCmsBook(slug: {eq: $slug}) {
      title
      slug
      id
      description {
        value
      }
      bookCover {
        gatsbyImageData(
          width: 340
          placeholder: BLURRED
        )
      }
    }
  }
`;