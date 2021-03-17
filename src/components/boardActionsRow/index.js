import useBoardData from "@/hooks/useBoardData";
import useUpdateVisibility from "@/hooks/useUpdateVisibility";
import Button from "@/components/button";
import Avatar from "@/components/avatar";
import Popover from "@/components/popover";
import { IconLock, IconPublic, IconGlobe } from "@/components/icons";
import AddMemberPopover from "@/components/addMemberPopover";
import { StyledActionRow, StyledVisibility, StyledVisibilityOption } from "./styles";

const BoardActionRow = () => {
	const { data: board, error } = useBoardData();
	const { handleUpdateVisibility } = useUpdateVisibility();

	if (error) return <p>Error...</p>;
	if (!error && !board) return <p>Loading...</p>;

	return (
		<StyledActionRow>
			<div>
				{/* VISIBLITY SELECT */}
				<Popover
					Trigger={
						<Button Icon={board.isPrivate ? <IconLock /> : <IconPublic />}>
							{board.isPrivate ? "Private" : "Public"}
						</Button>
					}
				>
					<StyledVisibility>
						<p>Visibility</p>
						<span>Choose who can see to this board.</span>
						<StyledVisibilityOption
							isActive={!board.isPrivate}
							onClick={handleUpdateVisibility.bind(this, { isPrivate: false })}
						>
							<span>
								<IconGlobe /> Public
							</span>
							<span>Anyone on the internet can see this.</span>
						</StyledVisibilityOption>
						<StyledVisibilityOption
							isActive={board.isPrivate}
							onClick={handleUpdateVisibility.bind(this, { isPrivate: true })}
						>
							<span>
								<IconLock /> Private
							</span>
							<span>Only board members can see this</span>
						</StyledVisibilityOption>
					</StyledVisibility>
				</Popover>

				{/* BOARD MEMBERS */}
				<div>
					{[board.admin, ...(board.members ?? [])].map((member, idx) => (
						<Avatar key={idx} src={member.photoURL} />
					))}

					{/* ADD MEMBER POPOVER */}
					<AddMemberPopover />
				</div>
			</div>

			<Button>Show Menu</Button>
		</StyledActionRow>
	);
};

export default BoardActionRow;
