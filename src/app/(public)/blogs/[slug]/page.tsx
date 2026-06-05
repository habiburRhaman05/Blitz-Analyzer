

import BlogDetails from "@/components/modules/moderator/blogs/BlogDetails";

export default  async function BlogDetailsPage({params}) {
  const {id} = await params
   return <BlogDetails id={id}/>
}


