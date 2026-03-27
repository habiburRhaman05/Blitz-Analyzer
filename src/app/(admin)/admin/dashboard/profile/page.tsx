
import { AdminProfilePage } from '@/components/modules/admin/ProfilePage';
import { UserRole } from '@/interfaces/enums';
import { getMe } from '@/services/auth.services';
import { redirect } from 'next/navigation';

const page = async() => {
  const fetchProfileData =  await getMe();
  console.log(fetchProfileData);
  if(!fetchProfileData.data){
           redirect("/sign-in")
  }
  return (
    <div className='p-5 min-w-full '>
      <AdminProfilePage user={fetchProfileData.data}/>
    </div>
  )
}

export default page