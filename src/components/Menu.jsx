import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';

const Navigation = styled.nav`
  ul{ 
    list-style-type: none;
  }

  a {
    color: #eae3e3;
    text-decoration: none;
    font-size: 1.2rem;
    &:hover {
      color: white;
      text-shadow: 2px 2px 40px #a81010;
    }
  }
`;

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
        <Navigation>
          <ul>
            {/* <li><Link to='/'>Home</Link></li> */}
            {data.allDatoCmsBook.nodes.map(book => {
              return <li><Link to={`/${book.slug}`}>{book.title}</Link></li>
            })}
          </ul>
        </Navigation>
      )}
    />
  )
}