import firebase from "./firebase";

import toSlug from "@/utils/toSlug";

const db = firebase.firestore();
const storage = firebase.storage();

// LIST ALL BOARDS
export const listBoards = async () => {
	const boardsSnapshots = await db.collection("boards").get();

	const boards = [];
	boardsSnapshots.forEach(doc => {
		boards.push({ id: doc.id, ...doc.data() });
	});

	// Get cover src from filePath
	return await Promise.all(
		boards.map(async board => ({
			...board,
			cover: await storage.ref(board.coverPath).getDownloadURL(),
		})),
	);
};

// CREATE A NEW BOARD
export const createBoard = async ({ id, title, isPrivate, cover }) => {
	const titleSlug = toSlug(title);
	const fileExt = cover.type.split("/")[1];
	const filePath = `/boards/${titleSlug}.${fileExt}`;

	await Promise.all([
		await storage.ref(filePath).put(cover),
		await db.collection("boards").doc(id).set({
			title,
			isPrivate,
			slug: titleSlug,
			coverPath: filePath,
		}),
	]);
};

export const getClientOverviewBySlug = async ({ slug }) => {
	const client = await getClientBySlug({ slug });

	const logo = (await listLogosByClient({ slug }))[0];

	const clientWithLogoAndColors = { ...client, logo };

	return clientWithLogoAndColors;
};

export const listColorByClient = async ({ slug }) => {
	const client = await getClientBySlug({ slug });

	const paletteSnapshots = await db
		.collection("clients")
		.doc(client.id)
		.collection("palettes")
		.get();
	const palettes = [];
	paletteSnapshots.forEach(doc =>
		palettes.push({
			id: doc.id,
			...doc.data(),
		}),
	);

	const palettePromises = palettes.map(async palette => {
		const colorSnapshots = await db
			.collection("clients")
			.doc(client.id)
			.collection("palettes")
			.doc(palette.id)
			.collection("colors")
			.get();

		const colors = [];
		colorSnapshots.forEach(doc =>
			colors.push({
				id: doc.id,
				...doc.data(),
			}),
		);

		return {
			...palette,
			colors,
		};
	});

	return await Promise.all(palettePromises);
};

export const listLogosByClient = async ({ slug }) => {
	const client = await getClientBySlug({ slug });
	const logoSnapshots = await db.collection("clients").doc(client.id).collection("logos").get();

	let logos = [];
	logoSnapshots.forEach(doc => {
		logos.push({
			id: doc.id,
			...doc.data(),
		});
	});

	// Get the file download url from Google Cloud Storage URI, put in each logo object
	logos = await Promise.all(
		logos.map(async logo => ({
			...logo,
			src: await storage.refFromURL(logo.url).getDownloadURL(),
		})),
	);

	return logos;
};

export const listIconsByClient = async ({ slug }) => {
	const client = await getClientBySlug({ slug });

	const iconCollectionSnapshots = await db
		.collection("clients")
		.doc(client.id)
		.collection("icongraphy")
		.get();

	const iconCollections = [];
	iconCollectionSnapshots.forEach(async doc => {
		iconCollections.push({
			id: doc.id,
			...doc.data(),
		});
	});

	// Append icon sub-collection into collection
	return await Promise.all(
		iconCollections.map(async collection => {
			const iconSnapshots = await db
				.collection("clients")
				.doc(client.id)
				.collection("icongraphy")
				.doc(collection.id)
				.collection("icons")
				.get();

			const icons = [];
			iconSnapshots.forEach(doc => {
				icons.push({
					id: doc.id,
					...doc.data(),
				});
			});

			return {
				...collection,
				icons: await Promise.all(
					icons.map(async icon => {
						const src = await storage.refFromURL(icon.location).getDownloadURL();
						return { ...icon, src };
					}),
				),
			};
		}),
	);
};

export const listImagesByClient = async ({ slug }) => {
	const client = await getClientBySlug({ slug });
	const imageCollectionSnapshots = await db
		.collection("clients")
		.doc(client.id)
		.collection("photography")
		.get();

	const imageCollections = [];
	imageCollectionSnapshots.forEach(doc => {
		imageCollections.push({
			id: doc.id,
			...doc.data(),
		});
	});

	return await Promise.all(
		imageCollections.map(async collection => {
			const imageSnapshots = await db
				.collection("clients")
				.doc(client.id)
				.collection("photography")
				.doc(collection.id)
				.collection("images")
				.get();

			const images = [];
			imageSnapshots.forEach(doc => {
				images.push({
					id: doc.id,
					...doc.data(),
				});
			});

			return {
				...collection,
				images: await Promise.all(
					images.map(async image => {
						const src = await storage.refFromURL(image.location).getDownloadURL();
						return { ...image, src };
					}),
				),
			};
		}),
	);
};

export const listTypographyByClient = async ({ slug }) => {
	const client = await getClientBySlug({ slug });

	const fontFamilySnapshots = await db
		.collection("clients")
		.doc(client.id)
		.collection("typography")
		.get();

	const fontFamilies = [];
	fontFamilySnapshots.forEach(doc => {
		fontFamilies.push({
			id: doc.id,
			...doc.data(),
		});
	});

	const fontFamilyPromises = fontFamilies.map(async family => {
		const fontVariantSnapshots = await db
			.collection("clients")
			.doc(client.id)
			.collection("typography")
			.doc(family.id)
			.collection("variants")
			.get();

		const variants = [];
		fontVariantSnapshots.forEach(doc => {
			variants.push({
				id: doc.id,
				...doc.data(),
			});
		});

		return {
			...family,
			variants,
		};
	});

	return await Promise.all(fontFamilyPromises);
};

export const getClientBySlug = async ({ slug }) => {
	// List all clients from `clients` collection

	const clientSnapshots = await db.collection("clients").where("slug", "==", slug).limit(1).get();
	const clients = [];
	clientSnapshots.forEach(doc => {
		clients.push({ id: doc.id, ...doc.data() });
	});

	return clients[0];
};
