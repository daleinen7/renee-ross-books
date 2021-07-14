import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import {
    Navbar,
    Nav,
    NavDropdown
} from 'react-bootstrap';
import '../styles/menu.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookSquare,
  faAmazon,
  faGoodreads,
  faPinterestSquare,
  faTwitterSquare
} from '@fortawesome/free-brands-svg-icons';
import {
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

export default function Menu() {
  return(
    <StaticQuery
      query={graphql`
        query HeadingQuery {
          allDatoCmsBook {
            nodes {
              title
              slug
            }
          }
        }
      `}
      render={data => (
        <Navbar bg="secondary" expand="lg" className="p-4 mb-4 navi">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
              <NavDropdown title="Books" id="navbarScrollingDropdown">   
                {data.allDatoCmsBook.nodes.map((book, idx) => {
                  return <NavDropdown.Item href={`/${book.slug}`} key={idx}>{book.title}</NavDropdown.Item>
                })}
              </NavDropdown>
              <Nav.Link href="/blog">Blog</Nav.Link>
            </Nav>
            <Nav className="ms-auto social-links">
              <Nav.Link href="https://www.facebook.com/reneerossbooks">
                <span className="screen-reader-text">facebook</span>
                <FontAwesomeIcon icon={faFacebookSquare} size="lg" alt="facebook"/>
              </Nav.Link> &nbsp;
              <Nav.Link href="https://www.amazon.com/Renee-Ross/e/B007WDCBI2/ref=sr_ntt_srch_lnk_1?qid=1503373408&sr=8-1">
                <span className="screen-reader-text">Amazon</span>
                <FontAwesomeIcon icon={faAmazon} size="lg" alt="Amazon"/>
              </Nav.Link>  &nbsp;
              <Nav.Link href="mailto:reneerossbooks@gmail.com">
                <span className="screen-reader-text">Email</span>
                <FontAwesomeIcon icon={faEnvelope} size="lg" alt="email"/>
              </Nav.Link>  &nbsp;
              <Nav.Link href="https://www.goodreads.com/author/show/6037599.Rene
              e_Ross">
                <span className="screen-reader-text">Goodreads</span>
                <FontAwesomeIcon icon={faGoodreads} size="lg" alt="Good Reads"/>
              </Nav.Link>  &nbsp;
              <Nav.Link href="https://www.pinterest.com/ReneeRossBooks/"> 
                <span className="screen-reader-text">Pintrest</span>
                <FontAwesomeIcon icon={faPinterestSquare} size="lg" alt="Pintrest"/>
              </Nav.Link>  &nbsp;
              <Nav.Link href="https://twitter.com/reneerossbooks">
                <span className="screen-reader-text">Twitter</span>
                <FontAwesomeIcon icon={faTwitterSquare} size="lg" alt="Twitter"/>
              </Nav.Link>  &nbsp;
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )}
    />
  )
}