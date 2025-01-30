import {createRootRoute, Link, Outlet} from '@tanstack/react-router'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import Home from '@mui/icons-material/Home'
import ListDivider from '@mui/joy/ListDivider'
import Box from '@mui/joy/Box'
import {Dropdown, Menu, MenuButton, MenuItem} from '@mui/joy'
import Person from '@mui/icons-material/Person'
import {MoreVert} from '@mui/icons-material'
import {getSigninUrl, goToLink} from '@/utils/casdoor.ts'

export const Route = createRootRoute({
	component: () => (
		<>
			<Box
				component="nav"
				sx={{flexGrow: 1}}
			>
				<List orientation="horizontal">
					<ListItem>
						<Home />
					</ListItem>
					<ListDivider />
					<ListItem>
						<Link to="/products">Products</Link>
					</ListItem>
					<ListDivider />
					<ListItem>
						<Link to="/balance">Balance</Link>
					</ListItem>
					<ListDivider />
					<ListItem>
						<Link to="/addresses">Addresses</Link>
					</ListItem>
					<ListDivider />
					<ListItem>
						<Link to="/carts">Carts</Link>
					</ListItem>
					<ListDivider />
					<ListItem>
						<Link to="/credit_cards">CreditCards</Link>
					</ListItem>
					<ListDivider />
					<ListItem>
						<Link to="/orders">Orders</Link>
					</ListItem>
					<ListDivider />
					<ListItem>
						<Link to="/cards">My Cards</Link>
					</ListItem>
					<ListDivider />
					<ListItem>
						<Link to="/checkout">Checkout</Link>
					</ListItem>
					<ListDivider />
					<ListItem>
						<Link to="/profile">My account</Link>
					</ListItem>
					<ListItem sx={{marginInlineStart: 'auto'}}>
						<Box>
							<Dropdown>
								<MenuButton slots={{root: Person}}>
									<MoreVert />
								</MenuButton>
								<Menu>
									<MenuItem onClick={() => goToLink(getSigninUrl())}>
										Login
									</MenuItem>
									<MenuItem>
										<Link to="/profile">My account</Link>
									</MenuItem>
									<MenuItem>
										<Link to="/logout">Logout</Link>
									</MenuItem>
								</Menu>
							</Dropdown>
						</Box>
					</ListItem>
				</List>
			</Box>

			<Outlet />
		</>
	),
})
