import { createLazyFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Table,
  Sheet,
  Button,
  IconButton,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Select,
  Option,
  Input,
  Chip,
  Divider,
  Modal,
  ModalDialog,
  ModalClose,
  FormControl,
  FormLabel,
  Textarea
} from '@mui/joy'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import StorageIcon from '@mui/icons-material/Storage'
import TableViewIcon from '@mui/icons-material/TableView'
import CodeIcon from '@mui/icons-material/Code'
import { useSnapshot } from 'valtio/react'
import { userStore } from '@/store/user.ts'
import { useNavigate } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/database/')({ 
  component: DatabaseManagement,
})

// 模拟数据库表结构
const mockSchemas = [
  { name: 'public', description: '公共模式' },
  { name: 'auth', description: '认证模式' },
  { name: 'ecommerce', description: '电商模式' }
]

// 模拟表数据
const mockTables = {
  'public': [
    { name: 'users', description: '用户表' },
    { name: 'roles', description: '角色表' },
    { name: 'permissions', description: '权限表' }
  ],
  'auth': [
    { name: 'sessions', description: '会话表' },
    { name: 'tokens', description: '令牌表' }
  ],
  'ecommerce': [
    { name: 'products', description: '商品表' },
    { name: 'orders', description: '订单表' },
    { name: 'cart_items', description: '购物车项表' },
    { name: 'categories', description: '分类表' },
    { name: 'merchants', description: '商家表' }
  ]
}

// 模拟表结构
const mockTableStructures = {
  'users': [
    { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: 'uuid_generate_v4()' },
    { column_name: 'name', data_type: 'varchar(255)', is_nullable: 'NO', column_default: null },
    { column_name: 'email', data_type: 'varchar(255)', is_nullable: 'NO', column_default: null },
    { column_name: 'password_hash', data_type: 'varchar(255)', is_nullable: 'NO', column_default: null },
    { column_name: 'role', data_type: 'varchar(50)', is_nullable: 'NO', column_default: null },
    { column_name: 'created_at', data_type: 'timestamp', is_nullable: 'NO', column_default: 'CURRENT_TIMESTAMP' },
    { column_name: 'updated_at', data_type: 'timestamp', is_nullable: 'YES', column_default: null },
    { column_name: 'is_deleted', data_type: 'boolean', is_nullable: 'NO', column_default: 'false' }
  ],
  'products': [
    { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: 'uuid_generate_v4()' },
    { column_name: 'name', data_type: 'varchar(255)', is_nullable: 'NO', column_default: null },
    { column_name: 'description', data_type: 'text', is_nullable: 'YES', column_default: null },
    { column_name: 'price', data_type: 'decimal(10,2)', is_nullable: 'NO', column_default: null },
    { column_name: 'merchant_id', data_type: 'uuid', is_nullable: 'NO', column_default: null },
    { column_name: 'status', data_type: 'integer', is_nullable: 'NO', column_default: '0' },
    { column_name: 'quantity', data_type: 'integer', is_nullable: 'NO', column_default: '0' },
    { column_name: 'created_at', data_type: 'timestamp', is_nullable: 'NO', column_default: 'CURRENT_TIMESTAMP' },
    { column_name: 'updated_at', data_type: 'timestamp', is_nullable: 'YES', column_default: null }
  ],
  'orders': [
    { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: 'uuid_generate_v4()' },
    { column_name: 'user_id', data_type: 'uuid', is_nullable: 'NO', column_default: null },
    { column_name: 'status', data_type: 'varchar(50)', is_nullable: 'NO', column_default: null },
    { column_name: 'total_amount', data_type: 'decimal(10,2)', is_nullable: 'NO', column_default: null },
    { column_name: 'created_at', data_type: 'timestamp', is_nullable: 'NO', column_default: 'CURRENT_TIMESTAMP' },
    { column_name: 'updated_at', data_type: 'timestamp', is_nullable: 'YES', column_default: null }
  ],
  'cart_items': [
    { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: 'uuid_generate_v4()' },
    { column_name: 'user_id', data_type: 'uuid', is_nullable: 'NO', column_default: null },
    { column_name: 'product_id', data_type: 'uuid', is_nullable: 'NO', column_default: null },
    { column_name: 'quantity', data_type: 'integer', is_nullable: 'NO', column_default: '1' },
    { column_name: 'created_at', data_type: 'timestamp', is_nullable: 'NO', column_default: 'CURRENT_TIMESTAMP' },
    { column_name: 'updated_at', data_type: 'timestamp', is_nullable: 'YES', column_default: null }
  ],
  'categories': [
    { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: 'uuid_generate_v4()' },
    { column_name: 'name', data_type: 'varchar(255)', is_nullable: 'NO', column_default: null },
    { column_name: 'description', data_type: 'text', is_nullable: 'YES', column_default: null },
    { column_name: 'parent_id', data_type: 'uuid', is_nullable: 'YES', column_default: null },
    { column_name: 'created_at', data_type: 'timestamp', is_nullable: 'NO', column_default: 'CURRENT_TIMESTAMP' },
    { column_name: 'updated_at', data_type: 'timestamp', is_nullable: 'YES', column_default: null }
  ],
  'merchants': [
    { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: 'uuid_generate_v4()' },
    { column_name: 'user_id', data_type: 'uuid', is_nullable: 'NO', column_default: null },
    { column_name: 'business_name', data_type: 'varchar(255)', is_nullable: 'NO', column_default: null },
    { column_name: 'business_license', data_type: 'varchar(255)', is_nullable: 'NO', column_default: null },
    { column_name: 'contact_phone', data_type: 'varchar(50)', is_nullable: 'NO', column_default: null },
    { column_name: 'status', data_type: 'varchar(50)', is_nullable: 'NO', column_default: 'pending' },
    { column_name: 'created_at', data_type: 'timestamp', is_nullable: 'NO', column_default: 'CURRENT_TIMESTAMP' },
    { column_name: 'updated_at', data_type: 'timestamp', is_nullable: 'YES', column_default: null }
  ]
}

// 模拟表数据
const mockTableData = {
  'users': [
    { id: '1', name: '张三', email: 'zhangsan@example.com', role: 'consumer', created_at: '2023-01-15 08:30:00', is_deleted: false },
    { id: '2', name: '李四', email: 'lisi@example.com', role: 'merchant', created_at: '2023-02-20 10:15:00', is_deleted: false },
    { id: '3', name: '王五', email: 'wangwu@example.com', role: 'merchant', created_at: '2023-03-10 14:45:00', is_deleted: false },
    { id: '4', name: '赵六', email: 'zhaoliu@example.com', role: 'consumer', created_at: '2023-04-05 09:20:00', is_deleted: false },
    { id: '5', name: '钱七', email: 'qianqi@example.com', role: 'admin', created_at: '2023-05-12 16:30:00', is_deleted: false }
  ],
  'products': [
    { id: '101', name: '智能手机', description: '最新款智能手机', price: '3999.00', merchant_id: '2', status: 2, quantity: 100, created_at: '2023-02-25 09:00:00' },
    { id: '102', name: '笔记本电脑', description: '高性能笔记本电脑', price: '6999.00', merchant_id: '2', status: 2, quantity: 50, created_at: '2023-03-01 11:30:00' },
    { id: '103', name: '无线耳机', description: '蓝牙无线耳机', price: '899.00', merchant_id: '3', status: 2, quantity: 200, created_at: '2023-03-15 14:20:00' },
    { id: '104', name: '智能手表', description: '多功能智能手表', price: '1299.00', merchant_id: '3', status: 1, quantity: 80, created_at: '2023-04-10 10:45:00' },
    { id: '105', name: '平板电脑', description: '轻薄平板电脑', price: '2999.00', merchant_id: '2', status: 2, quantity: 60, created_at: '2023-04-20 16:15:00' }
  ],
  'orders': [
    { id: '201', user_id: '1', status: 'completed', total_amount: '3999.00', created_at: '2023-03-01 15:30:00' },
    { id: '202', user_id: '4', status: 'completed', total_amount: '6999.00', created_at: '2023-03-10 09:45:00' },
    { id: '203', user_id: '1', status: 'processing', total_amount: '899.00', created_at: '2023-04-05 14:20:00' },
    { id: '204', user_id: '4', status: 'pending', total_amount: '1299.00', created_at: '2023-04-25 11:10:00' },
    { id: '205', user_id: '1', status: 'completed', total_amount: '2999.00', created_at: '2023-05-05 16:40:00' }
  ]
}

function DatabaseManagement() {
  const { account } = useSnapshot(userStore)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [selectedSchema, setSelectedSchema] = useState('public')
  const [selectedTable, setSelectedTable] = useState('users')
  const [tableData, setTableData] = useState<any[]>([])
  const [tableStructure, setTableStructure] = useState<any[]>([])
  const [tabValue, setTabValue] = useState(0)
  const [sqlQuery, setSqlQuery] = useState('')
  const [queryResult, setQueryResult] = useState<any[]>([])
  const [openSqlModal, setOpenSqlModal] = useState(false)

  // 检查用户是否为管理员，如果不是则重定向到首页
  useEffect(() => {
    if (account.role !== 'admin') {
      navigate({ to: '/' })
    }
    // 模拟加载数据
    const timer = setTimeout(() => {
      setLoading(false)
      // 初始化表数据
      setTableData(mockTableData[selectedTable] || [])
      setTableStructure(mockTableStructures[selectedTable] || [])
    }, 800)
    return () => clearTimeout(timer)
  }, [account.role, navigate])

  // 当选择的模式或表变化时，更新表数据
  useEffect(() => {
    setTableData(mockTableData[selectedTable] || [])
    setTableStructure(mockTableStructures[selectedTable] || [])
  }, [selectedSchema, selectedTable])

  // 处理表格选择
  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName)
  }

  // 处理模式选择
  const handleSchemaChange = (event: any, newValue: string | null) => {
    if (newValue) {
      setSelectedSchema(newValue)
      // 重置选中的表为该模式下的第一个表
      const firstTable = mockTables[newValue]?.[0]?.name
      if (firstTable) {
        setSelectedTable(firstTable)
      }
    }
  }

  // 处理SQL查询
  const handleSqlQuery = () => {
    // 模拟SQL查询执行
    console.log('执行SQL查询:', sqlQuery)
    // 根据查询内容模拟返回结果
    if (sqlQuery.toLowerCase().includes('select') && sqlQuery.toLowerCase().includes('from users')) {
      setQueryResult(mockTableData.users)
    } else if (sqlQuery.toLowerCase().includes('select') && sqlQuery.toLowerCase().includes('from products')) {
      setQueryResult(mockTableData.products)
    } else if (sqlQuery.toLowerCase().includes('select') && sqlQuery.toLowerCase().includes('from orders')) {
      setQueryResult(mockTableData.orders)
    } else {
      // 默认返回空结果
      setQueryResult([])
    }
    setOpenSqlModal(false)
  }

  // 刷新数据
  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setTableData(mockTableData[selectedTable] || [])
      setLoading(false)
    }, 500)
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography level="h2" sx={{ mb: 3 }}>数据库管理</Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>加载中...</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 150px)' }}>
          {/* 左侧导航 */}
          <Box sx={{ width: 250, mr: 2, overflow: 'auto' }}>
            <Typography level="h4" sx={{ mb: 2 }}>
              <StorageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              数据库结构
            </Typography>
            
            <Select
              value={selectedSchema}
              onChange={handleSchemaChange}
              sx={{ mb: 2, width: '100%' }}
            >
              {mockSchemas.map((schema) => (
                <Option key={schema.name} value={schema.name}>
                  {schema.name} - {schema.description}
                </Option>
              ))}
            </Select>
            
            <Typography level="title-md" sx={{ mt: 2, mb: 1 }}>
              <TableViewIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              表
            </Typography>
            
            <Box sx={{ ml: 1 }}>
              {mockTables[selectedSchema]?.map((table) => (
                <Box 
                  key={table.name}
                  onClick={() => handleTableSelect(table.name)}
                  sx={{
                    p: 1,
                    borderRadius: 'sm',
                    cursor: 'pointer',
                    backgroundColor: selectedTable === table.name ? 'primary.100' : 'transparent',
                    '&:hover': {
                      backgroundColor: selectedTable === table.name ? 'primary.100' : 'neutral.100'
                    }
                  }}
                >
                  <Typography>
                    {table.name}
                    <Typography level="body-xs" sx={{ display: 'block', color: 'text.secondary' }}>
                      {table.description}
                    </Typography>
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          
          {/* 右侧内容 */}
          <Box sx={{ flex: 1, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 'sm' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography level="h4">
                {selectedSchema}.{selectedTable}
              </Typography>
              <Box>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startDecorator={<CodeIcon />}
                  onClick={() => setOpenSqlModal(true)}
                  sx={{ mr: 1 }}
                >
                  SQL查询
                </Button>
                <IconButton onClick={handleRefresh}>
                  <RefreshIcon />
                </IconButton>
              </Box>
            </Box>
            
            <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} sx={{ borderRadius: 0 }}>
              <TabList>
                <Tab>数据</Tab>
                <Tab>结构</Tab>
              </TabList>
              <TabPanel value={0} sx={{ p: 0 }}>
                {tableData.length > 0 ? (
                  <Sheet sx={{ height: 'calc(100vh - 280px)', overflow: 'auto' }}>
                    <Table stickyHeader hoverRow>
                      <thead>
                        <tr>
                          {Object.keys(tableData[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value: any, cellIndex) => (
                              <td key={cellIndex}>
                                {typeof value === 'boolean' 
                                  ? value ? 'true' : 'false'
                                  : value === null 
                                    ? 'NULL'
                                    : String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Sheet>
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography>表中没有数据</Typography>
                  </Box>
                )}
              </TabPanel>
              <TabPanel value={1} sx={{ p: 0 }}>
                <Sheet sx={{ height: 'calc(100vh - 280px)', overflow: 'auto' }}>
                  <Table stickyHeader hoverRow>
                    <thead>
                      <tr>
                        <th>列名</th>
                        <th>数据类型</th>
                        <th>可空</th>
                        <th>默认值</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableStructure.map((column, index) => (
                        <tr key={index}>
                          <td>{column.column_name}</td>
                          <td>{column.data_type}</td>
                          <td>
                            <Chip 
                              color={column.is_nullable === 'NO' ? 'danger' : 'success'}
                              size="sm"
                            >
                              {column.is_nullable === 'NO' ? '否' : '是'}
                            </Chip>
                          </td>
                          <td>{column.column_default || 'NULL'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Sheet>
              </TabPanel>
            </Tabs>
          </Box>
        </Box>
      )}
      
      {/* SQL查询模态框 */}
      <Modal open={openSqlModal} onClose={() => setOpenSqlModal(false)}>
        <ModalDialog size="lg">
          <ModalClose />
          <Typography level="h4">SQL查询</Typography>
          <Divider sx={{ my: 2 }} />
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>输入SQL查询语句</FormLabel>
            <Textarea 
              minRows={4} 
              value={sqlQuery} 
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="SELECT * FROM users WHERE role = 'admin';"
            />
          </FormControl>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="plain" color="neutral" onClick={() => setOpenSqlModal(false)}>
              取消
            </Button>
            <Button variant="solid" color="primary" onClick={handleSqlQuery}>
              执行
            </Button>
          </Box>
          
          {queryResult.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography level="title-md" sx={{ mb: 1 }}>查询结果</Typography>
              <Sheet sx={{ maxHeight: '300px', overflow: 'auto' }}>
                <Table stickyHeader hoverRow>
                  <thead>
                    <tr>
                      {Object.keys(queryResult[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value: any, cellIndex) => (
                          <td key={cellIndex}>
                            {typeof value === 'boolean' 
                              ? value ? 'true' : 'false'
                              : value === null 
                                ? 'NULL'
                                : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Sheet>
            </Box>
          )}
        </ModalDialog>
      </Modal>
    </Box>
  )
}