import { createContext, useContext, useEffect, useReducer } from "react";

import firebase from "@/lib/firebase";

const auth = firebase.auth();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const FirebaseAuthContext = createContext();

const INITIAL_STATE = {
	uid: null,
	displayName: null,
	email: null,
};

const reducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case "AUTHENTICATED": {
			return {
				...state,
				...payload,
			};
		}

		case "LOGGED_OUT": {
			return INITIAL_STATE;
		}

		default: {
			return state;
		}
	}
};

const signin = async () => await auth.signInWithPopup(googleAuthProvider);

const signout = async () => await auth.signOut();

export const FirebaseAuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

	useEffect(() => {
		auth.onAuthStateChanged(async user => {
			if (user) {
				// LOGOUT FROM HUBSPOT FIRST
				const { uid, displayName, email } = user;
				localStorage.setItem("FIREBASE_AUTH_UID", uid);
				dispatch({
					type: "AUTHENTICATED",
					payload: {
						uid,
						displayName,
						email,
					},
				});
			} else {
				localStorage.removeItem("FIREBASE_AUTH_UID");
				dispatch({
					type: "LOGGED_OUT",
				});
			}
		});
	}, []);

	return (
		<FirebaseAuthContext.Provider
			value={{
				...state,
				signin,
				signout,
			}}
		>
			{children}
		</FirebaseAuthContext.Provider>
	);
};

export const useFirebaseAuth = () => {
	const { uid, displayName, email, signin, signout } = useContext(FirebaseAuthContext);
	return { uid, displayName, email, signin, signout };
};
