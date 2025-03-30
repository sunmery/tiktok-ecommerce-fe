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
import {userStore} from '@/store/user.ts'
import {EditUserForm, MerchantApplication, NewUserForm, RoleNames, User} from '@/types/admin'
import {userService} from "@/api/userService.ts";
import {t} from "i18next";
import {UserProfile} from "@/types/user.ts";

export const Route = createLazyFileRoute('/admin/users/')({
    component: UserManagement,
})


// 模拟商家申请数据
const mockMerchantApplications = [
    {
        id: '101',
        userId: '3',
        businessName: '王五电子商店',
        businessLicense: 'BL12345678',
        contactPhone: '13800138000',
        applicationDate: '2023-03-08T11:30:00Z',
        status: 'pending'
    }
]

function UserManagement() {
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const [users, setUsers] = useState<UserProfile[]>([])

    // 从API加载用户数据
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await userService.listUsers()
                setUsers(response.users)
            } catch (err) {
                console.error('加载用户数据失败:', err)
            }
        }
        loadUsers()
    }, [])
    const [applications, setApplications] = useState<MerchantApplication[]>(mockMerchantApplications)

    const [openEditModal, setOpenEditModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [openApprovalModal, setOpenApprovalModal] = useState(false)
    const [openAddModal, setOpenAddModal] = useState(false)

    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [currentApplication, setCurrentApplication] = useState<MerchantApplication | null>(null)

    const [editForm, setEditForm] = useState<EditUserForm>({
        id: '',
        name: '',
        email: '',
        signupApplication: ''
    })

    const [newUser, setNewUser] = useState<NewUserForm>({
        id: '',
        name: '',
        email: '',
        avatar: "",
        displayName: "",
        owner: "",
        signupApplication: "",
        password: ''
    })

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
    const handleViewApplication = (userId: string) => {
        const application = applications.find(app => app.userId === userId)
        if (application) {
            setCurrentApplication(application)
            setOpenApprovalModal(true)
        }
    }

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

            // 更新成功后刷新用户列表
            const response = await userService.listUsers()
            setUsers(response.users)

            // 显示成功消息
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

            // 删除成功后更新本地状态
            setUsers(users.map(user =>
                user.id === currentUser.id ? {...user, isDeleted: true} : user
            ))

            // 关闭模态框
            setOpenDeleteModal(false)
        } catch (error) {
            console.error('删除用户失败:', error)
            // 可以在这里添加错误提示
        }
    }

    // 处理商家申请审批
    const handleMerchantApproval = (approved: boolean) => {
        if (!currentApplication) return
        // 更新申请状态
        setApplications(applications.map(app =>
            app.id === currentApplication.id ?
                {...app, status: approved ? 'approved' : 'rejected'} : app
        ))

        // 如果批准，更新用户角色
        if (approved) {
            setUsers(users.map(user =>
                user.id === currentApplication.userId ?
                    {...user, role: 'merchant', pendingApproval: false} : user
            ))
        } else {
            setUsers(users.map(user =>
                user.id === currentApplication.userId ?
                    {...user, pendingApproval: false} : user
            ))
        }

        setOpenApprovalModal(false)
    }

    // 添加新用户
    const addNewUser = () => {
        const newId = (Math.max(...users.map(u => parseInt(u.id))) + 1).toString()
        const now = new Date().toISOString()

        setUsers([
            ...users,
            {
                id: newId,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                createdTime: now,
                isDeleted: false,
                owner: '',
                avatar: '',
                displayName: newUser.displayName,
                updatedTime: now,
            }
        ])

        setNewUser({
            name: '',
            email: '',
            role: 'consumer',
            password: ''
        })

        setOpenAddModal(false)
    }

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

    return (
        <Box sx={{p: 2}}>
            {/* 删除了面包屑导航 */}

            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography level="h2">用户管理</Typography>
                <Button
                    color="primary"
                    onClick={() => setOpenAddModal(true)}
                >
                    添加用户
                </Button>
            </Box>

            <Sheet variant="outlined" sx={{borderRadius: 'md', overflow: 'auto', mb: 5}}>
                <Table stickyHeader hoverRow>
                    <thead>
                    <tr>
                        <th style={{width: '15%'}}>应用</th>
                        <th style={{width: '15%'}}>用户名</th>
                        <th style={{width: '20%'}}>邮箱</th>
                        <th style={{width: '15%'}}>角色</th>
                        <th style={{width: '20%'}}>创建时间</th>
                        <th style={{width: '25%'}}>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.signupApplication}</td>
                            <td>{user.displayName}</td>
                            <td>{user.email}</td>
                            <td>
                                {user.pendingApproval ? (
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        <Chip color="warning" size="sm">{roleNames[user.role]}</Chip>
                                        <Chip
                                            color="danger"
                                            size="sm"
                                            onClick={() => handleViewApplication(user.id)}
                                            sx={{cursor: 'pointer'}}
                                        >
                                            待审批
                                        </Chip>
                                    </Box>
                                ) : (
                                    <Chip
                                        color={user.role === 'admin' ? 'success' :
                                            user.role === 'merchant' ? 'primary' : 'neutral'}
                                        size="sm"
                                    >
                                        {roleNames[user.role]}
                                    </Chip>
                                )}
                            </td>
                            <td>{formatDate(user.createdTime)}</td>
                            <td>
                                <Box sx={{display: 'flex', gap: 1}}>
                                    <IconButton
                                        size="sm"
                                        variant="outlined"
                                        color="neutral"
                                        onClick={() => handleEditUser(user)}
                                    >
                                        <Tooltip title="编辑用户"><EditIcon/></Tooltip>
                                    </IconButton>
                                    <IconButton
                                        size="sm"
                                        variant="outlined"
                                        color="danger"
                                        onClick={() => handleDeleteUser(user)}
                                    >
                                        <Tooltip title="删除用户"><DeleteIcon/></Tooltip>
                                    </IconButton>
                                    {user.pendingApproval && (
                                        <Button
                                            size="sm"
                                            color="warning"
                                            onClick={() => handleViewApplication(user.id)}
                                        >
                                            审批申请
                                        </Button>
                                    )}
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
                    <Typography level="h4">编辑用户</Typography>
                    <Divider sx={{my: 2}}/>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            saveUserEdit();
                        }}
                    >
                        <FormControl sx={{mb: 2}}>
                            <FormLabel>用户名</FormLabel>
                            <Input
                                value={editForm.name}
                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            />
                        </FormControl>
                        <FormControl sx={{mb: 2}}>
                            <FormLabel>昵称</FormLabel>
                            <Input
                                value={editForm.displayName}
                                onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                            />
                        </FormControl>
                        <FormControl sx={{mb: 2}}>
                            <FormLabel>邮箱</FormLabel>
                            <Input
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            />
                        </FormControl>

                        <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2}}>
                            <Button type="submit" color="primary">保存</Button>
                        </Box>
                    </form>
                </ModalDialog>
            </Modal>

            {/* 删除用户确认模态框 */}
            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <ModalDialog>
                    <ModalClose/>
                    <Typography level="h4">确认删除</Typography>
                    <Divider sx={{my: 2}}/>
                    <Typography>您确定要删除用户 "{currentUser?.name}" 吗？此操作不可撤销。</Typography>
                    <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2}}>
                        <Button variant="outlined" color="neutral"
                                onClick={() => setOpenDeleteModal(false)}>取消</Button>
                        <Button color="danger" onClick={confirmDeleteUser}>删除</Button>
                    </Box>
                </ModalDialog>
            </Modal>

            {/* 商家申请审批模态框 */}
            <Modal open={openApprovalModal} onClose={() => setOpenApprovalModal(false)}>
                <ModalDialog>
                    <ModalClose/>
                    <Typography level="h4">商家申请审批</Typography>
                    <Divider sx={{my: 2}}/>
                    {currentApplication && (
                        <Box>
                            <Typography level="body-md" sx={{mb: 1}}>
                                <strong>申请ID:</strong> {currentApplication.id}
                            </Typography>
                            <Typography level="body-md" sx={{mb: 1}}>
                                <strong>商家名称:</strong> {currentApplication.businessName}
                            </Typography>
                            <Typography level="body-md" sx={{mb: 1}}>
                                <strong>营业执照:</strong> {currentApplication.businessLicense}
                            </Typography>
                            <Typography level="body-md" sx={{mb: 1}}>
                                <strong>联系电话:</strong> {currentApplication.contactPhone}
                            </Typography>
                            <Typography level="body-md" sx={{mb: 1}}>
                                <strong>申请日期:</strong> {currentApplication.applicationDate}
                            </Typography>
                            <Typography level="body-md" sx={{mb: 2}}>
                                <strong>当前状态:</strong> {currentApplication.status}
                            </Typography>
                        </Box>
                    )}
                </ModalDialog>
            </Modal>
        </Box>
    )
}

export default UserManagement
