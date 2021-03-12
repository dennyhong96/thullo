import { ThemeProvider } from "styled-components";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";

import { FirebaseAuthProvider } from "@/context/firebaseAuthContext";
import Header from "@/components/header";
import GlobalStyles from "@/styles/globalStyles";
import theme from "@/styles/theme";

import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
	const client = new QueryClient();

	return (
		<QueryClientProvider client={client}>
			<FirebaseAuthProvider>
				<ThemeProvider theme={theme}>
					<GlobalStyles />
					<Header />
					<Component {...pageProps} />
					<ToastContainer autoClose={2500} />
				</ThemeProvider>
			</FirebaseAuthProvider>
		</QueryClientProvider>
	);
}

export default MyApp;
