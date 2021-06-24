import * as React from "react";
import {graphql} from 'gatsby';
import { StructuredText } from 'react-datocms';
import Layout from '../components/Layout';
import About from '../components/About';

// markup
const IndexPage = ({data}) => {
  // console.log(data.allDatoCmsHomepage.nodes.landingPageText);
  console.log(data);
  return (
    <Layout>
      <About aboutText={data.allDatoCmsHomepage.nodes[0].landingPageText}/>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query landingPage {
    allDatoCmsHomepage {
      nodes {
        landingPageText {
          value
        }
      }
    }
    allDatoCmsBook {
      nodes {
        bookCover {
          gatsbyImageData
        }
        slug
        title
      }
    }
  }
`