import * as React from "react";
import {graphql} from 'gatsby';
import Layout from '../components/Layout';
import About from '../components/About';
import BookList from '../components/BookList';
import LatestBook from '../components/LatestBook';

// markup
const IndexPage = ({data}) => {
  return (
    <Layout>
      <LatestBook latest={data.allDatoCmsBook.nodes[0]}/>
      <About aboutText={data.allDatoCmsHomepage.nodes[0].landingPageText}/>
      <BookList books={data.allDatoCmsBook.nodes}/>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query landingPage {
    allDatoCmsHomepage {
      nodes {
        landingPageText {
          value
        }
      }
    }
    allDatoCmsBook {
      nodes {
        bookCover {
          gatsbyImageData
        }
        slug
        title
      }
    }
  }
`