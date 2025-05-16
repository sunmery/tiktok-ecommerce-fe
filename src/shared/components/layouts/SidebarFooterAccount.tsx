import * as React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import { SidebarFooterProps } from '@toolpad/core/DashboardLayout';
import {
    Account,
    AccountPopoverFooter,
    AccountPreview,
    AccountPreviewProps,
    SignOutButton,
} from '@toolpad/core/Account';
import { useSnapshot } from "valtio/react";
import { userStore } from "@/store/user.ts";
import { Avatar } from "@mui/joy";

function AccountSidebarPreview(props: AccountPreviewProps & { mini: boolean }) {
    const {handleClick, open, mini} = props;
    return (
        <Stack direction="column" p={0}>
            <Divider/>
            <AccountPreview
                variant={mini ? 'condensed' : 'expanded'}
                handleClick={handleClick}
                open={open}
            />
        </Stack>
    );
}

function SidebarFooterAccountPopover() {
    const {account} = useSnapshot(userStore)

    return (
        <Stack direction="column">
            <Typography variant="body2" mx={2} mt={1}>
                Accounts
            </Typography>
            <MenuList>
                <MenuItem
                    component="button"
                    sx={{
                        justifyContent: 'flex-start',
                        width: '100%',
                        columnGap: 2,
                    }}
                >
                    <ListItemIcon>
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                fontSize: '0.95rem',
                            }}
                            src={account.avatar ?? ''}
                            alt={account.name ?? ''}
                        >
                            {account.name[0]}
                        </Avatar>
                    </ListItemIcon>
                    <ListItemText
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            width: '100%',
                        }}
                        primary={account.name}
                        secondary={account.email}
                        primaryTypographyProps={{variant: 'body2'}}
                        secondaryTypographyProps={{variant: 'caption'}}
                    />
                </MenuItem>

            </MenuList>
            <Divider/>
            <AccountPopoverFooter>
                <SignOutButton/>
            </AccountPopoverFooter>
        </Stack>
    );
}

const createPreviewComponent = (mini: boolean) => {
    function PreviewComponent(props: AccountPreviewProps) {
        return <AccountSidebarPreview {...props} mini={mini}/>;
    }

    return PreviewComponent;
};

export default function SidebarFooterAccount({mini}: SidebarFooterProps) {
    const PreviewComponent = React.useMemo(() => createPreviewComponent(mini), [mini]);
    return (
        <Account
            slots={{
                preview: PreviewComponent,
                popoverContent: SidebarFooterAccountPopover,
            }}
            slotProps={{
                popover: {
                    transformOrigin: {horizontal: 'left', vertical: 'bottom'},
                    anchorOrigin: {horizontal: 'right', vertical: 'bottom'},
                    disableAutoFocus: true,
                    slotProps: {
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: (theme) =>
                                    `drop-shadow(0px 2px 8px ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.32)'})`,
                                mt: 1,
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    bottom: 10,
                                    left: 0,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translate(-50%, -50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        },
                    },
                },
            }}
        />
    );
}
