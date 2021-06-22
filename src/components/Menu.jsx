import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import {
    Navbar,
    Nav,
    NavDropdown
} from 'react-bootstrap';
import styled from 'styled-components';
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

// const Navigation = styled.nav`
//   ul{ 
//     list-style-type: none;
//   }

//   a {
//     color: #eae3e3;
//     text-decoration: none;
//     font-size: 1.2rem;
//     &:hover {
//       color: white;
//       text-shadow: 2px 2px 40px #a81010;
//     }
//   }
// `;

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
        // <Navigation>

        <Navbar bg="dark" variant="dark" expand="lg" className="p-4 mb-4">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">About</Nav.Link>
            <NavDropdown title="Books" id="navbarScrollingDropdown">   
            {data.allDatoCmsBook.nodes.map(book => {
              return <NavDropdown.Item href={`/${book.slug}`}>{book.title}</NavDropdown.Item>
            })}
            </NavDropdown>
            
        </Nav>
            <Nav className="ms-auto">
              <Nav.Link href="https://www.facebook.com/reneerossbooks">
                <FontAwesomeIcon icon={faFacebookSquare} size="lg" />
              </Nav.Link> &nbsp;
              <Nav.Link href="https://www.amazon.com/Renee-Ross/e/B007WDCBI2/ref=sr_ntt_srch_lnk_1?qid=1503373408&sr=8-1">
                <FontAwesomeIcon icon={faAmazon} size="lg" />
              </Nav.Link>  &nbsp;
              <Nav.Link href="mailto:reneerossbooks@gmail.com">
                <FontAwesomeIcon icon={faEnvelope} size="lg" />
              </Nav.Link>  &nbsp;
              <Nav.Link href="https://www.goodreads.com/author/show/6037599.Renee_Ross">
                <FontAwesomeIcon icon={faGoodreads} size="lg" />
              </Nav.Link>  &nbsp;
              <Nav.Link href="https://www.pinterest.com/ReneeRossBooks/">
                <FontAwesomeIcon icon={faPinterestSquare} size="lg" />
              </Nav.Link>  &nbsp;
              <Nav.Link href="https://twitter.com/reneerossbooks">
                <FontAwesomeIcon icon={faTwitterSquare} size="lg" />
              </Nav.Link>  &nbsp;
            </Nav>
            </Navbar.Collapse>
        </Navbar>
      )}
    />
  )
}