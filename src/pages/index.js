import Avatar from "@/components/avatar";
import BoardCard from "@/components/boardCard";
import Button from "@/components/button";

const Home = () => {
	return (
		<div>
			<Button>Hello</Button>

			<div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)" }}>
				<BoardCard avatars={[<Avatar key={0} />]} />
			</div>
		</div>
	);
};

export default Home;
