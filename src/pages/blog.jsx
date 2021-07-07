import * as React from "react";
import {graphql, Link} from 'gatsby';
import Layout from '../components/Layout';
import About from '../components/About';


// markup
const blog = ({data}) => {
  return (
    <Layout>
      <h2>Blog</h2>
      {data.allDatoCmsBlogPost.nodes.map(post => (
        <li>
          <Link to={`/${post.slug}`}>{post.title}</Link>
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
      content {
        value
      }
    }
  }
}
`