import React from "react";
import Layout from "../components/Layout";
import { Row, Col, Button } from "react-bootstrap";

export default function success() {
  return (
    <Layout title="Subscribed" metaDescription="Success message">
      <Row style={{ backgroundColor: "#000" }}>
        <Col md={{ span: 8, offset: 2 }} className="mt-5 mb-5 blog">
          <h2>Thank you for subscribing to our mailing list!</h2>
          <p>Please enjoy this free novella!</p>
          <ul>
            <li className="p-2">
              <a href={"/public/Terror_at_Fairmont_Hall.epub"} download>
                <Button variant="secondary">
                  Download "Terror at Fairmont Hall" (epub)
                </Button>
              </a>
            </li>
            <li className="p-2">
              <a href={"/public/Terror_at_Fairmont_Hall.mobi"} download>
                <Button variant="secondary">
                  Download "Terror at Fairmont Hall" (mobi)
                </Button>
              </a>
            </li>
            <li className="p-2">
              <a href={"/public/Terror_at_Fairmont_Hall.pdf "} download>
                <Button variant="secondary">
                  Download "Terror at Fairmont Hall" (pdf)
                </Button>
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Layout>
  );
}
