import BlogListingTabel from '@/components/modules/moderator/blogs/BlogLisingTabel'
import React, { Suspense } from 'react'

const Blogs = () => {
  return (
    <Suspense>

      <BlogListingTabel/>
    </Suspense>
  )
}

export default Blogs