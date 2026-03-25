import PaymentDetails from '@/components/modules/payment/PaymentDetails';
import React from 'react'

const PaymentDetailsPage =async ({params}:{params:{id:string}}) => {
    const {id} = await params;
  return (
    <div>
        

        <PaymentDetails
        id={id}
        />
    </div>
  )
}

export default PaymentDetailsPage