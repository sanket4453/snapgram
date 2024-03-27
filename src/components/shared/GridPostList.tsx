import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser,
  showStats,
}: GridPostListProps) => {
  const { user } = useUserContext();
  return (
    <div className="flex lg:flex-row flex-wrap justify-evenly">
      {posts.map((post) => (
        <ul className="grid-container">
          <li key={post.$id} className="relative min-w-80 h-80 mt-2">
            <Link to={`/posts/${post.$id}`} className="grid-post_link">
              <img
                src={post.imageUrl}
                alt="post"
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="grid-post_user">
              {showUser && (
                <div className="flex items-center justify-start gap-2 flex-1">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={post.creator.imageUrl}
                    alt="crator"
                  />
                  <p className="line-clamp-1">{post.creator.name}</p>
                </div>
              )}
              {showStats && <PostStats post={post} userId={user.id} />}
            </div>
          </li>
        </ul>
      ))}
    </div>
  );
};

export default GridPostList;
