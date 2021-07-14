import * as React from "react";
import {graphql, Link} from 'gatsby';
import Layout from '../components/Layout';
import moment from 'moment';

// markup
const blog = ({data}) => {
  return (
    <Layout title="Renee Ross Books | Blog" metaDescription="List of blog posts for Renee Ross">
      <h2>Blog</h2>
      {data.allDatoCmsBlogPost.nodes.map(post => (
        <li>
          <Link to={`/${post.slug}`}>{post.title}</Link>
          {moment(post.meta.firstPublishedAt).format("MMM Do YY")}
        </li>
      ))}
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