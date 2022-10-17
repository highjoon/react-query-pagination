import { QueryCache, QueryClient } from "@tanstack/react-query";

const queryErrorHandler = (error: unknown): void => {
	const title = error instanceof Error ? error.message : "error connecting to server";
	throw Error(title);
};

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: queryErrorHandler,
	}),
	defaultOptions: {
		queries: {
			refetchOnMount: false,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
		},
	},
});
