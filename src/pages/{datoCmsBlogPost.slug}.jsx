import React from 'react';
import {graphql} from 'gatsby';
import { StructuredText } from 'react-datocms';
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Layout from '../components/Layout';

export default function BlogPost({data}) {
  console.log(data);
  const image = getImage(data.datoCmsBlogPost.image)
  return(
    <Layout>
        <h2>{data.datoCmsBlogPost.title}</h2>
        <GatsbyImage
          image={image}
          alt={data.datoCmsBlogPost.title}
          style={{ boxShadow: "1px 1px 1px 1px gray, 10px 10px 0 1px white", margin: "20px 50px", float: "left" }}
          className="zoom"
        />
        <StructuredText data={data.datoCmsBlogPost.content} />
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
      image {
        gatsbyImageData(
          width: 340
          placeholder: BLURRED
        )
      }
    }
  }
`;