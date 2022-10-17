import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { IPost } from "../types/post";
import fetchPosts from "../utils/fetchPosts";

const useGetPost = ({
	currentPage,
	options,
}: {
	currentPage: number;
	options?: UseQueryOptions<IPost[], Error, IPost[], (string | number)[]>;
}): UseQueryResult<IPost[], Error> => {
	return useQuery(["posts", currentPage], () => fetchPosts(currentPage), options);
};

export default useGetPost;
