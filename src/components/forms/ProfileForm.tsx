import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import {  ProfileValidation } from "@/lib/validations";
import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useUpdateProfile } from "@/lib/react-query/queriesAndMutation";
import ProfileUploder from "../shared/ProfileUploder";
import { useEffect, useState } from "react";
// import { updateProfile } from "@/lib/appwrite/api";


// const formSchema = z.object({});

type ProfileFormProps = {
  action: 'Create' | 'Update'
  profile? : Models.Document
}



const ProfileForm = ({ action, profile } : ProfileFormProps ) => {

//   const { mutateAsync : createPost, isPending: isLoadingCreate } = useCreatePost();
  const { mutateAsync : UpdateProfile, isPending: isLoadingUpdate } = useUpdateProfile(profile?.$id || '');
  const { user } = useUserContext();
  const [userData, setUserData] = useState(user);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setUserData(user)
  },[user])

  // 1. Define your form
  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file : [] || user.imageUrl,
      name :  user.name || userData.name,
      username : user.username || userData.username,
      email : user.email || userData.email,
      bio: user.bio || ""

    },
  });

 const onhandleSubmit = async (values: z.infer<typeof ProfileValidation>) => {
  
  if(profile && action === 'Update'){
    const updatedProfile = await UpdateProfile({
      ...values,
      userId: profile.$id,
      imageId:profile?.imageId,
      imageUrl: profile?.imageUrl,
    })

    if(!updatedProfile){
      toast({title : 'Please try again'})
    }
    

    return navigate(`/profile/${profile.$id}`)
  }




  }


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onhandleSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Update Profile Photo</FormLabel>
              <FormControl>
                {/* <FileUploder
                  fieldChange={field.onChange}
                  mediaUrl={profile?.imageUrl ? profile?.imageUrl : ''}
                /> */}
                <ProfileUploder 
                fieldChange={field.onChange}
                mediaUrl={profile?.imageUrl ? profile?.imageUrl : ''}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Name</FormLabel>
              <FormControl>
              <Input type="text" className="shad-input" {...field}/>
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
       
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field}/>
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
               Add Bio
              </FormLabel>
              <FormControl>
              <Textarea
                  className="shad-textarea custom-scrollbar"
                  placeholder="shadcn"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-evenly">
          <Button className="shad-button_dark_4" type="submit">
            Cancel
          </Button>
          <Button
            className="shad-button_primary whitespace-nowrap"
            type="submit"
            disabled={isLoadingUpdate}
          >
            {isLoadingUpdate && 'Loading..'}
            {action} Profile
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
