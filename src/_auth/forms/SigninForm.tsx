import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {SigninValidation } from "@/lib/validations";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { useState } from "react";

const SigninForm = () => {
  const {toast} = useToast();
  const {checkAuthUser, isLoading : isUserLoading } = useUserContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


 // const { mutateAsync : createUserAccount, isPending : isCreatingUser} = useCreateUserAccount();
  const { mutateAsync : signInAccount } = useSignInAccount();


  //1Define your form
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
 async function onSubmit(values: z.infer<typeof SigninValidation>) {
    setLoading(true);
    const session = await signInAccount({
      email : values.email,
      password : values.password
    })

    if(!session){
      setLoading(false);
      return toast({ title :'Sign in failed. Please try again.' })
    }

    // we need 
    const isLoggedIn = await checkAuthUser();
 

    if(isLoggedIn){
      form.reset();
      navigate("/")
    }else{
      return toast({title : "Sign in failed. Please try again"})
    }
     setLoading(false);
    
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular">
         Welcome back please enter your details.
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
         
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isUserLoading || loading} className="shad-button_primary">
            {isUserLoading || loading ? (
              <div className="flex-center gap-2"> <Loader /> Loading...</div>
            ) : "Log in"}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">Don't have an account?
            <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Sign up</Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
