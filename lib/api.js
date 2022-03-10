async function fetchAPI(query, { variables } = {}, preview ) {
  console.log('apicall:', preview)
  const res = await fetch(`${preview ? process.env.NEXT_PUBLIC_WEBINY_PREVIEW_API_URL : process.env.NEXT_PUBLIC_WEBINY_API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.WEBINY_API_SECRET}`
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }

  return json.data
}


export async function getAllPostsWithSlug() {
  const data = await fetchAPI(`
    query PostSlugs {
      listPosts {
        data {
          slug
        }
      }
    }
  `)
  return data?.listPosts.data
}

export async function getAllPostsForHome(preview) {
  const data = await fetchAPI(
      `
      query Posts {
        listPosts {
          data {
            id
            title
            slug
            description
            createdOn
            featuredImage
            author {
              name
              slug
              picture
            }
          }
        }
      }
    `,
    {},
    preview
  )
  return data.listPosts.data
}

export async function getPostBySlug(slug, preview) {
  console.log('get:', preview)
  const data = await fetchAPI(

    `
      query PostBySlug( $PostsGetWhereInput: PostsGetWhereInput!) {
        post: getPosts( where: $PostsGetWhereInput ) {
          data {
            id
            title
            slug
            description
            createdOn
            featuredImage
            body
            author {
              name
              slug
              picture
            }
          }
        }
        morePosts: listPosts(limit: 2, sort: createdOn_ASC) {
          data {
            id
            title
            slug
            description
            createdOn
            featuredImage
            author {
              name
              picture
      
            }
          }
        }
      }
    `,
      {
        variables: {
          PostsGetWhereInput:{
            slug: slug
          }
        }
      },
      preview
  )
  return data
}