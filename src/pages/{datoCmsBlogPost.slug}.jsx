import React from 'react';
import {graphql, Link} from 'gatsby';
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
    <Layout title={`Renee Ross Books | ${data.datoCmsBlogPost.title}`} metaDescription={`"${data.datoCmsBlogPost.title}" by Author Renee Ross`}>
      <Row style={{ backgroundColor: "#000" }}>
        <Col md={{ span: 8, offset: 2 }} className="mt-3 mb-1">
          <Link to="/blog" style={{ color: "darkgrey", textDecoration: "none" }}>go back to blog post list</Link>
        </Col>
        <Col md={{ span: 8, offset: 2 }} className="mt-5 mb-5">
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
      <Row>
        <Col className="spacer2">
          &nbsp; 
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