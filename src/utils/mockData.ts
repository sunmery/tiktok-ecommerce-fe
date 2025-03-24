/**
 * 模拟商品数据
 * 用于前端开发和测试
 */

import { Product, ProductStatus } from '@/types/products';

// 所有商品的模拟数据
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: '最新款苹果手机，搭载A17芯片，性能强劲',
    price: 8999,
    status: ProductStatus.APPROVED,
    merchantId: '1001',
    images: [{
      url: 'https://picsum.photos/id/1/300/200',
      isPrimary: true,
      sortOrder: 0
    }],
    picture: 'https://picsum.photos/id/1/300/200',
    quantity: 100,
    attributes: {},
    category: {
      categoryId: 1,
      categoryName: "手机数码"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventory: {
      productId: '1',
      merchantId: '1001',
      stock: 100
    }
  },
  {
    id: '2',
    name: '华为Mate 60 Pro',
    description: '华为旗舰手机，搭载麒麟9000芯片',
    price: 6999,
    status: ProductStatus.APPROVED,
    merchantId: '1002',
    images: [{
      url: 'https://picsum.photos/id/2/300/200',
      isPrimary: true,
      sortOrder: 0
    }],
    picture: 'https://picsum.photos/id/2/300/200',
    quantity: 85,
    attributes: {},
    category: {
      categoryId: 1,
      categoryName: "手机数码"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventory: {
      productId: '2',
      merchantId: '1002',
      stock: 85
    }
  },
  {
    id: '3',
    name: 'MacBook Pro 16英寸',
    description: '搭载M2 Pro芯片，性能强劲的专业笔记本',
    price: 18999,
    status: ProductStatus.APPROVED,
    merchantId: '1003',
    images: [{
      url: 'https://picsum.photos/id/3/300/200',
      isPrimary: true,
      sortOrder: 0
    }],
    picture: 'https://picsum.photos/id/3/300/200',
    quantity: 50,
    attributes: {},
    category: {
      categoryId: 2,
      categoryName: '电脑办公'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventory: {
      productId: '3',
      merchantId: '1003',
      stock: 50
    }
  },
  {
    id: '4',
    name: '戴尔XPS 15',
    description: '轻薄高性能笔记本，适合商务人士',
    price: 12999,
    status: ProductStatus.APPROVED,
    merchantId: '1003',
    images: [{
      url: 'https://picsum.photos/id/4/300/200',
      isPrimary: true,
      sortOrder: 0
    }],
    picture: 'https://picsum.photos/id/4/300/200',
    quantity: 65,
    attributes: {},
    category: {
      categoryId: 2,
      categoryName: '电脑办公'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventory: {
      productId: '4',
      merchantId: '1003',
      stock: 65
    }
  },
  {
    id: '5',
    name: '索尼WH-1000XM5',
    description: '顶级降噪耳机，音质出色',
    price: 2999,
    status: ProductStatus.APPROVED,
    merchantId: '1004',
    images: [{
      url: 'https://picsum.photos/id/5/300/200',
      isPrimary: true,
      sortOrder: 0
    }],
    picture: 'https://picsum.photos/id/5/300/200',
    quantity: 120,
    attributes: {},
    category: {
      categoryId: 3,
      categoryName: '配件'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventory: {
      productId: '5',
      merchantId: '1004',
      stock: 120
    }
  },
  {
    id: '6',
    name: 'iPad Pro 12.9英寸',
    description: 'M2芯片加持的专业平板电脑',
    price: 8499,
    status: ProductStatus.APPROVED,
    merchantId: '1001',
    images: [{
      url: 'https://picsum.photos/id/6/300/200',
      isPrimary: true,
      sortOrder: 0
    }],
    picture: 'https://picsum.photos/id/6/300/200',
    quantity: 75,
    attributes: {},
    category: {
      categoryId: 4,
      categoryName: '平板'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventory: {
      productId: '8',
      merchantId: '1006',
      stock: 25
    }
  },
  {
    id: '7',
    name: '小米电视6 OLED 65英寸',
    description: '高端OLED电视，画质细腻',
    price: 6999,
    status: ProductStatus.APPROVED,
    merchantId: '1005',
    images: [{
      url: 'https://picsum.photos/id/7/300/200',
      isPrimary: true,
      sortOrder: 0
    }],
    picture: 'https://picsum.photos/id/7/300/200',
    quantity: 30,
    attributes: {},
    category: {
      categoryId: 5,
      categoryName: '家用电器'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventory: {
      productId: '8',
      merchantId: '1006',
      stock: 25
    }
  },
  {
    id: '8',
    name: '海尔冰箱BCD-470WDPG',
    description: '对开门冰箱，风冷无霜',
    price: 4999,
    status: ProductStatus.APPROVED,
    merchantId: '1006',
    images: [{
      url: 'https://picsum.photos/id/8/300/200',
      isPrimary: true,
      sortOrder: 0
    }],
    picture: 'https://picsum.photos/id/8/300/200',
    quantity: 25,
    attributes: {},
    category: {
      categoryId: 5,
      categoryName: '家用电器'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventory: {
      productId: '8',
      merchantId: '1006',
      stock: 25
    }
  },
  {
    id: '9',
    name: 'Nike Air Max 270',
    description: '舒适透气的运动鞋',
    price: 1299,
    status: ProductStatus.APPROVED,
    merchantId: '1007',
    images: [{
      url: 'https://picsum.photos/id/9/300/200',
      isPrimary: true,
      sortOrder: 0
    }],
    picture: 'https://picsum.photos/id/9/300/200',
    quantity: 150,
    attributes: {},
    category: {
      categoryId: 6,
      categoryName: '服饰鞋包'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventory: {
      productId: '8',
      merchantId: '1006',
      stock: 25
    }
  },
  {
    id: '10',
    name: 'Adidas三叶草卫衣',
    description: '经典款卫衣，舒适保暖',
    price: 699,
    status: ProductStatus.APPROVED,
    merchantId: '1007',
    images: [{
      url: 'https://picsum.photos/id/10/300/200',
      isPrimary: true,
      sortOrder: 0
    }],
    picture: 'https://picsum.photos/id/10/300/200',
    quantity: 200,
    attributes: {},
    category: {
      categoryId: 6,
      categoryName: '服饰鞋包'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventory: {
      productId: '8',
      merchantId: '1006',
      stock: 25
    }
  },
  {
    id: '11',
    name: 'SK-II神仙水',
    description: '明星产品，改善肤质',
    price: 1599,
    status: ProductStatus.APPROVED,
    merchantId: '1008',
    images: [{
      url: 'https://picsum.photos/id/11/300/200',
      isPrimary: true,
      sortOrder: 0
    }],
    picture: 'https://picsum.photos/id/11/300/200',
    quantity: 80,
    attributes: {},
    category: {
      categoryId: 7,
      categoryName: '美妆个护'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventory: {
      productId: '8',
      merchantId: '1006',
      stock: 25
    }
  },
  {
    id: '12',
    name: '兰蔻小黑瓶精华',
    description: '抗老精华，改善肌肤状态',
    price: 1299,
    status: ProductStatus.APPROVED,
    merchantId: '1008',
    images: [{
      url: 'https://picsum.photos/id/12/300/200',
      isPrimary: true,
      sortOrder: 0
    }],
    picture: 'https://picsum.photos/id/12/300/200',
    quantity: 95,
    attributes: {},
    category: {
      categoryId: 7,
      categoryName: '美妆个护'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventory: {
      productId: '8',
      merchantId: '1006',
      stock: 25
    }
  }
];

// 按分类组织的商品数据
export const mockCategoryProducts: Record<string, Product[]> = {
  'phone-digital': mockProducts.filter(p => p.category?.categoryName === '手机数码'),
  'home-appliance': mockProducts.filter(p => p.category?.categoryName === '家用电器'),
  'computer-office': mockProducts.filter(p => p.category?.categoryName === '电脑办公'),
  'clothing-shoes': mockProducts.filter(p => p.category?.categoryName === '服饰鞋包'),
  'beauty-personal-care': mockProducts.filter(p => p.category?.categoryName === '美妆个护'),
  "sports-outdoors": mockProducts.filter(p => p.category && ["运动户外", "运动鞋"].includes(p.category.categoryName))
};