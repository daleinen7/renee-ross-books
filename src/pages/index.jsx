import * as React from "react"
import {graphql} from 'gatsby';
import { StructuredText } from 'react-datocms';
import Layout from '../components/Layout';

// markup
const IndexPage = ({data}) => {
  console.log(data.allDatoCmsHomepage.nodes.landingPageText);
  return (
    <Layout>
      <StructuredText data={data.allDatoCmsHomepage.nodes[0].landingPageText}/>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query LandingPage {
    allDatoCmsHomepage {
      nodes {
        landingPageText {
          value
        }
      }
    }
  }
`