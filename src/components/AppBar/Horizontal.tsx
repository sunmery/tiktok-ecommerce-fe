import Box from '@mui/joy/Box'
import ListDivider from '@mui/joy/ListDivider'
import ListItem from '@mui/joy/ListItem'
import ListItemButton from '@mui/joy/ListItemButton'
import Home from '@mui/icons-material/Home'
import Person from '@mui/icons-material/Person'
import {Dropdown, Menu, MenuButton, MenuItem} from '@mui/joy'
import MoreVert from '@mui/icons-material/MoreVert'
import {useState} from 'react'
import {Link} from '@tanstack/react-router'
import {List as UiList} from '@mui/joy'

/**
 *@returns JSXElement
 */
export default function HorizontalList() {
	const [isLogin] = useState<boolean>(false)
	return (
		<Box
			component="nav"
			aria-label="My site"
			sx={{flexGrow: 1}}
		>
			<UiList
				role="menubar"
				orientation="horizontal"
			>
				<ListItem role="none">
					<ListItemButton
						role="menuitem"
						component="a"
						href="#horizontal-list"
						aria-label="Home"
					>
						<Link to="/">
							<Home />
						</Link>
					</ListItemButton>
				</ListItem>
				<ListDivider />
				<ListItem role="none">
					<ListItemButton
						role="menuitem"
						component="a"
						href="#horizontal-list"
					>
						<Link to="/products">Products</Link>
					</ListItemButton>
				</ListItem>
				<ListDivider />
				<ListItem role="none">
					<ListItemButton
						role="menuitem"
						component="a"
						href="#horizontal-list"
					>
						<Link to="/carts">Carts</Link>
					</ListItemButton>
				</ListItem>
				<ListItem role="none">
					<ListItemButton
						role="menuitem"
						component="a"
						href="#horizontal-list"
					>
						<Link to="/profile">Profile</Link>
					</ListItemButton>
				</ListItem>
				<ListItem
					role="none"
					sx={{marginInlineStart: 'auto'}}
				>
					<ListItemButton
						role="menuitem"
						component="a"
						href="#horizontal-list"
						aria-label="Profile"
					>
						<Dropdown>
							<MenuButton slots={{root: Person}}>
								<MoreVert />
							</MenuButton>
							<Menu>
								{isLogin ? (
									<>
										<MenuItem>
											<Link to="/profile">Profile</Link>
										</MenuItem>
										<MenuItem>
											<Link to="/logout">Logout</Link>
										</MenuItem>
									</>
								) : (
									<>
										<MenuItem>
											<Link to="/register">Register</Link>
										</MenuItem>
										<MenuItem>
											<Link to="/login">Login</Link>
										</MenuItem>
									</>
								)}
							</Menu>
						</Dropdown>
					</ListItemButton>
				</ListItem>
			</UiList>
		</Box>
	)
}
