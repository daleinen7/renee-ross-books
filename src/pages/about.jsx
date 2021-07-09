import * as React from "react";
import {graphql} from 'gatsby';
import Layout from '../components/Layout';
import { StructuredText } from 'react-datocms';
import {
  Row, 
  Col
} from 'react-bootstrap';

// markup
const about = ({data}) => {
  console.log(data);
  return (
    <Layout>
      <Row style={{ backgroundColor: "#212629" }}>
        <Col  md={{ span: 8, offset: 2 }} className="mt-5 mb-5">
          <h2>About</h2>
          <StructuredText data={data.allDatoCmsHomepage.nodes[0].landingPageText.value} />
          <StructuredText data={data.allDatoCmsHomepage.nodes[0].landingPageBody.value} />
        </Col>
      </Row>
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