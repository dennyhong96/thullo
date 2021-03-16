import { useState } from "react";
import { useQuery } from "react-query";

import { useFirebaseAuth } from "@/context/firebaseAuthContext";
import { listBoards } from "@/lib/api/boards";
import Avatar from "@/components/avatar";
import BoardCard from "@/components/boardCard";
import Button from "@/components/button";
import NewBoardModal from "@/components/newBoardModal";
import { IconAdd } from "@/components/icons";

const Home = () => {
	const [isOpen, setIsOpen] = useState(false);

	const { data: boards, isLoading, error } = useQuery(["boards"], listBoards);

	const { uid } = useFirebaseAuth();

	if (isLoading) return <p>Loading...</p>;
	if (error) console.error(error);

	console.log({ boards });

	return (
		<div style={{ padding: "4rem" }}>
			{uid && (
				<Button onClick={setIsOpen.bind(this, true)} Icon={<IconAdd />}>
					Add
				</Button>
			)}

			<NewBoardModal isOpen={isOpen} onClose={setIsOpen.bind(this, false)} />

			{/* BOARDS */}
			<div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "3rem" }}>
				{boards?.map(board => (
					<BoardCard
						href={`/boards/${board.slug}`}
						key={board.id}
						title={board.title}
						cover={board.cover}
						avatars={[board.admin, ...board.members].map(member => (
							<Avatar key={member.id} src={member.photoURL} />
						))}
					/>
				))}
			</div>
		</div>
	);
};

export default Home;
