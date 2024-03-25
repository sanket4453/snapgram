import ProfileForm from "@/components/forms/ProfileForm";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutation";
import React from "react";
import { useParams } from "react-router-dom";

const UpdateProfile = () => {
  const { id } = useParams();
  const { data: user, isPending} = useGetCurrentUser();
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/edit.svg"
            alt="add"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>
        <ProfileForm action="Update" profile={user} />
      </div>
    </div>
  );
};

export default UpdateProfile;
