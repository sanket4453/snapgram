import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import {
  useGetRecentPosts,
  useGetUsers,
} from "@/lib/react-query/queriesAndMutation";
import { Models } from "appwrite";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();
  const {
    data: creators,
    isPending: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers();

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents?.map((post: Models.Document) => (
                <PostCard post={post} key={post.caption} />
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="hidden flex-wrap items-center gap-4 overflow-scroll py-6 px-8 md:px-8 lg:flex lg:w-2/6 custom-scrollbar">
        <h2 className="h3-bold md:h2-bold text-left w-full">Top Creators</h2>
        {creators &&
          creators?.documents.map((creator: Models.Document) => (
            <UserCard creator={creator} key={creator.id} />
          ))}
      </div>
    </div>
  );
};

export default Home;
