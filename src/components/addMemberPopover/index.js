import { useState } from "react";

import { searchUsers } from "@/lib/api/users";
import useBoardData from "@/hooks/useBoardData";
import Button from "@/components/button";
import { IconAdd, IconSearch } from "@/components/icons";
import Avatar from "@/components/avatar";
import Popover from "@/components/popover";
import Input from "@/components/input";

const AddMemberPopover = () => {
	const { data: board } = useBoardData();
	const [searchInput, setSearchInput] = useState();
	const [results, setResults] = useState([]);

	const handleSearch = async () => {
		if (!searchInput) return;
		const users = await searchUsers({ keyword: searchInput });
		setResults(users);
	};

	const handleChange = evt => {
		setResults([]);
		setSearchInput(evt.target.value);
	};

	return (
		<Popover Trigger={<Button Icon={<IconAdd />} />}>
			<p>Invite to Board</p>
			<span>Search users you want to invite to</span>

			<div>
				<Input value={searchInput} onChange={handleChange} />
				<Button Icon={<IconSearch />} onClick={handleSearch} />

				{/* DISABLE PEOPLE ALREADY ON THE BOARD */}
				{results.map(result => (
					<div key={result.email}>
						{(result.id === board.admin.id || board.members.includes(result.id)) && (
							<p>Disable this</p>
						)}
						<Avatar src={result.photoURL} />
						<span>{result.displayName}</span>
					</div>
				))}
				<Button>Invite</Button>
			</div>
		</Popover>
	);
};

export default AddMemberPopover;
