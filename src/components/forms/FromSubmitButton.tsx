import { Loader2 } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

const FormSubmitButton = ({
    className,
    text,
    isLoading,
    disabled
}:{
      className:string,
    text:string,
    isLoading:boolean,
    disabled:boolean
}) => {
  return (
     <Button type="submit" className={className || "w-full h-11 font-bold"} disabled={disabled}>
                              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : text}
                          </Button>
  )
}

export default FormSubmitButton