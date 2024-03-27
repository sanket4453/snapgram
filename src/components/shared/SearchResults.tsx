// import { Models } from 'appwrite'
import Loader from './Loader'
import GridPostList from './GridPostList'
// import { useState } from 'react'

type SearchResultsProps = {

  isSearchFetching: boolean,
  searchedPosts : any
}

const SearchResults = ({isSearchFetching, searchedPosts} : SearchResultsProps) => {

  // const [ searchedPostsResults, setSearchedPostResults] = useState([])
  
  
  if(isSearchFetching) return <Loader />

  if( searchedPosts &&  searchedPosts?.documents.length > 0){
    return (
      <GridPostList posts={searchedPosts?.documents} />
    )
  }
 
  return (
    <p className='text-light-4 mt-10 text-center w-full'>No Results Found</p>
  )
}

export default SearchResults