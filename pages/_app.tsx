import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import MuiThemeProvider from "../public/theme/MuiThemeProvider";
import { ThemeProvider } from "@mui/material";
import theme from "../public/theme";
import { Provider } from "react-redux";
import store from "../public/Store";

import { setContext } from '@apollo/client/link/context';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
	useLazyQuery,
} from '@apollo/client';
export default function MyApp({ Component, pageProps }: AppProps) {
	const httpLink = createHttpLink({
		uri: process.env.NEXT_PUBLIC_BASE_URL,
	});

	/* 	const client = new ApolloClient({
		uri: process.env.NEXT_PUBLIC_BASE_URL,
		cache: new InMemoryCache(),
	}); */

	const token =
		typeof window !== 'undefined'
			? localStorage.getItem('token')
			: null;

	const authLink = setContext((_, { headers }) => {
		return {
			headers: {
				...headers,
				authorization: token ? `Bearer ${token}` : '',
			},
		};
	});

	const client = new ApolloClient({
		link: authLink.concat(httpLink),
		cache: new InMemoryCache(),
	});
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        autoHideDuration={3000}
        maxSnack={3}
      >
        <ThemeProvider theme={() => theme}>
          <MuiThemeProvider>
            <Component {...pageProps} />
          </MuiThemeProvider>
        </ThemeProvider>
      </SnackbarProvider>
    </Provider>
    </ApolloProvider>
  );
}
