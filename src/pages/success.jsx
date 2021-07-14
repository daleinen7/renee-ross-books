import React from 'react';
import Layout from '../components/Layout';
import {
  Row, 
  Col
} from 'react-bootstrap';

export default function success() {
  return(
    <Layout>
      <Row style={{ backgroundColor: "#000" }} >
        <Col  md={{ span: 8, offset: 2 }} className="mt-5 mb-5 blog">
        <h2>Thank you for subscribing to our mailing list!</h2>
        </Col>
      </Row>
    </Layout>
  )
}