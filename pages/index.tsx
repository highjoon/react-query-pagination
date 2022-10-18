import type { NextPage } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import HomeView from "../components/Home";
import fetchPosts from "../utils/fetchPosts";

const Home: NextPage = () => {
	return <HomeView />;
};

export async function getServerSideProps() {
	const queryClient = new QueryClient();
	try {
		await queryClient.prefetchQuery(["posts", 1], () => fetchPosts(1), { staleTime: 5000 });
		return {
			props: {
				dehydratedState: dehydrate(queryClient),
			},
		};
	} catch (e) {
		return {
			notFound: true,
		};
	} finally {
		queryClient.clear();
	}
}

export default Home;
