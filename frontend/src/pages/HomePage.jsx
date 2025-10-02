import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const BASE_URL = "http://34.234.93.66:5000";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch(`${BASE_URL}/api/posts/feed`, {
          method: "GET",
          credentials: "include", // gửi cookie để xác thực
        });

        const data = await res.json();

        // nếu backend trả lỗi (401, 400,...)
        if (!res.ok) {
          showToast("Error", data.message || "Failed to load feed", "error");
          setPosts([]);
          return;
        }

        // bảo vệ khi data không phải array
        if (!Array.isArray(data)) {
          showToast("Error", "Invalid data received", "error");
          setPosts([]);
          return;
        }

        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex gap="10" alignItems={"flex-start"}>
      <Box flex={70}>
        {!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}

        {loading && (
          <Flex justify="center">
            <Spinner size="xl" />
          </Flex>
        )}

        {Array.isArray(posts) &&
          posts.map((post) => <Post key={post._id} post={post} postedBy={post.postedBy} />)}
      </Box>

      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
