import EmailVerificationUI from "@/components/modules/auth/EmailVerification";
import React, { Suspense } from "react";

const VerifyEmailPage = ( ) => {
  

  return (
    <div>
        
   <Suspense>
       <EmailVerificationUI />
   </Suspense>
    </div>
  );
};

export default VerifyEmailPage;