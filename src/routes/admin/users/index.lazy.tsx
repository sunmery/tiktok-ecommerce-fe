import { createLazyFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Table,
  Sheet,
  Button,
  IconButton,
  Modal,
  ModalDialog,
  ModalClose,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  Divider,
  Chip,
  Tooltip
} from '@mui/joy'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSnapshot } from 'valtio/react'
import { userStore } from '@/store/user.ts'
import { useNavigate } from '@tanstack/react-router'
import { User, MerchantApplication, EditUserForm, NewUserForm, RoleNames } from '@/types/admin'

export const Route = createLazyFileRoute('/admin/users/')({ 
  component: UserManagement,
})

// 模拟用户数据
const mockUsers = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'consumer',
    createdTime: '2023-01-15T08:30:00Z',
    isDeleted: false
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    role: 'merchant',
    createdTime: '2023-02-20T10:15:00Z',
    isDeleted: false
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    role: 'merchant',
    createdTime: '2023-03-10T14:45:00Z',
    isDeleted: false,
    pendingApproval: true
  },
  {
    id: '4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    role: 'consumer',
    createdTime: '2023-04-05T09:20:00Z',
    isDeleted: false
  },
  {
    id: '5',
    name: '钱七',
    email: 'qianqi@example.com',
    role: 'admin',
    createdTime: '2023-05-12T16:30:00Z',
    isDeleted: false
  }
]

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
  const { account } = useSnapshot(userStore)
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [applications, setApplications] = useState<MerchantApplication[]>(mockMerchantApplications)
  
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openApprovalModal, setOpenApprovalModal] = useState(false)
  const [openAddModal, setOpenAddModal] = useState(false)
  
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentApplication, setCurrentApplication] = useState<MerchantApplication | null>(null)
  
  const [editForm, setEditForm] = useState<EditUserForm>({
    name: '',
    email: '',
    role: 'consumer'
  })
  
  const [newUser, setNewUser] = useState<NewUserForm>({
    name: '',
    email: '',
    role: 'consumer',
    password: ''
  })

  // 检查用户是否为管理员，如果不是则重定向到首页
  useEffect(() => {
    if (account.role !== 'admin') {
      navigate({ to: '/' }).then(() => {
        console.log('非管理员用户，已重定向到首页')
      })
    }
  }, [account.role, navigate])

  // 处理编辑用户
  const handleEditUser = (user: User) => {
    setCurrentUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role
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
  const saveUserEdit = () => {
    if (!currentUser) return
    setUsers(users.map(user => 
      user.id === currentUser.id ? { ...user, ...editForm } : user
    ))
    setOpenEditModal(false)
  }

  // 确认删除用户
  const confirmDeleteUser = () => {
    if (!currentUser) return
    setUsers(users.map(user => 
      user.id === currentUser.id ? { ...user, isDeleted: true } : user
    ))
    setOpenDeleteModal(false)
  }

  // 处理商家申请审批
  const handleMerchantApproval = (approved: boolean) => {
    if (!currentApplication) return
    // 更新申请状态
    setApplications(applications.map(app => 
      app.id === currentApplication.id ? 
        { ...app, status: approved ? 'approved' : 'rejected' } : app
    ))
    
    // 如果批准，更新用户角色
    if (approved) {
      setUsers(users.map(user => 
        user.id === currentApplication.userId ? 
          { ...user, role: 'merchant', pendingApproval: false } : user
      ))
    } else {
      setUsers(users.map(user => 
        user.id === currentApplication.userId ? 
          { ...user, pendingApproval: false } : user
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
        displayName: newUser.name,
        updatedTime: now
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
    'admin': '管理员',
    'merchant': '商家',
    'consumer': '消费者'
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* 删除了面包屑导航 */}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography level="h2">用户管理</Typography>
        <Button 
          color="primary" 
          onClick={() => setOpenAddModal(true)}
        >
          添加用户
        </Button>
      </Box>

      <Sheet variant="outlined" sx={{ borderRadius: 'md', overflow: 'auto', mb: 5 }}>
        <Table stickyHeader hoverRow>
          <thead>
            <tr>
              <th style={{ width: '5%' }}>ID</th>
              <th style={{ width: '15%' }}>用户名</th>
              <th style={{ width: '20%' }}>邮箱</th>
              <th style={{ width: '15%' }}>角色</th>
              <th style={{ width: '20%' }}>创建时间</th>
              <th style={{ width: '25%' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(user => !user.isDeleted).map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.pendingApproval ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip color="warning" size="sm">{roleNames[user.role]}</Chip>
                      <Chip 
                        color="danger" 
                        size="sm" 
                        onClick={() => handleViewApplication(user.id)}
                        sx={{ cursor: 'pointer' }}
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
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="sm" 
                      variant="outlined" 
                      color="neutral"
                      onClick={() => handleEditUser(user)}
                    >
                      <Tooltip title="编辑用户"><EditIcon /></Tooltip>
                    </IconButton>
                    <IconButton 
                      size="sm" 
                      variant="outlined" 
                      color="danger"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <Tooltip title="删除用户"><DeleteIcon /></Tooltip>
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
          <ModalClose />
          <Typography level="h4">编辑用户</Typography>
          <Divider sx={{ my: 2 }} />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              saveUserEdit();
            }}
          >
            <FormControl sx={{ mb: 2 }}>
              <FormLabel>用户名</FormLabel>
              <Input 
                value={editForm.name} 
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            </FormControl>
            <FormControl sx={{ mb: 2 }}>
              <FormLabel>邮箱</FormLabel>
              <Input 
                type="email" 
                value={editForm.email} 
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              />
            </FormControl>
            <FormControl sx={{ mb: 2 }}>
              <FormLabel>角色</FormLabel>
              <Select 
                value={editForm.role}
                onChange={(_, value) => setEditForm({...editForm, role: value})}
              >
                <Option value="admin">管理员</Option>
                <Option value="merchant">商家</Option>
                <Option value="consumer">消费者</Option>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
              <Button type="submit" color="primary">保存</Button>
            </Box>
          </form>
        </ModalDialog>
      </Modal>

      {/* 删除用户确认模态框 */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4">确认删除</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography>您确定要删除用户 "{currentUser?.name}" 吗？此操作不可撤销。</Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" color="neutral" onClick={() => setOpenDeleteModal(false)}>取消</Button>
            <Button color="danger" onClick={confirmDeleteUser}>删除</Button>
          </Box>
        </ModalDialog>
      </Modal>

      {/* 商家申请审批模态框 */}
      <Modal open={openApprovalModal} onClose={() => setOpenApprovalModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4">商家申请审批</Typography>
          <Divider sx={{ my: 2 }} />
          {currentApplication && (
            <Box>
              <Typography level="body-md" sx={{ mb: 1 }}>
                <strong>申请ID:</strong> {currentApplication.id}
              </Typography>
              <Typography level="body-md" sx={{ mb: 1 }}>
                <strong>商家名称:</strong> {currentApplication.businessName}
              </Typography>
              <Typography level="body-md" sx={{ mb: 1 }}>
                <strong>营业执照:</strong> {currentApplication.businessLicense}
              </Typography>
              <Typography level="body-md" sx={{ mb: 1 }}>
                <strong>联系电话:</strong> {currentApplication.contactPhone}
              </Typography>
              <Typography level="body-md" sx={{ mb: 1 }}>
                <strong>申请日期:</strong> {currentApplication.applicationDate}
              </Typography>
              <Typography level="body-md" sx={{ mb: 2 }}>
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
