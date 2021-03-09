import styled from "styled-components";

const StyledHeader = styled.header`
	padding: 2rem 4rem;
	display: grid;
	grid-template-columns: 1.25fr 2fr 1.75fr 2fr 1.25fr;
	gap: 1rem;
`;

const Header = () => {
	return (
		<StyledHeader>
			{/* BRAND */}
			<h4>Thullo</h4>

			<div />
			<div />

			{/* SEARCH */}
			<div className="">
				<input type="text" />
				<button>search</button>
			</div>

			{/* ACCOUNT */}
			<div className="">
				<img src="" alt="" />
				<button>User</button>
			</div>
		</StyledHeader>
	);
};

export default Header;
