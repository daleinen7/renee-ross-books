import React from 'react';
import {graphql} from 'gatsby';
import { StructuredText } from 'react-datocms';
import Layout from '../components/Layout';
import styled from 'styled-components';

const StyledDiv = styled.div`
  
`;

export default function Book({data}) {
  console.log(data);
  return(
    <Layout>
      <h2>{data.datoCmsBook.title}</h2>
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
    }
  }
`;