import React from 'react';
import {graphql} from 'gatsby';
import { StructuredText } from 'react-datocms';
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Layout from '../components/Layout';
import moment from 'moment';
import {
  Row, 
  Col
} from 'react-bootstrap';

export default function BlogPost({data}) {
  const image = getImage(data.datoCmsBlogPost.image)
  return(
    <Layout>
      <Row style={{ backgroundColor: "#000" }}>
        <Col  md={{ span: 8, offset: 2 }} className="mt-5 mb-5">
        <h2>{data.datoCmsBlogPost.title}</h2>
        <p>{moment(data.datoCmsBlogPost.meta.firstPublishedAt).format("MMM Do YY")}</p>
        <GatsbyImage
          image={image}
          alt={data.datoCmsBlogPost.title}
          style={{ boxShadow: "1px 1px 15px 0px gray", margin: "20px 50px", float: "left" }}
          className="zoom"
        />
          <StructuredText data={data.datoCmsBlogPost.content} />
        </Col>
        </Row>
    </Layout>
  )
}

export const blogQuery = graphql`
  query ($slug: String!) {
    datoCmsBlogPost(slug: {eq: $slug}) {
      title
      slug
      content {
        value
      }
      meta {
        firstPublishedAt
      }
      image {
        gatsbyImageData(
          width: 340
          placeholder: BLURRED
        )
      }
    }
  }
`;