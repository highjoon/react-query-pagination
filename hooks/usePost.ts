import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

interface IPost {
	userId: number;
	id: number;
	title: string;
	body: string;
}

async function fetchPosts(pageNum: number): Promise<IPost[]> {
	const data = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=4&_page=${pageNum}`).then((res) =>
		res.json()
	);
	return data;
}

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
