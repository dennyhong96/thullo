import { useFirebaseAuth } from "@/context/firebaseAuthContext";

import Popover from "@/components/popover";
import Avatar from "@/components/avatar";
import Button from "@/components/button";

import { StyledAccount, StyledAccountDropdown } from "./styles";

const AccountPopover = () => {
	const { displayName, photoURL, signout } = useFirebaseAuth();

	return (
		<Popover
			Trigger={
				<StyledAccount>
					<Avatar src={photoURL} />
					<span>{displayName}</span>
				</StyledAccount>
			}
		>
			{/* CONTENT */}
			<StyledAccountDropdown>
				<Button onClick={signout}>Logout</Button>
			</StyledAccountDropdown>
		</Popover>
	);
};

export default AccountPopover;
