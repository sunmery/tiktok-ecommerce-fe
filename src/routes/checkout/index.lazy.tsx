import {createLazyFileRoute} from '@tanstack/react-router'

import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import {addressesStore} from '@/store/addressesStore.ts'
import {creditCardsStore} from '@/store/creditCards.ts'
import {cartStore} from '@/store/cartStore.ts'
import { useState, useEffect } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import Skeleton from '@/components/Skeleton'
import { Box, Typography, Card, CardContent, Divider, Grid, Table, Chip } from '@mui/joy'

export const Route = createLazyFileRoute('/checkout/')({
	component: RouteComponent,
})

/**
 * 银行卡号组件
 *@returns Element
 */
function RouteComponent() {
	const account = useSnapshot(userStore.account)
	const addresses = useSnapshot(addressesStore.defaultAddress)
	const creditCards = useSnapshot(creditCardsStore.default_credit_cards)
	const cart = useSnapshot(cartStore)
	const [loading, setLoading] = useState(true)
	
	// 模拟加载数据
	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false)
		}, 800)
		return () => clearTimeout(timer)
	}, [])
	
	const createCheckout = () => {
		fetch(`${import.meta.env.VITE_CHECKOUT_URL}`, {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token'),
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				owner: account.owner,
				name: account.name,
				email: account.email,
				address_id: addresses.id,
				credit_card_id: creditCards.id,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data)
			})
			.catch((e) => console.error(e))
	}
	// 计算商品小计
	const getItemSubtotal = (price: number, quantity: number) => {
		return price * quantity
	}

	// 格式化价格显示
	const formatCurrency = (amount: number) => {
		return `¥${amount.toFixed(2)}`
	}

	return (
		<Box sx={{ p: 2, maxWidth: 1200, margin: '0 auto' }}>
			{/* 面包屑导航 */}
			<Breadcrumbs pathMap={{ 'checkout': '结算页面' }} />
			
			<Typography level="h2" sx={{ mb: 3 }}>结算页面</Typography>
			
			{loading ? (
				<Box sx={{ mt: 4 }}>
					<Skeleton variant="card" height={200} sx={{ mb: 3 }} />
					<Skeleton variant="card" height={150} />
				</Box>
			) : (
				<Grid container spacing={3}>
					{/* 购物车商品列表 */}
					<Grid xs={12}>
						<Card variant="outlined" sx={{ mb: 3 }}>
							<CardContent>
								<Typography level="h3" sx={{ mb: 2 }}>购物车商品</Typography>
								<Divider sx={{ my: 2 }} />
								
								{cart.items.length > 0 ? (
									<Table>
										<thead>
											<tr>
												<th style={{ width: '40%' }}>商品信息</th>
												<th style={{ width: '15%' }}>单价</th>
												<th style={{ width: '15%' }}>数量</th>
												<th style={{ width: '15%' }}>小计</th>
											</tr>
										</thead>
										<tbody>
											{cart.items.map((item) => (
												<tr key={item.id}>
													<td>
														<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
															{item.picture && (
																<Box
																	component="img"
																	src={item.picture}
																	alt={item.name}
																	width={60}
																	height={60}
																	sx={{ objectFit: 'cover', borderRadius: 'sm' }}
																/>
															)}
															<Box>
																<Typography level="title-md">{item.name}</Typography>
																{item.description && (
																	<Typography level="body-sm" noWrap sx={{ maxWidth: 250 }}>
																		{item.description}
																	</Typography>
																)}
																{item.categories && item.categories.length > 0 && (
																	<Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
																		{item.categories.map((category, index) => (
																			<Chip
																				key={index}
																				size="sm"
																				variant="soft"
																				color="primary"
																			>
																				{category}
																			</Chip>
																		))}
																	</Box>
																)}
															</Box>
														</Box>
													</td>
													<td>
														<Typography level="body-md">{formatCurrency(item.price)}</Typography>
													</td>
													<td>
														<Typography level="body-md">{item.quantity}</Typography>
													</td>
													<td>
														<Typography level="body-md" color="primary">
															{formatCurrency(getItemSubtotal(item.price, item.quantity))}
														</Typography>
													</td>
												</tr>
											))}
										</tbody>
									</Table>
								) : (
									<Typography level="body-md" sx={{ textAlign: 'center', py: 3 }}>
										购物车为空，请先添加商品
									</Typography>
								)}
								
								{cart.items.length > 0 && (
									<Box sx={{ mt: 3 }}>
										<Divider sx={{ my: 2 }} />
										<Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
											<Typography level="title-lg">
												总计: {formatCurrency(cart.getTotalPrice())}
											</Typography>
										</Box>
									</Box>
								)}
							</CardContent>
						</Card>
					</Grid>
					
					{/* 订单摘要 */}
					<Grid xs={12} md={6}>
						<Card variant="outlined" sx={{ mb: 3 }}>
							<CardContent>
								<Typography level="h3" sx={{ mb: 2 }}>订单摘要</Typography>
								<Divider sx={{ my: 2 }} />
								
								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
									<Typography level="body-md">商品小计</Typography>
									<Typography level="body-md">{formatCurrency(cart.getTotalPrice())}</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
									<Typography level="body-md">运费</Typography>
									<Typography level="body-md">{formatCurrency(0)}</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
									<Typography level="body-md">税费</Typography>
									<Typography level="body-md">{formatCurrency(0)}</Typography>
								</Box>
								
								<Divider sx={{ my: 2 }} />
								
								<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
									<Typography level="title-md">总计</Typography>
									<Typography level="title-md" color="primary">{formatCurrency(cart.getTotalPrice())}</Typography>
								</Box>
							</CardContent>
						</Card>
					</Grid>
					
					{/* 收货地址 */}
					<Grid xs={12} md={6}>
						<Card variant="outlined" sx={{ mb: 3 }}>
							<CardContent>
								<Typography level="h3" sx={{ mb: 2 }}>收货信息</Typography>
								<Divider sx={{ my: 2 }} />
								
								{addresses ? (
									<Box>
										<Typography level="body-md">收货人: {addresses.name}</Typography>
										<Typography level="body-md">电话: {addresses.phone}</Typography>
										<Typography level="body-md">地址: {addresses.province} {addresses.city} {addresses.district} {addresses.detail}</Typography>
									</Box>
								) : (
									<Typography level="body-md" color="danger">请先添加收货地址</Typography>
								)}
							</CardContent>
						</Card>
					</Grid>
					
					{/* 支付方式 */}
					<Grid xs={12} md={6}>
						<Card variant="outlined" sx={{ mb: 3 }}>
							<CardContent>
								<Typography level="h3" sx={{ mb: 2 }}>支付方式</Typography>
								<Divider sx={{ my: 2 }} />
								
								{creditCards ? (
									<Box>
										<Typography level="body-md">卡号: **** **** **** {creditCards.number ? creditCards.number.slice(-4) : '****'}</Typography>
										<Typography level="body-md">持卡人: {creditCards.name}</Typography>
									</Box>
								) : (
									<Typography level="body-md" color="danger">请先添加支付方式</Typography>
								)}
							</CardContent>
						</Card>
					</Grid>
					
					{/* 提交订单按钮 */}
					<Grid xs={12}>
						<Card variant="outlined">
							<CardContent>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<Typography>确认您的订单信息并提交</Typography>
									<button 
										onClick={createCheckout} 
										style={{ 
											padding: '8px 16px', 
											background: '#1976d2', 
											color: 'white', 
											border: 'none', 
											borderRadius: '4px', 
											cursor: 'pointer',
											fontSize: '16px',
											fontWeight: 'bold'
										}}
										disabled={cart.items.length === 0 || !addresses || !creditCards}
									>
										提交订单
									</button>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			)}
		</Box>
	)
}
