import * as React from "react";
import {graphql} from 'gatsby';
import Layout from '../components/Layout';
import About from '../components/About';


// markup
const about = ({data}) => {
  // console.log(data.allDatoCmsHomepage.nodes.landingPageText);
  console.log(data);
  return (
    <Layout>
      <h2>About</h2>
      <About aboutText={data.allDatoCmsHomepage.nodes[0].landingPageText}/>
    </Layout>
  )
}

export default about

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