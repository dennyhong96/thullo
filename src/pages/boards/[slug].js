import { useRouter } from "next/router";

const Boards = () => {
	const router = useRouter();
	return <div>{router.query.slug}</div>;
};

export default Boards;
