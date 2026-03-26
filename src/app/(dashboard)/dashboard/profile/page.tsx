import AccountPage from '@/components/modules/user/ProfilePage'
import httpClient from '@/lib/axios-client';
import { getMe } from '@/services/auth.services';
import { cookies } from 'next/headers'
import React from 'react'

const page = async() => {


  const getUserProfile = await getMe();
  console.log(getUserProfile());
  

  return (
    <div className='p-5 min-w-full '>
      <AccountPage/>
    </div>
  )
}

export default page