import React from 'react';
import { Link } from "gatsby"; 
import {
  Row
} from 'react-bootstrap';

export default function Footer() {
  return(
    <footer>
      <Row expand="lg" className="p-4 navi bg-secondary footer">
        <p>Copyright &copy; {new Date().getFullYear()} Renee Ross All Rights Reserved</p><br />
        <p className="subscript">Website Magic performed by <Link to="https://www.dougleinen.com/">Doug the Magnificent</Link> & <Link to="https://stephrinehart.com">The Spectacular Stephanie</Link></p>
      </Row>
    </footer>
  )
}