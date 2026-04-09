import CreateBlogPage from '@/components/modules/moderator/blogs/CreateBlogFrom'
import EditBlogPage from '@/components/modules/moderator/blogs/EditBlog'
import React from 'react'

const EditBlog = async ({params}) => {
  const {id} = await params
  return (
    <div>
      {id}
        <EditBlogPage id={id}/>
    </div>
  )
}

export default EditBlog