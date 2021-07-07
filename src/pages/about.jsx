import * as React from "react";
import {graphql} from 'gatsby';
import Layout from '../components/Layout';
import { StructuredText } from 'react-datocms';


// markup
const about = ({data}) => {
  console.log(data);
  return (
    <Layout>
      <h2>About</h2>
      <StructuredText data={data.allDatoCmsHomepage.nodes[0].landingPageText.value} />
      <StructuredText data={data.allDatoCmsHomepage.nodes[0].landingPageBody.value} />
    </Layout>
  )
}

export default about

export const query = graphql`
  query About {
    allDatoCmsHomepage {
      nodes {
        landingPageBody {
          value
        }
        landingPageText {
          value
        }
      }
    }
}
`