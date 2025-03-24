import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { log, warn, isDevelopment } from '@/utils/env';

// 从localStorage获取默认语言，如果没有则使用中文
const getDefaultLanguage = (): string => {
  const savedLang = localStorage.getItem('language');
  log('i18n初始化 - 从localStorage获取的语言:', savedLang);
  return savedLang === 'en' ? 'en' : 'zh';
};

// 翻译键缺失时的处理函数
// 符合i18next的missingKeyHandler接口
const missingKeyHandler = (lngs: readonly string[], ns: string, key: string, _fallbackValue: string) => {
  // 开发环境下输出警告
  warn(`翻译键缺失: ${key} (在命名空间 ${ns} 中，语言 ${lngs.join(', ')})`);
  
  // 不返回任何值，i18next会自己处理
};

// 用于记录已使用的翻译键
const usedTranslationKeys = new Set<string>();

// 记录翻译键使用的函数
export function recordTranslationKeyUsage(key: string): void {
  if (typeof key === 'string') {
    usedTranslationKeys.add(key);
    
    // 检查键是否存在于当前语言资源中
    const lang = i18n.language || 'zh';
    const exists = i18n.exists(key);
    
    if (!exists) {
      warn(`使用了不存在的翻译键: ${key} (语言: ${lang})`);
    } else if (isDevelopment) {
      log(`使用翻译键: ${key} => ${i18n.t(key)}`);
    }
  }
}

// 中英文翻译资源
const resources = {
  en: {
    translation: {
      // 导航
      'home': 'Home',
      'products': 'Products',
      'cart': 'Cart',
      'orders': 'Orders',
      'profile': 'Profile',
      'login': 'Login',
      'logout': 'Logout',
      'register': 'Register',
      'searchPlaceholder': 'Search products...',
      
      // 导航条目
      'nav.home': 'Home',
      'nav.products': 'Products',
      'nav.cart': 'Cart',
      'nav.orders': 'My Orders',
      'nav.profile': 'Profile',
      'nav.logout': 'Logout',
      'nav.login': 'Login',
      'nav.register': 'Register',
      'nav.project': 'TT-Commerce',
      'nav.search': 'Search products',
      'nav.menu': 'Menu',
      'nav.language': 'Language',
      'nav.switchRole': 'Switch Role',
      
      // 角色
      'roles.consumer': 'Consumer',
      'roles.merchant': 'Merchant',
      'roles.admin': 'Admin',
      
      // 个人中心
      'profile.avatar': 'Avatar',
      'profile.addresses': 'Shipping Addresses',
      'profile.payment': 'Payment Methods',
      
      // 操作
      'actions.search': 'Search',
      
      // 商品页面
      'allProducts': 'All Products',
      'searchResults': 'Search Results',
      'noResultsFound': 'No results found for',
      'price': 'Price',
      'stock': 'Stock',
      'addToCart': 'Add to Cart',
      'outOfStock': 'Out of Stock',
      'description': 'Description',
      'category': 'Category',
      
      // 购物车
      'cartEmpty': 'Your cart is empty',
      'continueShopping': 'Continue Shopping',
      'checkout': 'Checkout',
      'remove': 'Remove',
      'total': 'Total',
      'cartItems': 'items',
      
      // 订单
      'orderHistory': 'Order History',
      'orderId': 'Order ID',
      'orderDate': 'Order Date',
      'orderStatus': 'Status',
      'orderTotal': 'Total',
      'orderDetails': 'Order Details',
      'shippingAddress': 'Shipping Address',
      'paymentMethod': 'Payment Method',
      
      // 支付状态
      'notPaid': 'Not Paid',
      'processing': 'Processing',
      'paid': 'Paid',
      'failed': 'Failed',
      'cancelled': 'Cancelled',
      
      // 设置
      'settings': 'Settings',
      'language': 'Language',
      'language.switch': 'Switch Language',
      'chinese': '中文',
      'english': 'English',
      'theme': 'Theme',
      'darkMode': 'Dark Mode',
      'lightMode': 'Light Mode',
      
      // 按钮
      'save': 'Save',
      'cancel': 'Cancel',
      'confirm': 'Confirm',
      'update': 'Update',
      'delete': 'Delete',
      
      // 商家面板
      'dashboard': 'Dashboard',
      'analytics': 'Analytics',
      'productsManage': 'Products',
      'inventory': 'Inventory',
      'ordersManage': 'Orders',
      'customers': 'Customers',
      'addProduct': 'Add Product',
      'editProduct': 'Edit Product',
      'productName': 'Product Name',
      'productDescription': 'Description',
      'productPrice': 'Price',
      'productStock': 'Stock',
      'uploadImage': 'Upload Image',
      'lowStock': 'Low Stock',
      'stockNormal': 'Stock Normal',
      'setStockAlert': 'Set Stock Alert',
      'threshold': 'Threshold',
      'stockAdjustment': 'Stock Adjustment',
      'adjustmentReason': 'Adjustment Reason',
      'adjustmentDate': 'Adjustment Date',
      'adjustmentQuantity': 'Adjustment Quantity',
      
      // 错误消息
      'errorLoadingProducts': 'Failed to load products',
      'errorAddingToCart': 'Failed to add to cart',
      'errorRemovingFromCart': 'Failed to remove from cart',
      'errorUpdatingCart': 'Failed to update cart',
      'errorCheckout': 'Failed to checkout',
      'tryAgain': 'Please try again',
      
      // 成功消息
      'productAdded': 'Product added to cart',
      'productRemoved': 'Product removed from cart',
      'cartUpdated': 'Cart updated',
      'orderPlaced': 'Order placed successfully',
      
      // 其他通用文本
      'loading': 'Loading...',
      'noDescription': 'No description',
      'results': ' results',
      'refresh': 'Refresh',
      'noResultsFoundSuffix': '',
      'cartTotal': 'Cart Total',
    }
  },
  zh: {
    translation: {
      // 导航
      'home': '首页',
      'products': '商品',
      'cart': '购物车',
      'orders': '订单',
      'profile': '个人中心',
      'login': '登录',
      'logout': '退出',
      'register': '注册',
      'searchPlaceholder': '搜索商品...',
      
      // 导航条目
      'nav.home': '首页',
      'nav.products': '商品',
      'nav.cart': '购物车',
      'nav.orders': '我的订单',
      'nav.profile': '个人中心',
      'nav.logout': '退出登录',
      'nav.login': '登录',
      'nav.register': '注册',
      'nav.project': 'TT电商',
      'nav.search': '搜索商品',
      'nav.menu': '菜单',
      'nav.language': '语言',
      'nav.switchRole': '切换角色',
      
      // 角色
      'roles.consumer': '消费者',
      'roles.merchant': '商家',
      'roles.admin': '管理员',
      
      // 个人中心
      'profile.avatar': '用户头像',
      'profile.addresses': '收货地址',
      'profile.payment': '支付方式',
      
      // 操作
      'actions.search': '搜索',
      
      // 商品页面
      'allProducts': '全部商品',
      'searchResults': '搜索结果',
      'noResultsFound': '未找到与',
      'noResultsFoundSuffix': '相关的商品',
      'price': '价格',
      'stock': '库存',
      'addToCart': '加入购物车',
      'outOfStock': '缺货',
      'description': '描述',
      'category': '分类',
      
      // 购物车
      'cartEmpty': '购物车是空的',
      'continueShopping': '继续购物',
      'checkout': '结算',
      'remove': '删除',
      'total': '总计',
      'cartItems': '件商品',
      
      // 订单
      'orderHistory': '订单历史',
      'orderId': '订单号',
      'orderDate': '下单日期',
      'orderStatus': '状态',
      'orderTotal': '总金额',
      'orderDetails': '订单详情',
      'shippingAddress': '收货地址',
      'paymentMethod': '支付方式',
      
      // 支付状态
      'notPaid': '未支付',
      'processing': '处理中',
      'paid': '已支付',
      'failed': '失败',
      'cancelled': '已取消',
      
      // 设置
      'settings': '设置',
      'language': '语言',
      'language.switch': '切换语言',
      'chinese': '中文',
      'english': 'English',
      'theme': '主题',
      'darkMode': '暗色模式',
      'lightMode': '亮色模式',
      
      // 按钮
      'save': '保存',
      'cancel': '取消',
      'confirm': '确认',
      'update': '更新',
      'delete': '删除',
      
      // 商家面板
      'dashboard': '仪表盘',
      'analytics': '数据分析',
      'productsManage': '商品管理',
      'inventory': '库存管理',
      'ordersManage': '订单管理',
      'customers': '客户管理',
      'addProduct': '添加商品',
      'editProduct': '编辑商品',
      'productName': '商品名称',
      'productDescription': '商品描述',
      'productPrice': '商品价格',
      'productStock': '库存数量',
      'uploadImage': '上传图片',
      'lowStock': '库存不足',
      'stockNormal': '库存正常',
      'setStockAlert': '设置库存警戒值',
      'threshold': '警戒值',
      'stockAdjustment': '库存调整',
      'adjustmentReason': '调整原因',
      'adjustmentDate': '调整日期',
      'adjustmentQuantity': '调整数量',
      
      // 错误消息
      'errorLoadingProducts': '加载商品失败',
      'errorAddingToCart': '添加到购物车失败',
      'errorRemovingFromCart': '从购物车移除商品失败',
      'errorUpdatingCart': '更新购物车失败',
      'errorCheckout': '结算失败',
      'tryAgain': '请稍后重试',
      
      // 成功消息
      'productAdded': '商品已添加到购物车',
      'productRemoved': '商品已从购物车移除',
      'cartUpdated': '购物车已更新',
      'orderPlaced': '订单已成功提交',
      
      // 其他通用文本
      'loading': '加载中...',
      'noDescription': '暂无描述',
      'results': '个结果',
      'refresh': '重新加载',
      'cartTotal': '购物车总计',
    }
  }
};

// 初始化i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDefaultLanguage(),
    fallbackLng: 'zh', // 回退语言
    interpolation: {
      escapeValue: false // 不转义HTML内容
    },
    saveMissing: isDevelopment, // 仅在开发环境中保存缺失的键
    missingKeyHandler, // 处理缺失键的函数
    debug: isDevelopment // 仅在开发环境中开启调试模式
  });

// 监听语言变化
i18n.on('languageChanged', (lng) => {
  log('i18n语言已改变:', lng);
  document.documentElement.lang = lng;
});

// 调试函数：检查哪些翻译键被使用了
export function checkUsedTranslationKeys() {
  log('已使用的翻译键:', Array.from(usedTranslationKeys));
  return Array.from(usedTranslationKeys);
}

// 调试函数：检查未使用的翻译键
export function checkUnusedTranslationKeys() {
  const allKeys: string[] = [];
  const langs = Object.keys(resources);
  
  // 收集所有定义的键
  langs.forEach(lang => {
    const allKeysInLang = collectKeysFromObject(resources[lang as keyof typeof resources].translation);
    allKeys.push(...allKeysInLang);
  });
  
  // 过滤出未使用的键
  const uniqueKeys = Array.from(new Set(allKeys));
  const unusedKeys = uniqueKeys.filter(key => !usedTranslationKeys.has(key));
  
  log('未使用的翻译键:', unusedKeys);
  return unusedKeys;
}

// 辅助函数：从对象中收集所有键（包括嵌套对象）
function collectKeysFromObject(obj: any, prefix = ''): string[] {
  let keys: string[] = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = [...keys, ...collectKeysFromObject(obj[key], fullKey)];
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// 调试函数：显示翻译覆盖率
export function showTranslationCoverage() {
  const allKeys = new Set<string>();
  const langs = Object.keys(resources);
  
  // 收集所有定义的键
  langs.forEach(lang => {
    const allKeysInLang = collectKeysFromObject(resources[lang as keyof typeof resources].translation);
    allKeysInLang.forEach(key => allKeys.add(key));
  });
  
  const totalKeys = allKeys.size;
  const usedKeys = usedTranslationKeys.size;
  const coverage = (usedKeys / totalKeys) * 100;
  
  log(`翻译覆盖率: ${coverage.toFixed(2)}% (已使用 ${usedKeys}/${totalKeys} 键)`);
  
  return {
    totalKeys,
    usedKeys,
    coverage,
    unusedKeys: checkUnusedTranslationKeys()
  };
}

export default i18n; 