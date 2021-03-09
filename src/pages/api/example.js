// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
	res.status(200);
	return res.json({
		success: true,
		message: "This is an example.",
	});
};
