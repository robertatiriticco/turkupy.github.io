const path = require("path")
const { createFilePath } = require("gatsby-source-filesystem")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const eventPage = path.resolve("./src/templates/EventPage.jsx")
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  const events = result.data.allMarkdownRemark.edges

  events.forEach(event => {
    createPage({
      path: event.node.fields.slug,
      component: eventPage,
      context: {
        slug: event.node.fields.slug,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === "MarkdownRemark") {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: "slug",
      node,
      value,
    })
  }
}
