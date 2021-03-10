import { useState } from "react";
import { useQuery } from "react-query";

import { listBoards } from "@/lib/api";
import Avatar from "@/components/avatar";
import BoardCard from "@/components/boardCard";
import Button from "@/components/button";
import NewBoardModal from "@/components/newBoardModal";
import { IconAdd } from "@/components/icons";

const Home = () => {
	const [isOpen, setIsOpen] = useState(false);

	const { data: boards, isLoading, error } = useQuery("boards", listBoards);

	if (isLoading) return <p>Loading...</p>;
	if (error) console.error(error);

	return (
		<div style={{ padding: "4rem" }}>
			<Button>Hello</Button>

			<Button onClick={setIsOpen.bind(this, true)} Icon={<IconAdd />}>
				Add
			</Button>

			<NewBoardModal isOpen={isOpen} onClose={setIsOpen.bind(this, false)} />

			<div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "3rem" }}>
				{boards
					.slice()
					// SORT BY CREATED AT
					.sort((a, b) => new Date(a.createdAt.seconds) - new Date(b.createdAt.seconds))
					.map(board => (
						<BoardCard
							href={`/boards/${board.slug}`}
							key={board.id}
							title={board.title}
							cover={board.cover}
							avatars={[<Avatar key={0} />]}
						/>
					))}
			</div>
		</div>
	);
};

export default Home;
