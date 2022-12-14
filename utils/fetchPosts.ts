import { IPost } from "../types/post";

async function fetchPosts(pageNum: number): Promise<IPost[]> {
	const data = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=4&_page=${pageNum}`).then((res) =>
		res.json()
	);
	return data;
}

export default fetchPosts;
