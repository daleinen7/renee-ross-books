require('dotenv').config({
  path: `.env`,
});

module.exports = {
  siteMetadata: {
    title: "Renee Ross Books",
    description: "Gothic Romance the Way You Remember it."
  },
  plugins: [
    {
      resolve: "gatsby-source-datocms",
      options: {
        apiToken: process.env.API_TOKEN,
      },
    },
    "gatsby-plugin-styled-components",
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
  ],
};
