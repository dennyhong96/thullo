import { ThemeProvider } from "styled-components";
import { ToastContainer } from "react-toastify";

import { FirebaseAuthProvider } from "@/context/firebaseAuthContext";
import GlobalStyles from "@/styles/globalStyles";
import theme from "@/styles/theme";

import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/header";

function MyApp({ Component, pageProps }) {
	return (
		<FirebaseAuthProvider>
			<ThemeProvider theme={theme}>
				<GlobalStyles />
				<Header />
				<Component {...pageProps} />
				<ToastContainer autoClose={2500} />
			</ThemeProvider>
		</FirebaseAuthProvider>
	);
}

export default MyApp;
