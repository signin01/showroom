import React, { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";
import PostCard from "../components/feed/PostCard";
import FilterBar from "../components/feed/FilterBar";
import Loader from "../components/common/Loader";
import { getPosts } from "../services/api";
import { motion } from "framer-motion";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    sort: "newest",
    minPrice: "",
    maxPrice: "",
    search: ""
  });

  const fetchPosts = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await getPosts(page, 12, filters);
      if (page === 1) {
        setPosts(response.data.posts);
      } else {
        setPosts(prev => [...prev, ...response.data.posts]);
      }
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    setPage(1);
    setPosts([]);
    fetchPosts();
  }, [filters]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts();
    }
  }, [page]);

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <FilterBar filters={filters} setFilters={setFilters} />
      
      <InfiniteScroll
        dataLength={posts.length}
        next={() => setPage(prev => prev + 1)}
        hasMore={hasMore}
        loader={<Loader />}
        endMessage={
          <p className="text-center text-gray-500 mt-8 pb-8">
            ✨ You've seen all posts! ✨
          </p>
        }
      >
        <Masonry
          breakpointCols={breakpointColumns}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </Masonry>
      </InfiniteScroll>
    </div>
  );
};

export default Home;
