import * as React from "react";
import {graphql, Link} from 'gatsby';
import Layout from '../components/Layout';
import moment from 'moment';
import {
  Row, 
  Col
} from 'react-bootstrap';

// markup
const blog = ({data}) => {
  return (
    <Layout title="Renee Ross Books | Blog" metaDescription="List of blog posts for Renee Ross">
      <Row style={{ backgroundColor: "#000" }} >
        <Col md={{ span: 8, offset: 2 }} className="mt-5 mb-5 blog">
          <h3 className="header"><span>Blog Posts</span></h3>
        </Col>
        <Col md={{ span: 8, offset: 2 }} className="mt-5 mb-5 blog">
          <ul>
            {data.allDatoCmsBlogPost.nodes.map((post, idx) => (
              <li key={idx}>
                <Link to={`/${post.slug}`}>{post.title}</Link> - Published on {moment(post.meta.firstPublishedAt).format("MMM Do 'YY")}
              </li>
            ))}
          </ul>
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

export default blog

export const query = graphql`
  query BlogIndex {
  allDatoCmsBlogPost {
    nodes {
      title
      slug
      meta {
        firstPublishedAt
      }
      content {
        value
      }
    }
  }
}
`