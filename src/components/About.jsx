import React, { useState } from 'react';
import { StructuredText } from 'react-datocms';
import {
  Button,
  Fade
} from 'react-bootstrap';

export default function About({ aboutTextIntro,aboutTextBody }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <StructuredText data={aboutTextIntro}/> 
      <Button
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
      </Fade>
    </>
  );
}
