import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useGetUsers } from "@/lib/react-query/queriesAndMutation";
import { Models } from "appwrite";
import React from "react";

const AllUsers = () => {
  const {
    data: creators,
    isPending: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);
  return (
    <>
      <div className="flex mx-6 my-8 h-7 items-center">
        <img src="/assets/icons/people.svg" className="item-center" width={25} height={25}/>
        <h2 className="h3-bold md:h2-bold text-left w-full px-2">All Users</h2>
      </div>
      <div className="flex flex-1 flex-wrap items-center gap-5 overflow-scroll py-5 px-5 md:px-8 lg:p-14 lg:gap-10 custom-scrollbar">
        {isUserLoading ? (
          <Loader />
        ) : (
          creators &&
          creators.documents.map((creator: Models.Document) => (
            <UserCard creator={creator} key={creator.$id} />
          ))
        )}
      </div>
    </>
  );
};

export default AllUsers;
