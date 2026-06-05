import React, { Suspense } from 'react'
import PublicBlogListingPage from './blogs'

const BlogsPage = () => {
  return (
    <Suspense>
      <PublicBlogListingPage/>
    </Suspense>
  )
}

export default BlogsPage