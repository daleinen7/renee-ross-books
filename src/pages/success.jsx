import React from "react";
import Layout from "../components/Layout";
import { Row, Col, Button } from "react-bootstrap";

export default function success() {
  return (
    <Layout title="Subscribed" metaDescription="Success message">
      <Row style={{ backgroundColor: "#000" }}>
        <Col md={{ span: 8, offset: 2 }} className="mt-5 mb-5">
          <h3 className="header">
            <span>You're Subscribed!</span>
          </h3>
        </Col>
        <Col md={{ span: 8, offset: 2 }} className="mt-2 mb-2 novella">
          <h2>Thank you for subscribing to our mailing list!</h2>
          <p style={{ padding: "1rem 0" }}>
            Please enjoy this free novella! In addition, you will be notified
            about new releases, discounts or free promotions and occasional
            giveaways.
          </p>
          <ul>
            <li className="p-2">
              <a href={"/Terror_at_Fairmont_Hall.epub"} download>
                <Button variant="secondary" style={{ width: "200px" }}>
                  Download "Terror at Fairmont Hall" (epub)
                </Button>
              </a>
            </li>
            <li className="p-2">
              <a href={"/Terror_at_Fairmont_Hall.mobi"} download>
                <Button variant="secondary" style={{ width: "200px" }}>
                  Download "Terror at Fairmont Hall" (mobi)
                </Button>
              </a>
            </li>
            <li className="p-2">
              <a href={"/Terror_at_Fairmont_Hall.pdf "} download>
                <Button variant="secondary" style={{ width: "200px" }}>
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
