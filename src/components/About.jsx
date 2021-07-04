import React, { useState } from 'react';
import { Link } from "gatsby"; 
import { StaticImage } from "gatsby-plugin-image"
import { StructuredText } from 'react-datocms';
import {
  Button,
  Fade
} from 'react-bootstrap';

export default function About({ aboutTextIntro,aboutTextBody }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <StaticImage src="../images/Author.jpg" alt="Author Renee Ross" />
      <StructuredText data={aboutTextIntro} />
      <Link to="/about">
        <center>
          <Button variant="secondary" className="aboutbtn">Read More</Button>
        </center>
      </Link>

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
