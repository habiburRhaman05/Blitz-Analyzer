import TemplateDetails from '@/components/modules/resume/TemplateDetails'
import React from 'react'

const TemplateDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  return (
    <div>
      <TemplateDetails id={id} />
    </div>
  )
}

export default TemplateDetailsPage
