import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";

interface FavoritesProps {
    isFavorited: boolean;
}

export default function Favorites({isFavorited}: FavoritesProps) {
    return (
        <>
            <FavoriteTwoToneIcon
                sx={{
                    width: '35px',
                    height: '35px',
                    color: isFavorited ? 'deeppink' : 'grey',
                    transition: 'color 0.3s'
                }}
            />
        </>
    );
}
