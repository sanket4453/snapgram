import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

export const createUserAccount = async (user: INewUser) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
  }
};

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    // Allow the user to login into their account by providing a valid email and password combination.
    // This route will create a new session for the user.

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    

    if (!currentAccount) throw Error;


    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
    
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
   
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(post: INewPost) {
  try {
    // upload image to storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    //Get file Url
    const fileUrl = getFilePreview(uploadedFile.$id);
   
    if (!fileUrl){
        deleteFile(uploadedFile.$id)
        throw Error;
    }


    //Converts tags to array
    const tags = post.tags?.replace(/ /g,'').split(',') || [];

    //Save post to database
    const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        ID.unique(),
        {
            creator : post.userId,
            caption: post.caption,
            imageUrl : fileUrl,
            imageId : uploadedFile.$id,
            location: post.location,
            tags: tags
        }
    )
    if(!newPost){
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId:string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId)
            
        return { status : 'ok'}
    } catch (error) {
        console.log(error);
        
    }
    
}

export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(20)]
  )
  return posts;
}

export async function likePost(postId:string, likesArray : string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes : likesArray
      }
    )

    if(!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
      console.log(error)
  }
}

export async function followedUser(userId : string , followedArray : string[]){

  try{
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        follows : followedArray
      }
      
    )
  

    if(!updatedUser) throw Error;
    
    return updatedUser;
  }catch (error) {
    console.log(error)
  }
}

export async function savePost(postId:string, userId : string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
       user : userId,
       post: postId
      }
    )

    if(!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
      console.log(error)
  }
}

export async function deleteSavedPost(savedRecordId:string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      savedRecordId
      
    )

    if(!statusCode) throw Error;

    return {status : 'ok'};
  } catch (error) {
      console.log(error)
  }
}

export async function getPostById(postId: string) {
    try {
      const post = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId
      )

      return post;
    } catch (error) {
      console.log(error)
    }
}

export async function getUserById(userId:string) {
  try{
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    ) 
    if(!user){
      throw Error
    }
    return user;
  }catch(error){
    console.log(error)
  }
}

export async function updateProfile(profile:IUpdateUser) {
  const hasFileToUpdated = profile.file.length > 0;

  try{
    let image = {
      imageUrl : profile.imageUrl,
      imageId : profile.imageId
    }

    if(hasFileToUpdated){
      //upload to storage
    
      const uploadedFile = await uploadFile(profile.file[0]);
      // if(uploadedFile?.$id == profile?.imageId){
      //    deleteFile(profile.imageId)
      //   }
        if(!uploadedFile) throw Error;

        const fileUrl = getFilePreview(uploadedFile.$id);
        if(!fileUrl) {
          deleteFile(uploadedFile.$id);
          throw Error;
        }

        image = {...image, imageUrl: fileUrl, imageId: uploadedFile.$id}
      
      }

      //save user to database

      const updateUser =  await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        profile.userId,
        {
          name : profile.name,
          username : profile.username,
          bio: profile.bio,
          imageUrl : profile.imageUrl,
          imageId : profile.imageId
        }
      )


     if(!updateUser){
      deleteFile(profile.imageId);
     throw Error
     }

     return updateUser
    
  }catch(error){
    console.log(error)
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {

    let image = {
      imageUrl : post.imageUrl,
      imageId : post.imageId
    }

    if(hasFileToUpdate){
      // upload image to storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      //Get file Url
      const fileUrl = getFilePreview(uploadedFile.$id);

      if (!fileUrl){
          deleteFile(uploadedFile.$id)
          throw Error;
      }

      image = {...image, imageUrl: fileUrl, imageId: uploadedFile.$id}

    }

    //Converts tags to array
    const tags = post.tags?.replace(/ /g,'').split(',') || [];

    //Save post to database
    const updatePost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        post.postId,
        {
          
            caption: post.caption,
            imageUrl : image.imageUrl,
            imageId : image.imageId,
            location: post.location,
            tags: tags
        }
    )
    if(!updatePost){
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatePost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId:string, imageId : string) {
  if(!postId || !imageId) throw Error

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    return { status : 'ok'}
  } catch (error) {
    console.log(error)
  }
}

export async function getInfinitePosts( {pageParam} : {pageParam: number}){
  const queries : any[] = [Query.orderDesc('$updatedAt'), Query.limit(9)]

  if(pageParam){
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try{
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    )
    if(!posts) throw Error;

    return posts;
  }catch(error){
    console.log(error)
  }
}

export async function searchPosts( searchTerm: string){
  

  try{
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
     [Query.search('caption',searchTerm)]
    )
    if(!posts) throw Error;

    return posts;
  }catch(error){
    console.log(error)
  }
}

export async function getUsers(limit?: number){
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(10)],
    )
    if(!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}