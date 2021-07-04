import React, { useState } from 'react';
import { Link } from "gatsby"; 
import { StaticImage } from "gatsby-plugin-image"
import { StructuredText } from 'react-datocms';
import {
  Button,
  Fade,
  Row,
  Col
} from 'react-bootstrap';

export default function About({ aboutTextIntro, aboutTextBody }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Row>
        <Col className="mt-5">
          <center>
            <StaticImage src="../images/Author.jpg" alt="Author Renee Ross" />
          </center>
        </Col>
        <Col className="mt-5">
            <StructuredText data={aboutTextIntro} />
            <Link to="/about">
              <center>
                <Button variant="secondary" className="aboutbtn">Read More</Button>
              </center>
          </Link>
        </Col>
      </Row>

      {/* <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-fade-text"
        aria-expanded={open}
        variant="light"
      >
        Read More
      </Button>
      <Fade in={open}>
        <div id="example-fade-text">
          <StructuredText data={aboutTextBody}/> 
        </div>
      </Fade> */}
    </>
  );
}
