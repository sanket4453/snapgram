import GridPostList from "@/components/shared/GridPostList";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutation";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useUserContext();
  const { data: profile } = useGetCurrentUser();
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    if(user && profile && user.id === profile.$id) {
      setShowEditProfile(true);
    }
  },[user,profile])

 
  return (
    <div className="overflow-scroll custom-scrollbar">
      <div className="flex gap-4 w-full m-4">
        <div className="w-28 mx-3 mt-3 rounded-full">
          <img
            src={user.imageUrl}
            className="w-full rounded-full"
            alt="profile"
            width={45}
            height={45}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-3xl font-bold">{user.name}</div>
            <div className="text-sm text-gray-500 mt-2">@{user.username}</div>
          </div>
          <div className="flex gap-4">
            <p>
              <span className="text-primary-500">{profile?.posts?.length}</span>
              <br /> Posts
            </p>
            <p>
              <span className="text-primary-500">{2874}</span> <br /> Followers
            </p>
            <p>
              <span className="text-primary-500">{254}</span> <br /> Following
            </p>
          </div>

          <div className="profile-bio">
            <div>
              {user.bio ? user.bio : ""}
            </div>
          </div>
        </div>

        {showEditProfile ? (
          <div className="lg:ml-60 lg:mt-4 mr-1">
           <Link to={`/update-profile/${user.id}`}> <Button className="shad-button_primary whitespace-nowrap">Edit Profile</Button></Link>
          </div>
        ) : null}
      </div>

      <div className="mx-4">
        <div className="flex-between w-full max-w-5xl mt-16 mb-7 mx-4">
          <h3 className="body-bold md-:h3-bold">My Posts</h3>
          <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer ">
            <p className="small-medium md:base-medium text-light-2">All</p>
            <img
              src="/assets/icons/filter.svg"
              width={20}
              height={20}
              alt="filter"
            />
          </div>
        </div>
        <div>
          {profile && (
            <GridPostList
              posts={profile.posts}
              showUser={false}
              showStats={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
