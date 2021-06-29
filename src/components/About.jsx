import React, { useState } from 'react';
import { render } from 'react-dom';
import { StructuredText } from 'react-datocms';
import {
  Collapse,
  Button,
  Fade
} from 'react-bootstrap';

export default function About({ aboutText }) {

  const [open, setOpen] = useState(false);

  return (
    <>
      <StructuredText data={aboutText}/> 
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
          How the hell do I put some of it here?? 
        </div>
      </Fade>
    </>
  );
  render(<About />);
}
  // return(
  //   <>
      
  //     <StructuredText data={aboutText}/> 
  //   </>
  // )
