import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import HomeView from "../components/Home";
import { queryClient } from "../utils/queryClient";

// const queryClient = new QueryClient();

function MyApp() {
	return (
		<QueryClientProvider client={queryClient}>
			<HomeView />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default MyApp;
