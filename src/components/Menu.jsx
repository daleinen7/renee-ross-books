import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import {
    Navbar,
    Nav,
    NavDropdown
} from 'react-bootstrap';
import styled from 'styled-components';

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
            <Nav.Link>For Social Links</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Navbar>
      )}
    />
  )
}