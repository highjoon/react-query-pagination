import React, { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MAX_POST_SIZE, PAGE_LIMIT } from "../../constants/posts";
import useGetPost from "../../hooks/usePost";
import fetchPosts from "../../utils/fetchPosts";
import styles from "./Home.module.css";

interface IPost {
	userId: number;
	id: number;
	title: string;
	body: string;
}

const HomeView = () => {
	const [pageBlock, setPageBlock] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [selectedPost, setSelectedPost] = useState<IPost>();

	const { data, isError, error, isLoading } = useGetPost({
		currentPage,
		options: { staleTime: 2000, keepPreviousData: true },
	});

	const pageIndex = pageBlock * PAGE_LIMIT;
	const initializedPages = Array.from({ length: MAX_POST_SIZE }, (_, i) => i + 1);
	const PAGES = initializedPages.slice(pageIndex, Number(PAGE_LIMIT) + pageIndex);

	const queryClient = useQueryClient();

	const moveToFirstPage = useCallback(() => {
		setPageBlock(0);
		setCurrentPage(1);
	}, []);

	const moveToLastPage = useCallback(() => {
		setPageBlock(Math.ceil(MAX_POST_SIZE / PAGE_LIMIT) - 1);
		setCurrentPage(MAX_POST_SIZE);
	}, []);

	const moveToPrevPage = useCallback(() => {
		if (currentPage <= 1) return;
		if (currentPage - 1 <= PAGE_LIMIT * pageBlock) {
			setPageBlock((prev) => prev - 1);
		}
		setCurrentPage((prev) => prev - 1);
	}, [currentPage, pageBlock]);

	const moveToNextPage = useCallback(() => {
		if (currentPage >= MAX_POST_SIZE) return;
		if (PAGE_LIMIT * Number(pageBlock + 1) < Number(currentPage + 1)) {
			setPageBlock((prev) => prev + 1);
		}
		setCurrentPage((prev) => prev + 1);
	}, [currentPage, pageBlock]);

	useEffect(() => {
		if (currentPage < MAX_POST_SIZE) {
			const nextPage = currentPage + 1;
			queryClient.prefetchQuery(["posts", nextPage], () => fetchPosts(nextPage));
		}

		if (currentPage > 2) {
			const prevPage = currentPage - 1;
			queryClient.prefetchQuery(["posts", prevPage], () => fetchPosts(prevPage));
		}
	}, [currentPage, queryClient]);

	if (isLoading) return <h3>Loading...</h3>;
	if (isError)
		return (
			<>
				<h3>Something went wrong</h3>
				{error.message}
			</>
		);

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
				<button className={styles.btn} disabled={currentPage <= 1} onClick={moveToFirstPage}>
					FIRST
				</button>
				<button className={styles.btn} disabled={currentPage <= 1} onClick={moveToPrevPage}>
					PREV
				</button>
				{PAGES.map((page) => (
					<button
						className={styles.btn}
						key={page}
						disabled={currentPage === page}
						onClick={() => setCurrentPage(page)}
					>
						{page}
					</button>
				))}
				<button className={styles.btn} disabled={currentPage >= MAX_POST_SIZE} onClick={moveToNextPage}>
					NEXT
				</button>
				<button className={styles.btn} disabled={currentPage >= MAX_POST_SIZE} onClick={moveToLastPage}>
					LAST
				</button>
			</div>
		</>
	);
};

export default HomeView;
