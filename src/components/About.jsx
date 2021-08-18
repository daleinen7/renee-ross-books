import React from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { StructuredText } from "react-datocms";
import { Button, Row, Col } from "react-bootstrap";

export default function About({ aboutTextIntro, authorPhoto }) {
  const image = authorPhoto.gatsbyImageData.images.fallback.src;
  return (
    <>
      <Row>
        <Col className="mt-5">
          <center>
            <img src={image} alt="Author Renee Ross" />
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
