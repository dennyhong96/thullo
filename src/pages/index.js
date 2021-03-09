import Avatar from "@/components/avatar";
import BoardCard from "@/components/boardCard";
import Button from "@/components/button";
import { IconAdd } from "@/components/icons";
import NewBoardModal from "@/components/newBoardModal";
import { useState } from "react";

const Home = () => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div>
			<Button>Hello</Button>
			<Button onClick={setIsOpen.bind(this, true)} Icon={<IconAdd />}>
				Add
			</Button>

			<div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)" }}>
				<BoardCard avatars={[<Avatar key={0} />]} />
			</div>

			<NewBoardModal isOpen={isOpen} onClose={setIsOpen.bind(this, false)} />
		</div>
	);
};

export default Home;
