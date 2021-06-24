import React from 'react';
import {graphql} from 'gatsby';
import { StructuredText } from 'react-datocms';
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from '../components/Layout';

export default function Book({data}) {
  const image = getImage(data.datoCmsBook.bookCover)
  return(
    <Layout>
      <h2>{data.datoCmsBook.title}</h2>
      <GatsbyImage image={image} alt={data.datoCmsBook.title} />
      <StructuredText data={data.datoCmsBook.description}/>
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