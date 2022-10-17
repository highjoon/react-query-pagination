import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import HomeView from "../components/Home";
import { queryClient } from "../utils/queryClient";
import "../styles/globals.css";

function MyApp() {
	return (
		<QueryClientProvider client={queryClient}>
			<HomeView />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default MyApp;
