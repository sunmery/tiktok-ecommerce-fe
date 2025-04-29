import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import {useEffect, useState} from 'react'
import {
    Box,
    Button,
    Chip,
    Divider,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Modal,
    ModalClose,
    ModalDialog,
    Sheet,
    Table,
    Tooltip,
    Typography
} from '@mui/joy'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user'
import {EditUserForm, MerchantApplication, RoleNames, User} from '@/types/admin'
import {userService} from "@/api/userService";
import {t} from "i18next";
import {UserProfile} from "@/types/user";
import {showMessage} from "@/utils/showMessage.ts";
import RefreshIcon from '@mui/icons-material/Refresh'
import {useQuery, useQueryClient} from '@tanstack/react-query'

export const Route = createLazyFileRoute('/admin/users/')({
    component: UserManagement,
})


// 模拟商家申请数据
// const mockMerchantApplications = [
//     {
//         id: '101',
//         userId: '3',
//         businessName: '王五电子商店',
//         businessLicense: 'BL12345678',
//         contactPhone: '13800138000',
//         applicationDate: '2023-03-08T11:30:00Z',
//         status: 'pending'
//     }
// ]

function UserManagement() {
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    // 获取用户列表
    const {data: users} = useQuery<UserProfile[]>({
        queryKey: ['users'],
        queryFn: async () => {
            try {
                const response = await userService.listUsers()
                return response.users
            } catch (err) {
                showMessage(t('admin.users.loadError') + err, 'error')
                throw err
            }
        }
    })

    // 刷新用户列表
    const handleRefresh = () => {
        queryClient.invalidateQueries({queryKey: ['users']}).then(() => {
            showMessage(t('admin.users.refreshing'), 'info')
        }).then(() => {
            showMessage(t('admin.users.refreshSuccess'), 'success')
        }).catch(err => {
            showMessage(t('admin.users.refreshError') + err, 'error')
        })

    }

    // const [applications, setApplications] = useState<MerchantApplication[]>(mockMerchantApplications)

    const [openEditModal, setOpenEditModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [openApprovalModal, setOpenApprovalModal] = useState(false)
    const [, setOpenAddModal] = useState(false)

    const [currentUser, setCurrentUser] = useState<User | null>(null)
    // const [currentApplication, setCurrentApplication] = useState<MerchantApplication | null>(null)
    const [currentApplication,] = useState<MerchantApplication | null>(null)

    const [editForm, setEditForm] = useState<EditUserForm>({
        id: '',
        name: '',
        email: '',
        signupApplication: ''
    })

    // const [newUser, setNewUser] = useState<NewUserForm>({
    //     id: '',
    //     name: '',
    //     email: '',
    //     avatar: "",
    //     displayName: "",
    //     owner: "",
    //     signupApplication: "",
    //     password: ''
    // })

    // 检查用户是否为管理员，如果不是则重定向到首页
    useEffect(() => {
        if (account.role !== 'admin') {
            navigate({to: '/'}).then(() => {
                console.log(`非{t('admin.users.roles.admin')}用户，已重定向到首页`)
            })
        }
    }, [account.role, navigate])

    // 处理编辑用户
    const handleEditUser = (user: User) => {
        setCurrentUser(user)
        setEditForm({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            owner: user.owner,
            displayName: user.displayName,
            signupApplication: user.signupApplication
        })
        setOpenEditModal(true)
    }

    // 处理删除用户
    const handleDeleteUser = (user: User) => {
        setCurrentUser(user)
        setOpenDeleteModal(true)
    }

    // 处理查看商家申请
    // const handleViewApplication = (userId: string) => {
    //     const application = applications.find(app => app.userId === userId)
    //     if (application) {
    //         setCurrentApplication(application)
    //         setOpenApprovalModal(true)
    //     }
    // }

    // 保存编辑的用户信息
    const saveUserEdit = async () => {
        if (!currentUser) return
        try {
            // 调用后端UpdateUser接口
            await userService.updateUser(
                currentUser.id,
                {
                    ...editForm,
                    owner: currentUser.owner,
                    displayName: editForm.displayName
                }
            )

            alert('用户信息更新成功')

            // 关闭模态框
            setOpenEditModal(false)
        } catch (error) {
            console.error('更新用户信息失败:', error)
            // 显示错误消息
            alert('更新用户信息失败，请重试')
        }
    }

    // 确认删除用户
    const confirmDeleteUser = async () => {
        if (!currentUser) return
        try {
            // 调用后端DeleteUser接口
            await userService.deleteUser(
                currentUser.id,
                currentUser.owner,
                currentUser.name
            )

            // 关闭模态框
            setOpenDeleteModal(false)
        } catch (error) {
            console.error('删除用户失败:', error)
            // 可以在这里添加错误提示
        }
    }

    // 处理商家申请审批
    // const handleMerchantApproval = (approved: boolean) => {
    //     if (!currentApplication) return
    //     // 更新申请状态
    //     setApplications(applications.map(app =>
    //         app.id === currentApplication.id ?
    //             {...app, status: approved ? 'approved' : 'rejected'} : app
    //     ))
    //
    //     // 如果批准，更新用户角色
    //     if (approved) {
    //         setUsers(users.map(user =>
    //             user.id === currentApplication.userId ?
    //                 {...user, role: 'merchant', pendingApproval: false} : user
    //         ))
    //     } else {
    //         setUsers(users.map(user =>
    //             user.id === currentApplication.userId ?
    //                 {...user, pendingApproval: false} : user
    //         ))
    //     }
    //
    //     setOpenApprovalModal(false)
    // }

    // 添加新用户
    // const addNewUser = () => {
    //     const newId = (Math.max(...users.map(u => parseInt(u.id))) + 1).toString()
    //     const now = new Date().toISOString()
    //
    //     setUsers([
    //         ...users,
    //         {
    //             id: newId,
    //             name: newUser.name,
    //             email: newUser.email,
    //             isDeleted: false,
    //             owner: '',
    //             avatar: '',
    //             role: '',
    //             displayName: '',
    //         }
    //     ])
    //
    //     setNewUser({
    //         avatar: "",
    //         displayName: "",
    //         id: "",
    //         owner: "",
    //         signupApplication: "",
    //         name: '',
    //         email: '',
    //         password: ''
    //     })
    //
    //     setOpenAddModal(false)
    // }

    // 格式化日期显示
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('cn')
    }

    // 角色名称映射
    const roleNames: RoleNames = {
        'admin': t('admin.users.roles.admin'),
        'merchant': t('admin.users.roles.merchant'),
        'consumer': t('admin.users.roles.consumer'),
        'guest': t('admin.users.roles.guest'),
        '': t('admin.users.roles.guest') // 空字符串角色也显示为访客
    }

    if (users) {
        return (
            <Box sx={{p: 2}}>


                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                    <Typography level="h2">{t('admin.users.title')}</Typography>
                    <Box sx={{display: 'flex', gap: 2}}>
                        <IconButton
                            variant="outlined"
                            color="primary"
                            onClick={handleRefresh}
                        >
                            <Tooltip title={t('admin.users.refresh')}><RefreshIcon/></Tooltip>
                        </IconButton>
                        <Button
                            color="primary"
                            onClick={() => window.location.href = 'http://99.suyiiyii.top:3012/users'}
                        >
                            {t('admin.users.add_user')}
                        </Button>
                    </Box>
                </Box>

                <Sheet variant="outlined" sx={{borderRadius: 'md', overflow: 'auto', mb: 5}}>
                    <Table stickyHeader hoverRow>
                        <thead>
                        <tr>
                            <th style={{width: '15%'}}>{t('admin.users.table.application')}</th>
                            <th style={{width: '15%'}}>{t('admin.users.table.username')}</th>
                            <th style={{width: '20%'}}>{t('admin.users.table.email')}</th>
                            <th style={{width: '15%'}}>{t('admin.users.table.role')}</th>
                            <th style={{width: '20%'}}>{t('admin.users.table.created_time')}</th>
                            <th style={{width: '25%'}}>{t('admin.users.table.actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.signupApplication}</td>
                                <td>{user.displayName}</td>
                                <td>{user.email}</td>
                                <td>
                                    {/*{user.isDeleted ? (*/}
                                    {/*    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>*/}
                                    {/*        <Chip color="warning" size="sm">{roleNames[user.role]}</Chip>*/}
                                    {/*        <Chip*/}
                                    {/*            color="danger"*/}
                                    {/*            size="sm"*/}
                                    {/*            onClick={() => handleViewApplication(user.id)}*/}
                                    {/*            sx={{cursor: 'pointer'}}*/}
                                    {/*        >*/}
                                    {/*            {t('admin.users.pending_approval')}*/}
                                    {/*        </Chip>*/}
                                    {/*    </Box>*/}
                                    {/*) : (*/}
                                    <Chip
                                        color={user.role === 'admin' ? 'success' :
                                            user.role === 'merchant' ? 'primary' :
                                                user.role === 'consumer' ? 'warning' : 'neutral'}
                                        variant="solid"
                                        size="sm"
                                    >
                                        {roleNames[user.role]}
                                    </Chip>
                                    {/*)}*/}
                                </td>
                                <td>{formatDate(user.createdTime as string)}</td>
                                <td>
                                    <Box sx={{display: 'flex', gap: 1}}>
                                        <IconButton
                                            size="sm"
                                            variant="outlined"
                                            color="neutral"
                                            onClick={() => handleEditUser(user as User)}
                                        >
                                            <Tooltip title="编辑用户"><EditIcon/></Tooltip>
                                        </IconButton>
                                        <IconButton
                                            size="sm"
                                            variant="outlined"
                                            color="danger"
                                            onClick={() => handleDeleteUser(user as User)}
                                        >
                                            <Tooltip title="删除用户"><DeleteIcon/></Tooltip>
                                        </IconButton>
                                        {/*{user.pendingApproval && (*/}
                                        {/*    <Button*/}
                                        {/*        size="sm"*/}
                                        {/*        color="warning"*/}
                                        {/*        onClick={() => handleViewApplication(user.id)}*/}
                                        {/*    >*/}
                                        {/*        {t('admin.users.approve_application')}*/}
                                        {/*    </Button>*/}
                                        {/*)}*/}
                                    </Box>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Sheet>

                {/* 编辑用户模态框 */}
                <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
                    <ModalDialog>
                        <ModalClose/>
                        <Typography level="h4">{t('admin.users.edit.title')}</Typography>
                        <Divider sx={{my: 2}}/>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                saveUserEdit().then(() => {
                                    showMessage(t('admin.users.edit.success'), 'success')
                                }).catch((err) => {
                                    showMessage(t('admin.users.edit.error') + err, 'error')
                                })
                            }}
                        >
                            <FormControl sx={{mb: 2}}>
                                <FormLabel>{t('admin.users.edit.username')}</FormLabel>
                                <Input
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                />
                            </FormControl>
                            <FormControl sx={{mb: 2}}>
                                <FormLabel>{t('admin.users.edit.display_name')}</FormLabel>
                                <Input
                                    value={editForm.displayName}
                                    onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                                />
                            </FormControl>
                            <FormControl sx={{mb: 2}}>
                                <FormLabel>{t('admin.users.edit.email')}</FormLabel>
                                <Input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                />
                            </FormControl>

                            <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2}}>
                                <Button type="submit" color="primary">{t('admin.users.edit.save')}</Button>
                            </Box>
                        </form>
                    </ModalDialog>
                </Modal>

                {/* 删除用户确认模态框 */}
                <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                    <ModalDialog>
                        <ModalClose/>
                        <Typography level="h4">{t('admin.users.delete.title')}</Typography>
                        <Divider sx={{my: 2}}/>
                        <Typography>{t('admin.users.delete.confirm', {username: currentUser?.name})}</Typography>
                        <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2}}>
                            <Button variant="outlined" color="neutral"
                                    onClick={() => setOpenDeleteModal(false)}>{t('admin.users.delete.cancel')}</Button>
                            <Button color="danger"
                                    onClick={confirmDeleteUser}>{t('admin.users.delete.confirm_button')}</Button>
                        </Box>
                    </ModalDialog>
                </Modal>

                {/* 商家申请审批模态框 */}
                <Modal open={openApprovalModal} onClose={() => setOpenApprovalModal(false)}>
                    <ModalDialog>
                        <ModalClose/>
                        <Typography level="h4">{t('admin.users.merchant_approval.title')}</Typography>
                        <Divider sx={{my: 2}}/>
                        {currentApplication && (
                            <Box>
                                <Typography level="body-md" sx={{mb: 1}}>
                                    <strong>{t('admin.users.merchant_approval.application_id')}:</strong> {currentApplication.id}
                                </Typography>
                                <Typography level="body-md" sx={{mb: 1}}>
                                    <strong>{t('admin.users.merchant_approval.business_name')}:</strong> {currentApplication.businessName}
                                </Typography>
                                <Typography level="body-md" sx={{mb: 1}}>
                                    <strong>{t('admin.users.merchant_approval.business_license')}:</strong> {currentApplication.businessLicense}
                                </Typography>
                                <Typography level="body-md" sx={{mb: 1}}>
                                    <strong>{t('admin.users.merchant_approval.contact_phone')}:</strong> {currentApplication.contactPhone}
                                </Typography>
                                <Typography level="body-md" sx={{mb: 1}}>
                                    <strong>{t('admin.users.merchant_approval.application_date')}:</strong> {currentApplication.applicationDate}
                                </Typography>
                                <Typography level="body-md" sx={{mb: 2}}>
                                    <strong>{t('admin.users.merchant_approval.current_status')}:</strong> {currentApplication.status}
                                </Typography>
                            </Box>
                        )}
                    </ModalDialog>
                </Modal>
            </Box>
        )
    }
}

export default UserManagement


