const sortByLastest = arr =>
	arr.slice().sort((a, b) => new Date(b.createdAt.seconds) - new Date(a.createdAt.seconds));

export default sortByLastest;
