/**
 * 模拟订单数据
 * 用于前端开发和测试
 */

import { Order, PaymentStatus } from '@/types/orders';
import { Address } from '@/types/addresses';

// 模拟地址
const mockAddress: Address = {
  id: 1,
  userId: '1',
  city: '上海市',
  state: '上海',
  country: '中国',
  zipCode: '200000',
  streetAddress: '浦东新区张江高科技园区'
};

// 所有订单的模拟数据
export const mockOrders: Order[] = [
  {
    orderId: '1001',
    userId: '1',
    currency: 'CNY',
    address: mockAddress,
    email: 'user1@example.com',
    createdAt: new Date().toISOString(),
    paymentStatus: PaymentStatus.NotPaid,
    orderItems: [
      {
        item: {
          merchantId: '1001',
          productId: '1',
          quantity: 2,
          name: 'iPhone 15 Pro',
          picture: 'https://picsum.photos/id/1/300/200'
        },
        cost: 17998
      }
    ]
  },
  {
    orderId: '1002',
    userId: '1',
    currency: 'CNY',
    address: mockAddress,
    email: 'user1@example.com',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1天前
    paymentStatus: PaymentStatus.Processing,
    orderItems: [
      {
        item: {
          merchantId: '1002',
          productId: '2',
          quantity: 1,
          name: '华为Mate 60 Pro',
          picture: 'https://picsum.photos/id/2/300/200'
        },
        cost: 6999
      }
    ]
  },
  {
    orderId: '1003',
    userId: '1',
    currency: 'CNY',
    address: mockAddress,
    email: 'user1@example.com',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2天前
    paymentStatus: PaymentStatus.Paid,
    orderItems: [
      {
        item: {
          merchantId: '1003',
          productId: '3',
          quantity: 1,
          name: 'MacBook Pro 16英寸',
          picture: 'https://picsum.photos/id/3/300/200'
        },
        cost: 18999
      }
    ]
  },
  {
    orderId: '1004',
    userId: '1',
    currency: 'CNY',
    address: mockAddress,
    email: 'user1@example.com',
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3天前
    paymentStatus: PaymentStatus.Failed,
    orderItems: [
      {
        item: {
          merchantId: '1004',
          productId: '4',
          quantity: 1,
          name: '戴尔XPS 15',
          picture: 'https://picsum.photos/id/4/300/200'
        },
        cost: 12999
      }
    ]
  },
  {
    orderId: '1005',
    userId: '1',
    currency: 'CNY',
    address: mockAddress,
    email: 'user1@example.com',
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4天前
    paymentStatus: PaymentStatus.Cancelled,
    orderItems: [
      {
        item: {
          merchantId: '1005',
          productId: '5',
          quantity: 2,
          name: '索尼WH-1000XM5',
          picture: 'https://picsum.photos/id/5/300/200'
        },
        cost: 5998
      }
    ]
  }
];