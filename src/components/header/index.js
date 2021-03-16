import { useFirebaseAuth } from "@/context/firebaseAuthContext";
import Button from "@/components/button";
import Input from "@/components/input";
import AccountPopover from "@/components/accountPopover";
import { StyledHeader, StyledSearch } from "./styles";

const Header = () => {
	const { uid, signin } = useFirebaseAuth();

	return (
		<StyledHeader>
			{/* BRAND */}
			<h4>Thullo</h4>

			<div />
			<div />

			{/* SEARCH */}
			<StyledSearch>
				<Input />
				<Button>search</Button>
			</StyledSearch>

			{/* ACCOUNT */}
			{!uid ? (
				<div>
					<Button onClick={signin}>Login</Button>
				</div>
			) : (
				<AccountPopover />
			)}
		</StyledHeader>
	);
};

export default Header;
