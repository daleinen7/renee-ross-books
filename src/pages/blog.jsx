import * as React from "react";
import {graphql, Link} from 'gatsby';
import Layout from '../components/Layout';
import moment from 'moment';
import {
  Row, 
  Col,
  Button
} from 'react-bootstrap';

// markup
const blog = ({data}) => {
  return (
    <Layout title="Renee Ross Books | Blog" metaDescription="List of blog posts for Renee Ross">
      <Row style={{ backgroundColor: "#000" }} >
        <Col md={{ span: 8, offset: 2 }} className="mt-5 mb-5 blog">
          <h3 className="header"><span>Blog Posts</span></h3>
        </Col>
            {data.allDatoCmsBlogPost.nodes.map((post, idx) => (
              <Col
                xs={6}
                md={4}
                className="m-5 blog p-5"
                style={{ backgroundColor: "gray"}}
                key={idx}>
                published on {moment(post.meta.firstPublishedAt).format("MMM Do 'YY")}
                <br />
                <span className="blog-title">
                  {post.title}
                </span>
                <Link to={`/${post.slug}`} className="blog-link">
                  <br />
                  <div className="d-grid gap-2 mt-3">
                    <Button variant="secondary">
                      Read here
                    </Button>
                  </div>
                </Link>
        </Col>
            ))}
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