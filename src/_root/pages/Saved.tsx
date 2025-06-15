import GridPostList from '@/components/shared/GridPostList';
import { useGetCurrentUser } from '@/lib/react-query/queriesAndMutation';
import { useEffect, useState } from 'react'

const Saved = () => {
  const { data: profile} = useGetCurrentUser();
  const [ savedPost, setSavedPost ] = useState([]);

  useEffect(() =>{
    setSavedPost(profile?.save)
  },[profile])

  return (
    <div>
      <div className='flex m-7'>
        <div className='mx-4'><img src='/public/assets/icons/save.svg' /></div>
        <div> <h3 className="body-bold md-:h3-bold">Saved Posts </h3></div>
      </div>
       {savedPost?.length > 0 ? savedPost?.map((post) => {
        return (
          <>
          <GridPostList posts={post} showUser={false} showStats={false} />
          </>
        )
      }) : (
        <>
        <h1 className='flex text-gray-500 text-center mx-5 my-auto '>You have not saved yet...!!</h1>
        </>
      )}
    </div>
  )
}

export default Saved