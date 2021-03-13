const formatDate = date => {
	// FIREBASE SERVER DATE NEEDS * 1000
	date = `${date}`.length < 13 ? date * 1000 : date;
	return new Date(date).toLocaleDateString("en-US", {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

export default formatDate;
