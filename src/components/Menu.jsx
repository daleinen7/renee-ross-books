import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';

const Navigation = styled.nav`
  
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
            <li><Link to='/'>Home</Link></li>
            {data.allDatoCmsBook.nodes.map(book => {
              return <li><Link to={`/${book.slug}`}>{book.title}</Link></li>
            })}
          </ul>
        </Navigation>
      )}
    />
  )
}