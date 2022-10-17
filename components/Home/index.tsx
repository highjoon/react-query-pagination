import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./Home.module.css";

const MAX_POST_SIZE = 23;
const INITIAL_LIMIT = 6;
const INITIAL_PAGES = Array.from(
	{ length: MAX_POST_SIZE > INITIAL_LIMIT ? INITIAL_LIMIT : MAX_POST_SIZE },
	(_, i) => i + 1
);

interface IPost {
	userId: number;
	id: number;
	title: string;
	body: string;
}

async function fetchPosts(pageNum: number): Promise<IPost[]> {
	const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=4&_page=${pageNum}`);
	return response.json();
}

const HomeView = () => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
	const [limit, setLimit] = useState<number>(INITIAL_LIMIT);
	const [pages, setPages] = useState<number[]>(INITIAL_PAGES);

	const queryClient = useQueryClient();

	useEffect(() => {
		if (currentPage > limit) {
			setLimit((prev) => prev + INITIAL_LIMIT);
		}

		if (limit - currentPage === INITIAL_LIMIT) {
			setLimit((prev) => prev - INITIAL_LIMIT);
		}
	}, [currentPage, limit]);

	useEffect(() => {
		if (currentPage > limit) {
			setPages(
				Array.from(
					{
						length: MAX_POST_SIZE - currentPage > INITIAL_LIMIT ? INITIAL_LIMIT : MAX_POST_SIZE - currentPage + 1,
					},
					(_, i) => i + currentPage
				)
			);
		} else {
			setPages(
				Array.from(
					{
						length: limit > MAX_POST_SIZE ? limit - MAX_POST_SIZE : INITIAL_LIMIT,
					},
					(_, i) => i + limit - (INITIAL_LIMIT - 1)
				)
			);
		}
	}, [currentPage, limit]);

	useEffect(() => {
		if (currentPage < MAX_POST_SIZE) {
			const nextPage = currentPage + 1;
			queryClient.prefetchQuery(["post", nextPage], () => fetchPosts(nextPage));
		}

		if (currentPage > 1) {
			const prevPage = currentPage - 1;
			queryClient.prefetchQuery(["post", prevPage], () => fetchPosts(prevPage));
		}
	}, [currentPage, queryClient]);

	const { data, isError, error, isLoading } = useQuery<IPost[], Error>(
		["posts", currentPage],
		() => fetchPosts(currentPage),
		{
			staleTime: 2000,
			keepPreviousData: true,
		}
	);

	if (isLoading) return <h3>Loading...</h3>;
	if (isError)
		return (
			<>
				<h3>Something went wrong</h3>
				{error.message}
			</>
		);

	console.log("currentPage:", currentPage, "limit:", limit, "limit-currentPage", limit - currentPage);

	return (
		<>
			<ul>
				{data.map((post) => (
					<li key={post.id} className={styles.title} onClick={() => setSelectedPost(post)}>
						{post.title}
					</li>
				))}
			</ul>
			<div>
				<button
					className={styles.btn}
					disabled={currentPage <= 1}
					onClick={() => setCurrentPage((prevValue) => prevValue - 1)}
				>
					PREV
				</button>
				{pages.map((page) => (
					<button
						className={styles.btn}
						disabled={currentPage === page}
						key={page}
						onClick={() => setCurrentPage(page)}
					>
						{page}
					</button>
				))}
				<button
					className={styles.btn}
					disabled={currentPage >= MAX_POST_SIZE}
					onClick={() => setCurrentPage((prevValue) => prevValue + 1)}
				>
					NEXT
				</button>
			</div>
		</>
	);
};

export default HomeView;
