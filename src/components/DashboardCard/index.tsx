import React from 'react'
import {Button, Card, CardContent, Divider, List, ListItem, SxProps, Typography} from '@mui/joy'
import {Theme} from '@mui/joy/styles'

interface DashboardCardProps {
    title: string
    items: string[]
    buttonText: string
    icon: React.ReactNode
    onClick: () => void
    sx?: SxProps<Theme>
    cardSx?: SxProps<Theme>
    contentSx?: SxProps<Theme>
}

/**
 * 管理员仪表盘卡片组件
 * 用于显示功能区块，包含标题、列表项和操作按钮
 */
const DashboardCard: React.FC<DashboardCardProps> = ({
                                                         title,
                                                         items,
                                                         buttonText,
                                                         icon,
                                                         onClick,
                                                         sx = {},
                                                         cardSx = {},
                                                         contentSx = {}
                                                     }) => {
    return (
        <Card variant="outlined" sx={{height: '100%', ...cardSx}}>
            <CardContent sx={{p: 2, ...contentSx}}>
                <Typography level="h3">{title}</Typography>
                <Divider sx={{my: 2}}/>
                <List>
                    {items.map((item, index) => (
                        <ListItem key={index}>
                            <ListItem>{item}</ListItem>
                        </ListItem>
                    ))}
                </List>
                <Button
                    variant="solid"
                    color="primary"
                    startDecorator={icon}
                    onClick={onClick}
                    fullWidth
                    sx={{mt: 2, ...sx}}
                >
                    {buttonText}
                </Button>
            </CardContent>
        </Card>
    )
}

export default DashboardCard
