// // import { CreatePost } from "@/_root/pages";
// import { INewPost } from "@/types";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { QUERY_KEYS } from "./queryKeys";

// export const useCreatePost = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//       mutationFn: (post: INewPost) => CreatePost(post),
//       onSuccess: () => {
//         queryClient.invalidateQueries({
//           queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//         });
//       },
//     });
//   };