import React from 'react';
import {graphql} from 'gatsby';
import { StructuredText } from 'react-datocms';
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Layout from '../components/Layout';
import moment from 'moment';

export default function BlogPost({data}) {
  const image = getImage(data.datoCmsBlogPost.image)
  return(
    <Layout title={`Renee Ross Books | ${data.datoCmsBlogPost.title}`} metaDescription={`"${data.allDatoCmsBlogPost.title}" by Author Renee Ross`}>
        <h2>{data.datoCmsBlogPost.title}</h2>
        <p>{moment(data.datoCmsBlogPost.meta.firstPublishedAt).format("MMM Do YY")}</p>
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