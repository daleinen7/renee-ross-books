import React from "react";
import Layout from "../components/Layout";
// import TAFHepub from "../freeBook/Terror_at_Fairmont_Hall.epub";
// import TAFHmobi from "../freeBook/Terror_at_Fairmont_Hall.mobi";
// import TAFHpdf from "../freeBook/Terror_at_Fairmont_Hall.pdf";
import { Row, Col } from "react-bootstrap";

export default function success() {
  return (
    <Layout title="Subscribed" metaDescription="Success message">
      <Row style={{ backgroundColor: "#000" }}>
        <Col md={{ span: 8, offset: 2 }} className="mt-5 mb-5 blog">
          <h2>Thank you for subscribing to our mailing list!</h2>
          <p>Please enjoy this free novella!</p>
          <ul>
            <li>
              <a href={"/public/Terror_at_Fairmont_Hall.epub"} download>
                Terror at Fairmont Hall (epub)
              </a>
            </li>
            <li>
              <a href={"/public/Terror_at_Fairmont_Hall.mobi"} download>
                Terror at Fairmont Hall (mobi)
              </a>
            </li>
            <li>
              <a href={"/public/Terror_at_Fairmont_Hall.pdf"} download>
                Terror at Fairmont Hall (pdf)
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Layout>
  );
}
