import React from 'react';
import {
  Row
} from 'react-bootstrap';

export default function Footer() {
  return(
    <footer>
      <Row expand="lg" className="p-4 navi bg-secondary footer">
        <p>Copyright &copy; {new Date().getFullYear()} Renee Ross All Rights Reserved</p><br />
        <p className="subscript">Website Magic performed by <a href="https://www.dougleinen.com/">Doug the Magnificent</a> & <a href="https://stephrinehart.com">The Spectacular Stephanie</a></p>
      </Row>
    </footer>
  )
}