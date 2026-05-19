import React from "react";
import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { StructuredText } from "react-datocms";
import { Button, Row, Col } from "react-bootstrap";

export default function About({ aboutTextIntro, authorPhoto }) {
  return (
    <>
      <Row>
        <Col className="mt-5">
          <center>
            <GatsbyImage image={getImage(authorPhoto)} alt="Author Renee Ross" />
          </center>
        </Col>
        <Col className="mt-5">
          <StructuredText data={aboutTextIntro} />
          <Link to="/about">
            <Button variant="secondary" className="aboutbtn">
              More About Author
            </Button>
          </Link>
        </Col>
      </Row>
    </>
  );
}
