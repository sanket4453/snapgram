import React, { useState } from "react";
import { Models } from "appwrite";
// import {
//   useFollowUSer,
//   useGetCurrentUser,
// } from "@/lib/react-query/queriesAndMutation";

type userDataProps = {
  creator: Models.Document;
};

const UserCard = ({ creator }: userDataProps) => {
  // const { data: user, isPending } = useGetCurrentUser();
  // const followList = user?.follows?.map((u: Models.Document) => u.$id);
  // const { mutate: followedUser } = useFollowUSer();
  const [currentFollows, setCurrentFollows] = useState('Follow')
  // const [followList, setFollowList] = useState([]);



  

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(currentFollows === 'Follow') {
    setCurrentFollows("Followed")
    }else{
      setCurrentFollows("Follow")
    }

    // let newFollowed = [...followed];

    // const hasFollowed = newFollowed.includes(creator.$id);
    // console.log(hasFollowed)

    // if (hasFollowed) {
    //   newFollowed = newFollowed.filter((id) => id !== creator.$id);
    // } else {
    //   newFollowed.push(creator.$id);
    // }

    // setFollowd(newFollowed);
    // console.log(newFollowed)
    // console.log(user?.$id, followed);
    // followedUser({ userId: user?.$id || "", followedArray: newFollowed });
  };

  // console.log(creator,'creator')
  return (
    <div className=" border border-gray-800 shadow-lg rounded-2xl px-5 py-6 ">
      {/* <Link to={`/profile/${creator.$id}`}> */}
      <div className="flex flex-col items-center justify-center">
        <img
          src={`${
            creator.imageUrl ? creator.imageUrl : "/assets/image/profile.png"
          }`}
          width={40}
          height={40}
          alt="userProfile"
          className="flex rounded-full"
        />

        <h3 className="text-center pt-1 font-bold">{creator.name}</h3>
        <p className="font-thin pt-1 text-xs text-gray-400">
          @{creator.username}
        </p>

        <button
          className="pt-1 bg-primary-500 px-4 m-2 py-1 rounded-md text-xs"
          onClick={(e) => handleFollow(e)}
        >
          {currentFollows}
        </button>
      </div>
      {/* </Link> */}
    </div>
  );
};

export default UserCard;
