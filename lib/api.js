async function fetchAPI(query, { variables } = {}, preview) {
  const url = preview
    ? process.env.NEXT_PUBLIC_WEBINY_PREVIEW_API_URL
    : process.env.NEXT_PUBLIC_WEBINY_API_URL;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WEBINY_API_SECRET}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error("Failed to fetch API");
  }

  return json.data;
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
  `);
  return data?.listPosts.data;
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
            body
            createdOn
            featuredImage
            author {
              name
              pictures
            }
          }
        }
      }
    `,
    {},
    preview
  );

  try {
    console.log('backk', data)
    return data.listPosts.data;
  } catch (error) {
    console.log(error)
    return "error back";
  }
}

export async function getPostBySlug(slug, preview) {
  const data = await fetchAPI(
    `
      query PostBySlug( $PostsGetWhereInput: PostsGetWhereInput!) {
        post: getPosts( where: $PostsGetWhereInput ) {
          data {
            id
            title
            slug
            createdOn
            featuredImage
            body
            author {
              name
              pictures
            }
          }
        }
        morePosts: listPosts(limit: 2, sort: createdOn_ASC) {
          data {
            id
            title
            slug
            createdOn
            featuredImage
            author {
              name
              pictures
      
            }
          }
        }
      }
    `,
    {
      variables: {
        PostsGetWhereInput: {
          slug: slug,
        },
      },
    },
    preview
  );
  return data;
}
