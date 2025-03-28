import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {isDevelopment, log, warn} from '@/utils/env';

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
    usedTranslationKeys.add(key);
    const lang = i18n.language || 'zh';
    const exists = i18n.exists(key);
    if (!exists) {
        warn(`使用了不存在的翻译键: ${key} (语言: ${lang})`);
    } else if (isDevelopment) {
        log(`使用翻译键: ${key} => ${i18n.t(key)}`);
    }
}

// 中英文翻译资源
const resources = {
    en: {
        translation: {
            'home.hotProducts': 'Hot Products',
            'home.hotCategories': 'Hot Categories',
            'home.moreHotProducts': 'More Hot Products',
            'home.newProducts': 'New Products',
            'home.moreNewProducts': 'More New Products',
            'home.addToCart': 'Add to Cart',
            'home.peopleHaveBought': ' people have bought',
            'home.newTag': 'New',
            'home.discount': '% OFF',
            'home.originalPrice': 'Original Price',
            'home.categories.phone': 'Phone',
            'home.categories.appliance': 'Appliance',
            'home.categories.computer': 'Computer',
            'home.categories.clothing': 'Clothing',
            'home.categories.beauty': 'Beauty',
            'home.categories.sports': 'Sports',

            // Products
            'product.smartWatch': 'Smart Watch',
            'product.smartWatch.description': 'Latest generation smart watch with health monitoring',
            'product.wirelessEarphones': 'Wireless Earphones',
            'product.wirelessEarphones.description': 'Premium wireless earphones with noise cancellation',
            'product.mechanicalKeyboard': 'Mechanical Keyboard',
            'product.mechanicalKeyboard.description': 'Professional gaming mechanical keyboard',
            'product.gamingMouse': 'Gaming Mouse',
            'product.gamingMouse.description': 'High-precision gaming mouse',
            'product.smartSpeaker': 'Smart Speaker',
            'product.smartSpeaker.description': 'AI-powered smart speaker',
            'product.portablePowerBank': 'Portable Power Bank',
            'product.portablePowerBank.description': 'High-capacity portable power bank',
            'product.bluetoothSpeaker': 'Bluetooth Speaker',
            'product.bluetoothSpeaker.description': 'Premium wireless bluetooth speaker',
            'product.smartLamp': 'Smart Lamp',
            'product.smartLamp.description': 'Smart LED lamp with app control',

            // 管理员面板
            'admin.dashboard': 'Admin Dashboard',
            'admin.userManagement': 'User Management',
            'admin.userManagement.addEditDelete': 'Add, edit, and delete users',
            'admin.userManagement.manageRoles': 'Manage user roles',
            'admin.userManagement.merchantApproval': 'Process merchant applications',
            'admin.reports': 'Reports & Analytics',
            'admin.reports.platformSales': 'Platform-wide sales data',
            'admin.reports.userBehavior': 'User behavior analysis',
            'admin.reports.performance': 'Platform performance reports',
            'admin.analytics.title': 'Data Analytics',
            'admin.analytics.sales': 'Sales Data',
            'admin.analytics.userBehavior': 'User Behavior',
            'admin.analytics.performance': 'Platform Performance',
            'admin.analytics.timeRange': 'Time Range',
            'admin.analytics.daily': 'Daily View',
            'admin.analytics.weekly': 'Weekly View',
            'admin.analytics.monthly': 'Monthly View',
            'admin.analytics.salesTrend': 'Sales Trend',
            'admin.analytics.orderTrend': 'Order Trend',
            'admin.analytics.responseTime': 'Average Response Time (ms)',
            'admin.analytics.errorRate': 'System Error Rate (%)',
            'admin.analytics.serverLoad': 'Server Load (%)',
            'admin.analytics.week': 'Week',
            'admin.analytics.month': 'Month',
            'admin.analytics.directAccess': 'Direct Access',
            'admin.analytics.searchEngine': 'Search Engine',
            'admin.analytics.socialMedia': 'Social Media',
            'admin.analytics.advertising': 'Advertising',
            'admin.analytics.others': 'Others',
            'admin.analytics.mobile': 'Mobile',
            'admin.analytics.desktop': 'Desktop',
            'admin.analytics.tablet': 'Tablet',
            'admin.analytics.monday': 'Monday',
            'admin.analytics.tuesday': 'Tuesday',
            'admin.analytics.wednesday': 'Wednesday',
            'admin.analytics.thursday': 'Thursday',
            'admin.analytics.friday': 'Friday',
            'admin.analytics.saturday': 'Saturday',
            'admin.analytics.sunday': 'Sunday',
            'admin.analytics.average': 'Average',

            'admin.productManagement': 'Product Management',
            'admin.productManagement.viewAll': 'View all products',
            'admin.productManagement.approvalPending': 'Products pending approval',
            'admin.productManagement.delisted': 'Delisted products',
            'admin.products.audit.title': 'Product Audit Management',
            'admin.products.audit.batchApprove': 'Batch Approve',
            'admin.products.audit.batchReject': 'Batch Reject',
            'admin.products.audit.refreshList': 'Refresh List',
            'admin.products.audit.table.productId': 'Product ID',
            'admin.products.audit.table.productName': 'Product Name',
            'admin.products.audit.table.price': 'Price',
            'admin.products.audit.table.merchantId': 'Merchant ID',
            'admin.products.audit.table.stock': 'Stock',
            'admin.products.audit.table.status': 'Status',
            'admin.products.audit.table.createdAt': 'Created At',
            'admin.products.audit.table.actions': 'Actions',
            'admin.products.audit.actions.viewDetails': 'View Details',
            'admin.products.audit.actions.approve': 'Approve',
            'admin.products.audit.actions.reject': 'Reject',
            'admin.products.audit.modal.approveTitle': 'Approve Audit',
            'admin.products.audit.modal.rejectTitle': 'Reject Audit',
            'admin.products.audit.modal.selectedCount': 'Selected {{count}} products',
            'admin.products.audit.modal.reasonLabel': 'Audit Opinion/Reject Reason',
            'admin.products.audit.modal.approveReasonPlaceholder': 'Audit opinion (optional)',
            'admin.products.audit.modal.rejectReasonPlaceholder': 'Please enter reject reason',
            'admin.products.audit.modal.confirmApprove': 'Confirm Approve',
            'admin.products.audit.modal.confirmReject': 'Confirm Reject',
            'admin.products.audit.details.title': 'Product Details',
            'admin.products.audit.details.productId': 'Product ID',
            'admin.products.audit.details.productName': 'Product Name',
            'admin.products.audit.details.description': 'Description',
            'admin.products.audit.details.price': 'Price',
            'admin.products.audit.details.merchantId': 'Merchant ID',
            'admin.products.audit.details.status': 'Status',
            'admin.products.audit.details.stock': 'Stock',
            'admin.products.audit.details.createdAt': 'Created At',
            'admin.products.audit.details.updatedAt': 'Updated At',
            'admin.products.audit.details.images': 'Product Images',
            'admin.products.audit.details.noImages': 'No Images',
            'admin.products.audit.details.attributes': 'Product Attributes',
            'admin.products.audit.details.noAttributes': 'No Attributes',
            'admin.products.audit.messages.selectProducts': 'Please select products first',
            'admin.products.audit.messages.approveSuccess': 'Approve audit successful',
            'admin.products.audit.messages.rejectSuccess': 'Reject audit successful',
            'admin.products.audit.messages.operationFailed': 'Audit operation failed',
            'admin.products.audit.messages.loadFailed': 'Failed to load pending products',
            'admin.databaseManagement': 'Database Management',
            'admin.databaseManagement.schema': 'View database schema',
            'admin.databaseManagement.tables': 'Browse table data',
            'admin.databaseManagement.query': 'Execute SQL queries',
            'admin.enterUserManagement': 'Enter User Management',
            'admin.viewDataAnalytics': 'View Data Analytics',
            'admin.enterProductManagement': 'Enter Product Management',
            'admin.enterDatabaseManagement': 'Enter Database Management',

            // 购物车
            'cart.empty': 'Your cart is empty',
            'cart.goShopping': 'Go shopping now!',
            'cart.title': 'Shopping Cart',
            'cart.loading': 'Loading...',
            'cart.fetchingData': 'Fetching cart data...',
            'cart.table.productInfo': 'Product Information',
            'cart.table.unitPrice': 'Unit Price',
            'cart.table.quantity': 'Quantity',
            'cart.table.subtotal': 'Subtotal',
            'cart.table.actions': 'Actions',
            'cart.button.remove': 'Remove',
            'cart.button.clearCart': 'Clear Cart',
            'cart.button.checkout': 'Checkout',
            'cart.total': 'Total',
            'cart.selectedItems': '{{count}} items selected',
            'cart.error.removeItemFailed': 'Failed to remove item',
            'cart.error.updateQuantityFailed': 'Failed to update quantity',
            'cart.error.clearCartFailed': 'Failed to clear cart',
            'cart.error.emptyCartCheckout': 'Cannot checkout with empty cart',
            'cart.error.noItemSelected': 'Please select items to checkout',
            'cart.error.syncFailed': 'Failed to sync cart data',
            'cart.error.checkoutFailed': 'Checkout failed',
            'cart.error.navigationFailed': 'Failed to navigate to checkout page',

            // 商家面板
            'merchant.dashboard': 'Merchant Dashboard',
            'merchant.productManagement': 'Product Management',
            'merchant.orderManagement': 'Order Management',
            'merchant.inventoryManagement': 'Inventory Management',
            'merchant.salesReports': 'Sales Reports',
            'merchant.productFeatures.addEditDelete': 'Add, edit, and delete products',
            'merchant.productFeatures.uploadImages': 'Upload product images',
            'merchant.productFeatures.setPriceStock': 'Set price and stock',
            'merchant.orderFeatures.viewAll': 'View all orders',
            'merchant.orderFeatures.processStatus': 'Process order status',
            'merchant.orderFeatures.orderDetails': 'Order details',
            'merchant.inventoryFeatures.monitor': 'Monitor inventory',
            'merchant.inventoryFeatures.alerts': 'Set alerts',
            'merchant.inventoryFeatures.adjustments': 'Make adjustments',
            'merchant.reportFeatures.generateReports': 'Generate reports',
            'merchant.reportFeatures.trends': 'View trends',
            'merchant.reportFeatures.strategies': 'Get strategies',
            'merchant.manageProducts': 'Manage Products',
            'merchant.manageOrders': 'Manage Orders',
            'merchant.adjustInventory': 'Adjust Inventory',
            'merchant.realTimeMonitoring': 'Real-time Monitoring',
            'merchant.alertSettings': 'Alert Settings',
            'merchant.viewReports': 'View Reports',

            // 库存管理
            'inventory.set_alert_title': 'Set Stock Alert',
            'inventory.adjust_stock_title': 'Adjust Stock',
            'inventory.product': 'Product',
            'inventory.threshold': 'Threshold',
            'inventory.current_stock': 'Current Stock',
            'inventory.adjust_quantity_hint': 'Adjustment Quantity (positive to increase, negative to decrease)',
            'inventory.adjust_reason': 'Adjustment Reason',
            'inventory.manual_adjustment': 'Manual Adjustment',
            'inventory.history': 'Stock Adjustment History',
            'inventory.date': 'Date',
            'inventory.adjustment': 'Adjustment',
            'inventory.no_adjustments': 'No adjustment records',
            // 库存警报
            'inventory.alerts.title': 'Inventory Alert Settings',
            'inventory.alerts.refresh': 'Refresh Data',
            'inventory.alerts.current_config': 'Current Alert Configuration',
            'inventory.alerts.product_name': 'Product Name',
            'inventory.alerts.current_stock': 'Current Stock',
            'inventory.alerts.threshold': 'Alert Threshold',
            'inventory.alerts.status': 'Status',
            'inventory.alerts.actions': 'Actions',
            'inventory.alerts.unknown_product': 'Unknown Product',
            'inventory.alerts.stock_normal': 'Stock Normal',
            'inventory.alerts.load_failed': 'Failed to load stock alerts',
            'inventory.alerts.product_load_failed': 'Failed to load product list',
            'inventory.alerts.set_success': 'Stock alert threshold set successfully',
            'inventory.alerts.set_failed': 'Failed to set stock alert threshold',
            'inventory.alerts.load_complete': 'Stock alerts and product list loaded successfully',
            'inventory.title': 'Inventory Management',
            'inventory.table.product_name': 'Product Name',
            'inventory.table.current_stock': 'Current Stock',
            'inventory.table.threshold': 'Alert Threshold',
            'inventory.table.actions': 'Actions',
            'inventory.buttons.set_alert': 'Set Alert',
            'inventory.buttons.adjust_stock': 'Adjust Stock',
            'inventory.alerts.low_stock': '{{product}} current stock ({{current}}) is below threshold ({{threshold}})',
            'inventory.adjustments.success': 'Stock adjustment successful',
            'inventory.adjustments.error': 'Failed to adjust stock',
            'inventory.adjustments.load_error': 'Failed to load adjustment history',
            'inventory.products.load_error': 'Failed to load products',

            // 通用按钮和操作
            'common.cancel': 'Cancel',
            'common.confirm': 'Confirm',
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

            // 页脚
            'home.projectInfo': 'Project Info',
            'home.backend': 'Backend',
            'home.frontend': 'Frontend',
            'home.gateway': 'Gateway',
            'home.devops': 'DevOps',
            'home.paymentMethods': 'Payment Methods',
            'home.alipayTest': 'Alipay Test',
            'home.followMe': 'Follow Me',
            'home.wechat': 'WeChat',
            'home.juejin': 'JueJin',
            'home.blog': 'Blog',
            'home.projectDescription': 'TT-Commerce Project',

            // 角色
            'roles.consumer': 'Consumer',
            'roles.merchant': 'Merchant',
            'roles.admin': 'Admin',
            'roles.guest': 'Guest',

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
            'noResultsFoundSuffix': 'related products',
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
            'error.notLoggedIn': 'Not logged in',
            'error.failedToGetUserInfo': 'Failed to get user information',

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
            'cartTotal': 'Cart Total',

            // 首页
            'home.loading': 'Loading...',
            'home.banner.summerSale': 'Summer Sale',
            'home.banner.summerSaleDesc': 'Up to 50% off on selected items',
            'home.banner.summerSaleBtn': 'Shop Now',
            'home.banner.newArrivals': 'New Arrivals',
            'home.banner.newArrivalsDesc': 'Check out our latest collection',
            'home.banner.newArrivalsBtn': 'Explore',
            'home.banner.memberExclusive': 'Member Exclusive',
            'home.banner.memberExclusiveDesc': 'Special offers for members only',
            'home.banner.memberExclusiveBtn': 'Join Now',
            'home.loadingFailed': 'Failed to load, please try again',

            // 错误提示
            'error.addToCart.emptyProductId': 'Failed to add product: Product ID cannot be empty',

            // 商品相关
            'product.purchased': ' people purchased',

            'product.hotSelling': 'Hot Selling',

            'product.moreHot': 'More Hot Items',

            'product.newArrivals': 'New Arrivals',

            'product.moreNew': 'More New Items',

            // 热门商品
            'product.new': 'New',


            // 个人资料页面
            'profile.welcome': 'Welcome',
            'profile.loginPrompt': 'Please log in to access more features',
            'profile.noNickname': 'No nickname set',
            'profile.role': 'Role',
            'profile.accountManagement': 'Account Management',
            'profile.shippingAddresses': 'Manage Shipping Addresses',
            'profile.paymentMethods': 'Manage Payment Methods',
            'profile.orderHistory': 'View Order History',
            'profile.myOrders': 'My Orders',
            'profile.consumerCenter': 'Consumer Center',
            'profile.merchantCenter': 'Merchant Center',
            'profile.adminPanel': 'Admin Panel',
            'profile.accountRole': 'Account Role',
            'profile.currentRole': 'Current Role',
            'profile.switchRole': 'Switch Role',
            'profile.notLoggedIn': 'You are not logged in',
            'profile.login': 'Login',
            'profile.email': 'Email',
            'profile.accountId': 'Account ID',
            'profile.createdTime': 'Created Time',
            'profile.consumerFeatures': 'Consumer Features',
            'profile.merchantFeatures': 'Merchant Features',
            'profile.adminFeatures': 'Admin Features',

            // 日志消息
            'log.switchedToMerchant': 'Switched to merchant role',
            'log.switchedToAdmin': 'Switched to admin role',
            'log.switchedToConsumer': 'Switched to consumer role',
            'log.switchedToGuest': 'Switched to guest role',
            'log.navigatedToAddresses': 'Navigated to address management page',
            'log.navigatedToPaymentMethods': 'Navigated to payment methods page',
            'log.navigatedToOrderHistory': 'Navigated to order history page',
            'log.navigatedToMyOrders': 'Navigated to my orders page',
            'log.navigatedToConsumerCenter': 'Navigated to consumer center',
            'log.navigatedToMerchantCenter': 'Navigated to merchant center',
            'log.navigatedToMerchantProducts': 'Navigated to product management page',
            'log.navigatedToMerchantOrders': 'Navigated to order management page',
            'log.navigatedToMerchantInventory': 'Navigated to inventory management page',
            'log.navigatedToMerchantAnalytics': 'Navigated to sales analytics page',
            'log.navigatedToAdminPanel': 'Navigated to admin panel',
            'log.navigatedToAdminUsers': 'Navigated to user management page',
            'log.navigatedToAdminAnalytics': 'Navigated to data analytics page',
            'log.navigatedToAdminDatabase': 'Navigated to database management page',
            'log.navigatedToAdminEcommerceMap': 'Navigated to e-commerce map page',
            'log.uploadUrl': 'Upload URL:',
            'log.fileUploadSuccess': 'File uploaded successfully',
            'log.permanentUrl': 'Permanent access URL:',

            // 地址管理
            'addresses.title': 'Shipping Addresses',
            'addresses.addNew': 'Add New Address',
            'addresses.edit': 'Edit Address',
            'addresses.delete': 'Delete Address',
            'addresses.default': 'Default',
            'addresses.setDefault': 'Set as Default',
            'addresses.name': 'Name',
            'addresses.phone': 'Phone',
            'addresses.province': 'Province',
            'addresses.city': 'City',
            'addresses.district': 'District',
            'addresses.detail': 'Address Detail',
            'addresses.zipCode': 'ZIP Code',
            'addresses.noAddresses': 'No shipping addresses yet',
            'addresses.saveSuccess': 'Address saved successfully',
            'addresses.deleteSuccess': 'Address deleted successfully',
            'addresses.deleteConfirm': 'Are you sure you want to delete this address?',

            // 支付方式
            'payment.title': 'My Credit Cards',
            'payment.addNew': 'Add New Card',
            'payment.myCard': 'My Card',
            'payment.cardHolder': 'Card Holder',
            'payment.cardName': 'Card Name',
            'payment.cardNumber': 'Card Number',
            'payment.expiryDate': 'Expiry Date',
            'payment.expiryMonth': 'Expiry Month',
            'payment.expiryYear': 'Expiry Year',
            'payment.cvv': 'CVV',
            'payment.cardBrand': 'Card Brand',
            'payment.deleteConfirm': 'Are you sure you want to delete this card?',
            'payment.noCards': 'You haven\'t added any credit cards yet',
            'payment.loadFailed': 'Failed to load credit cards',
            'payment.cardHolderPlaceholder': 'Enter card holder name',
            'payment.cardNamePlaceholder': 'Enter a name for this card (optional)',
            'payment.cardNumberPlaceholder': 'Enter card number',
            'payment.monthPlaceholder': 'Month',
            'payment.yearPlaceholder': 'Year',
            'payment.cvvPlaceholder': 'Enter CVV',

            // 订单管理
            'orders.title': 'Orders',
            'orders.myOrders': 'My Orders',
            'orders.orderId': 'Order ID',
            'orders.date': 'Date',
            'orders.status': 'Status',
            'orders.total': 'Total',
            'orders.paymentStatus': 'Payment Status',
            'orders.details': 'Details',
            'orders.noOrders': 'No orders yet',
            'orders.customerInfo': 'Customer Information',
            'orders.shippingAddress': 'Shipping Address',
            'orders.billingAddress': 'Billing Address',
            'orders.products': 'Products',
            'orders.product': 'Product',
            'orders.quantity': 'Quantity',
            'orders.unitPrice': 'Unit Price',
            'orders.subtotal': 'Subtotal',
            'orders.shipping': 'Shipping',
            'orders.tax': 'Tax',
            'orders.actions': 'Actions',
            'orders.cancel': 'Cancel Order',
            'orders.cancelConfirm': 'Are you sure you want to cancel this order?',
            'orders.cancelSuccess': 'Order cancelled successfully',
            'orders.updateSuccess': 'Order updated successfully',
            'orders.viewOrder': 'View Order',

            // 商家中心

            'merchant.welcome': 'Welcome to Merchant Center',
            'merchant.summary': 'Summary',
            'merchant.totalSales': 'Total Sales',
            'merchant.totalOrders': 'Total Orders',
            'merchant.averageOrder': 'Average Order Value',
            'merchant.topProducts': 'Top Products',
            'merchant.recentOrders': 'Recent Orders',
            'merchant.quickActions': 'Quick Actions',
            'merchant.viewAll': 'View All',

            // 商品管理
            'products.title': 'Product Management',
            'products.addProduct': 'Add Product',
            'products.editProduct': 'Edit Product',
            'products.name': 'Name',
            'products.description': 'Description',
            'products.price': 'Price',
            'products.stock': 'Stock',
            'products.status': 'Status',
            'products.attributes': 'Attributes',
            'products.actions': 'Actions',
            'products.edit': 'Edit',
            'products.uploadImage': 'Upload Image',
            'products.publish': 'Publish',
            'products.unpublish': 'Unpublish',
            'products.delete': 'Delete',
            'products.uploadTitle': 'Upload Product Image',
            'products.selectImage': 'Select Image',
            'products.preview': 'Preview',
            'products.upload': 'Upload',
            'products.cancel': 'Cancel',
            'products.saveSuccess': 'Product saved successfully',
            'products.uploadSuccess': 'Image uploaded successfully',
            'products.deleteSuccess': 'Product deleted successfully',
            'products.publishSuccess': 'Product submitted for review',
            'products.unpublishSuccess': 'Product unpublished',
            'products.deleteConfirm': 'Are you sure you want to delete this product?',
            'products.loadFailed': 'Failed to load products',
            'products.saveFailed': 'Failed to save product',
            'products.deleteFailed': 'Failed to delete product',
            'products.uploadFailed': 'Failed to upload image',
            'products.getUploadUrlFailed': 'Failed to get upload URL',
            'products.publishFailed': 'Failed to submit for review',
            'products.unpublishFailed': 'Failed to unpublish product',
            'products.merchantFeatures': 'Merchant Features',

            // 库存管理

            'inventory.overview': 'Inventory Overview',
            'inventory.alerts': 'Inventory Alerts',
            'inventory.monitoring': 'Inventory Monitoring',
            'inventory.adjustments': 'Inventory Adjustments',

            'inventory.lowStock': 'Low Stock Items',
            'inventory.outOfStock': 'Out of Stock Items',
            'inventory.inStock': 'In Stock Items',
            'inventory.adjust': 'Adjust Stock',
            'inventory.increase': 'Increase',
            'inventory.decrease': 'Decrease',
            'inventory.reason': 'Reason',

            'inventory.currentStock': 'Current Stock',

            'inventory.newStock': 'New Stock',
            'inventory.setAlert': 'Set Stock Alert',

            'inventory.alertWhen': 'Alert when stock falls below',
            'inventory.saveAlert': 'Save Alert',
            'inventory.noAlerts': 'No alerts configured',
            'inventory.adjustSuccess': 'Stock adjusted successfully',
            'inventory.alertSuccess': 'Stock alert set successfully',

            // inventory页面特定翻译键
            'title': 'Inventory Management',
            'alerts.title': 'Inventory Alerts',
            'alerts.low_stock': 'Low stock alert: {{product}} has {{current}} items left (threshold: {{threshold}})',
            'alerts.load_error': 'Failed to load stock alerts',
            'alerts.set_success': 'Stock alert set successfully',
            'alerts.set_error': 'Failed to set stock alert',
            'adjustments.load_error': 'Failed to load stock adjustment history',
            'adjustments.success': 'Stock adjusted successfully',
            'adjustments.error': 'Failed to adjust stock',
            'products.load_error': 'Failed to load products',
            'table.product_name': 'Product Name',
            'table.current_stock': 'Current Stock',
            'table.threshold': 'Threshold',
            'table.actions': 'Actions',
            'buttons.set_alert': 'Set Alert',
            'buttons.adjust_stock': 'Adjust Stock',

            // 销售分析
            'analytics.title': 'Sales Analytics',
            'analytics.overview': 'Overview',
            'analytics.period': 'Period',
            'analytics.daily': 'Daily',
            'analytics.weekly': 'Weekly',
            'analytics.monthly': 'Monthly',
            'analytics.yearly': 'Yearly',
            'analytics.custom': 'Custom',
            'analytics.from': 'From',
            'analytics.to': 'To',
            'analytics.apply': 'Apply',
            'analytics.sales': 'Sales',
            'analytics.orders': 'Orders',
            'analytics.customers': 'Customers',
            'analytics.averageOrder': 'Average Order Value',
            'analytics.topProducts': 'Top Products',
            'analytics.topCategories': 'Top Categories',
            'analytics.salesByTime': 'Sales by Time',
            'analytics.salesByCategory': 'Sales by Category',
            'analytics.customerRetention': 'Customer Retention',
            'analytics.noData': 'No data available for the selected period',
            'analytics.export': 'Export Data',

            // 管理员中心
            'admin.welcome': 'Welcome to Admin Panel',
            'admin.systemStatus': 'System Status',
            'admin.userStats': 'User Statistics',
            'admin.merchantStats': 'Merchant Statistics',
            'admin.orderStats': 'Order Statistics',
            'admin.recentActivities': 'Recent Activities',
            'admin.quickActions': 'Quick Actions',

            // 用户管理
            'users.title': 'User Management',
            'users.title.item1': '管理所有消费者和商家账户',
            'users.title.item2': '添加、编辑、删除用户',
            'users.title.item3': '审批商家申请',
            'users.search': 'Search Users',
            'users.id': 'ID',
            'users.name': 'Name',
            'users.email': 'Email',
            'users.role': 'Role',
            'users.status': 'Status',
            'users.createdAt': 'Created At',
            'users.lastLogin': 'Last Login',
            'users.actions': 'Actions',
            'users.viewDetails': 'View Details',
            'users.edit': 'Edit User',
            'users.delete': 'Delete User',
            'users.activate': 'Activate',
            'users.deactivate': 'Deactivate',
            'users.permissions': 'Permissions',
            'users.resetPassword': 'Reset Password',
            'users.deleteConfirm': 'Are you sure you want to delete this user?',
            'users.deactivateConfirm': 'Are you sure you want to deactivate this user?',
            'users.active': 'Active',
            'users.inactive': 'Inactive',
            'users.saveSuccess': 'User saved successfully',
            'users.deleteSuccess': 'User deleted successfully',
            'users.statusChangeSuccess': 'User status changed successfully',

            // 数据库管理
            'database.title': 'Database Management',
            'database.tables': 'Tables',
            'database.backups': 'Backups',
            'database.migrations': 'Migrations',
            'database.createBackup': 'Create Backup',
            'database.restoreBackup': 'Restore Backup',
            'database.runMigration': 'Run Migration',
            'database.name': 'Name',
            'database.size': 'Size',
            'database.records': 'Records',
            'database.lastUpdated': 'Last Updated',
            'database.actions': 'Actions',
            'database.view': 'View',
            'database.optimize': 'Optimize',
            'database.truncate': 'Truncate',
            'database.backup': 'Backup',
            'database.date': 'Date',
            'database.download': 'Download',
            'database.restore': 'Restore',
            'database.delete': 'Delete',
            'database.backupSuccess': 'Backup created successfully',
            'database.restoreSuccess': 'Backup restored successfully',
            'database.deleteSuccess': 'Backup deleted successfully',
            'database.optimizeSuccess': 'Table optimized successfully',
            'database.truncateConfirm': 'Are you sure you want to truncate this table? All data will be lost.',
            'database.truncateSuccess': 'Table truncated successfully',

            // 电商地图
            'ecommerceMap.title': 'E-commerce Map',
            'ecommerceMap.userDistribution': 'User Distribution',
            'ecommerceMap.orderDistribution': 'Order Distribution',
            'ecommerceMap.merchantDistribution': 'Merchant Distribution',
            'ecommerceMap.heatmap': 'Heatmap',
            'ecommerceMap.markers': 'Markers',
            'ecommerceMap.clusters': 'Clusters',
            'ecommerceMap.filterBy': 'Filter By',
            'ecommerceMap.timeRange': 'Time Range',
            'ecommerceMap.region': 'Region',
            'ecommerceMap.userType': 'User Type',
            'ecommerceMap.orderStatus': 'Order Status',
            'ecommerceMap.merchantType': 'Merchant Type',
            'ecommerceMap.apply': 'Apply',
            'ecommerceMap.reset': 'Reset',
            'ecommerceMap.noData': 'No data available for the selected filters',
            'ecommerceMap.loading': 'Loading map data...',
            'ecommerceMap.zoomIn': 'Zoom In',
            'ecommerceMap.zoomOut': 'Zoom Out',
            'ecommerceMap.legend': 'Legend',
            'ecommerceMap.exportData': 'Export Data',

            // 新增地址管理相关翻译键
            'addresses.loadFailed': 'Failed to load address data, please refresh and try again',
            'addresses.saveFailed': 'Failed to save address, please try again later',
            'addresses.deleteFailed': 'Failed to delete address, please try again later',
            'addresses.addressLabel': 'Address',
            'addresses.cityStateCountry': 'City/State/Country',
            'addresses.noAddressesPrompt': 'You haven\'t added any addresses yet, click "Add New Address" button to create a new one',
            'addresses.streetPlaceholder': 'Street, building number, etc.',
            'addresses.cityPlaceholder': 'City',
            'addresses.provincePlaceholder': 'Province/State',
            'addresses.countryPlaceholder': 'Country',
            'addresses.zipCodePlaceholder': 'ZIP Code',
            'addresses.country': 'Country',

            // 商品状态
            'products.status.draft': 'Draft',
            'products.status.pending': 'Pending Review',
            'products.status.approved': 'Approved',
            'products.status.rejected': 'Rejected',
            'products.status.soldout': 'Sold Out',
            'products.status.unknown': 'Unknown Status ({{status}})',
            'products.rejectReason': 'Rejection Reason',
            'products.noProductsForAudit': 'No products pending review',
            'common.refresh': 'Refresh',
            'products.noProducts': 'No products found'
        }
    },
    zh: {
        translation: {
            // 页脚
            'home.projectInfo': '项目信息',
            'home.backend': '后端仓库',
            'home.frontend': '前端仓库',
            'home.gateway': '网关仓库',
            'home.devops': '运维仓库',
            'home.paymentMethods': '支付方式',
            'home.alipayTest': '支付宝测试',
            'home.followMe': '关注我',
            'home.wechat': '微信',
            'home.juejin': '掘金',
            'home.blog': '博客',
            'home.projectDescription': 'TT-Commerce 项目',
            'home.banner.summerSale': '夏季特惠',
            'home.banner.summerSaleDesc': '精选商品低至5折',
            'home.banner.summerSaleBtn': '立即购买',
            'home.banner.newArrivals': '新品上市',
            'home.banner.newArrivalsDesc': '探索最新系列',
            'home.banner.newArrivalsBtn': '立即探索',
            'home.banner.memberExclusive': '会员专享',
            'home.banner.memberExclusiveDesc': '会员专属特惠',
            'home.banner.memberExclusiveBtn': '立即加入',
            'product.smartWatch': '智能手表',
            'product.smartWatch.description': '最新一代健康监测智能手表',
            'product.wirelessEarphones': '无线耳机',
            'product.wirelessEarphones.description': '高端降噪无线耳机',
            'product.mechanicalKeyboard': '机械键盘',
            'product.mechanicalKeyboard.description': '专业游戏机械键盘',
            'product.gamingMouse': '游戏鼠标',
            'product.gamingMouse.description': '高精度游戏鼠标',
            'product.smartSpeaker': '智能音箱',
            'product.smartSpeaker.description': 'AI智能音箱',
            'product.portablePowerBank': '移动电源',
            'product.portablePowerBank.description': '大容量移动电源',
            'product.bluetoothSpeaker': '蓝牙音箱',
            'product.bluetoothSpeaker.description': '高品质无线蓝牙音箱',
            'product.smartLamp': '智能台灯',
            'product.smartLamp.description': 'APP控制智能LED台灯',

            // 购物车
            'cart.empty': '购物车是空的',
            'cart.goShopping': '立即去购物！',
            'cart.title': '购物车',
            'cart.loading': '加载中...',
            'cart.fetchingData': '正在获取购物车数据...',
            'cart.table.productInfo': '商品信息',
            'cart.table.unitPrice': '单价',
            'cart.table.quantity': '数量',
            'cart.table.subtotal': '小计',
            'cart.table.actions': '操作',
            'cart.button.remove': '删除',
            'cart.button.clearCart': '清空购物车',
            'cart.button.checkout': '结算',
            'cart.total': '总计',
            'cart.selectedItems': '已选择 {{count}} 件商品',
            'cart.error.removeItemFailed': '删除商品失败',
            'cart.error.updateQuantityFailed': '更新数量失败',
            'cart.error.clearCartFailed': '清空购物车失败',
            'cart.error.emptyCartCheckout': '购物车为空，无法结算',
            'cart.error.noItemSelected': '请选择要结算的商品',
            'cart.error.syncFailed': '同步购物车数据失败',
            'cart.error.checkoutFailed': '结算失败',
            'cart.error.navigationFailed': '跳转到结算页面失败',
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

            // 管理员面板
            'admin.dashboard': '管理员面板',
            'admin.userManagement': '用户管理',
            'admin.userManagement.addEditDelete': '添加、编辑和删除用户',
            'admin.userManagement.manageRoles': '管理用户角色',
            'admin.userManagement.merchantApproval': '处理商家申请',
            'admin.reports': '报告与分析',
            'admin.reports.platformSales': '平台销售数据',
            'admin.reports.userBehavior': '用户行为分析',
            'admin.reports.performance': '平台性能报告',
            'admin.enterUserManagement': '进入用户管理',
            'admin.viewDataAnalytics': '查看数据分析',
            'admin.enterProductManagement': '进入商品管理',
            'admin.enterDatabaseManagement': '进入数据库管理',
            'admin.productManagement': '商品管理',
            'admin.productManagement.viewAll': '查看所有商品',
            'admin.productManagement.approvalPending': '待审核商品',
            'admin.productManagement.delisted': '已下架商品',
            'admin.databaseManagement': '数据库管理',
            'admin.databaseManagement.schema': '查看数据库结构',
            'admin.databaseManagement.tables': '浏览表数据',
            'admin.databaseManagement.query': '执行SQL查询',

            // 卡片管理
            'cards.management': '卡片管理',

            // 产品相关
            'products.smartphone': '智能手机',
            'products.wireless_earphones': '无线耳机',
            'products.smartwatch': '智能手表',
            'products.tablet': '平板电脑',
            'products.laptop': '笔记本电脑',
            'products.smart_speaker': '智能音箱',
            'products.action_camera': '运动相机',
            'products.game_controller': '游戏手柄',
            'products.power_bank': '充电宝',
            'products.bluetooth_speaker': '蓝牙音箱',
            'products.smart_lock': '智能门锁',
            'products.smart_lamp': '智能台灯',
            'products.electric_toothbrush': '电动牙刷',
            'products.smart_scale': '智能体重秤',
            'products.air_purifier': '空气净化器',

            // 分析页面
            'analytics.sales_trend': '销售趋势',
            'analytics.sales_amount': '销售额',
            'analytics.order_count': '订单数',
            'analytics.product_sales_ratio': '商品销售占比',
            'analytics.load_sales_data_failed': '加载销售数据失败',
            'nav.switchRole': '切换角色',

            // 角色
            'roles.consumer': '消费者',
            'roles.merchant': '商家',
            'roles.admin': '管理员',
            'roles.guest': '访客',

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
            'darkMode': '深色模式',
            'lightMode': '浅色模式',

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
            'inventory': '库存',
            'ordersManage': '订单管理',
            'customers': '客户',
            'addProduct': '添加商品',
            'editProduct': '编辑商品',
            'productName': '商品名称',
            'productDescription': '商品描述',
            'productPrice': '价格',
            'productStock': '库存',
            'uploadImage': '上传图片',
            'lowStock': '库存不足',
            'stockNormal': '库存正常',
            'setStockAlert': '设置库存警告',
            'threshold': '阈值',
            'stockAdjustment': '库存调整',
            'adjustmentReason': '调整原因',
            'adjustmentDate': '调整日期',
            'adjustmentQuantity': '调整数量',

            // 错误消息
            'errorLoadingProducts': '加载商品失败',
            'errorAddingToCart': '添加到购物车失败',
            'errorRemovingFromCart': '从购物车移除失败',
            'errorUpdatingCart': '更新购物车失败',
            'errorCheckout': '结算失败',
            'tryAgain': '请重试',
            'error.notLoggedIn': '未登录',
            'error.failedToGetUserInfo': '获取用户信息失败',

            // 成功消息
            'productAdded': '商品已添加到购物车',
            'productRemoved': '商品已从购物车移除',
            'cartUpdated': '购物车已更新',
            'orderPlaced': '订单已成功提交',

            // 其他通用文本
            'loading': '加载中...',
            'noDescription': '暂无描述',
            'results': ' 个结果',
            'refresh': '刷新',
            'cartTotal': '购物车总计',

            // 个人资料页面
            'profile.welcome': '欢迎访问',
            'profile.loginPrompt': '请登录以获取更多功能',
            'profile.noNickname': '未设置昵称',
            'profile.role': '角色',
            'profile.accountManagement': '账号管理',
            'profile.shippingAddresses': '管理收货地址',
            'profile.paymentMethods': '管理支付方式',
            'profile.orderHistory': '查看订单历史',
            'profile.myOrders': '我的订单',
            'profile.consumerCenter': '消费者中心',
            'profile.merchantCenter': '商家中心',
            'profile.adminPanel': '管理员面板',
            'profile.accountRole': '账号角色',
            'profile.currentRole': '当前角色',
            'profile.switchRole': '切换角色',
            'profile.notLoggedIn': '您尚未登录',
            'profile.login': '登录',
            'profile.email': '邮箱',
            'profile.accountId': '账号ID',
            'profile.createdTime': '创建时间',
            'profile.consumerFeatures': '消费者功能',
            'profile.merchantFeatures': '商家功能',
            'profile.adminFeatures': '管理员功能',

            // 日志消息
            'log.switchedToMerchant': '已切换到商家角色',
            'log.switchedToAdmin': '已切换到管理员角色',
            'log.switchedToConsumer': '已切换到消费者角色',
            'log.switchedToGuest': '已切换到访客角色',
            'log.navigatedToAddresses': '已跳转到地址管理页面',
            'log.navigatedToPaymentMethods': '已跳转到支付方式页面',
            'log.navigatedToOrderHistory': '已跳转到订单历史页面',
            'log.navigatedToMyOrders': '已跳转到我的订单页面',
            'log.navigatedToConsumerCenter': '已跳转到消费者中心',
            'log.navigatedToMerchantCenter': '已跳转到商家中心',
            'log.navigatedToMerchantProducts': '已跳转到商品管理页面',
            'log.navigatedToMerchantOrders': '已跳转到订单管理页面',
            'log.navigatedToMerchantInventory': '已跳转到库存管理页面',
            'log.navigatedToMerchantAnalytics': '已跳转到销售分析页面',
            'log.navigatedToAdminPanel': '已跳转到管理员面板',
            'log.navigatedToAdminUsers': '已跳转到用户管理页面',
            'log.navigatedToAdminAnalytics': '已跳转到数据分析页面',
            'log.navigatedToAdminDatabase': '已跳转到数据库管理页面',
            'log.navigatedToAdminEcommerceMap': '已跳转到电商地图页面',
            'log.uploadUrl': '上传URL:',
            'log.fileUploadSuccess': '文件上传成功',
            'log.permanentUrl': '永久访问URL:',

            // 地址管理
            'addresses.title': '收货地址',
            'addresses.addNew': '添加新地址',
            'addresses.edit': '编辑地址',
            'addresses.delete': '删除地址',
            'addresses.default': '默认',
            'addresses.setDefault': '设为默认',
            'addresses.name': '姓名',
            'addresses.phone': '电话',
            'addresses.province': '省份',
            'addresses.city': '城市',
            'addresses.district': '区/县',
            'addresses.detail': '详细地址',
            'addresses.zipCode': '邮编',
            'addresses.noAddresses': '暂无收货地址',
            'addresses.saveSuccess': '地址保存成功',
            'addresses.deleteSuccess': '地址删除成功',
            'addresses.deleteConfirm': '确定要删除这个地址吗？',

            // 支付方式
            'payment.title': '我的银行卡',
            'payment.addNew': '添加新卡',
            'payment.myCard': '我的卡',
            'payment.cardHolder': '持卡人',
            'payment.cardName': '卡名称',
            'payment.cardNumber': '卡号',
            'payment.expiryDate': '有效期',
            'payment.expiryMonth': '有效期月',
            'payment.expiryYear': '有效期年',
            'payment.cvv': '安全码',
            'payment.cardBrand': '卡品牌',
            'payment.deleteConfirm': '确定要删除这张卡吗？',
            'payment.noCards': '您还没有添加任何银行卡',
            'payment.loadFailed': '加载银行卡失败',
            'payment.cardHolderPlaceholder': '请输入持卡人姓名',
            'payment.cardNamePlaceholder': '为您的卡取个名字（可选）',
            'payment.cardNumberPlaceholder': '请输入卡号',
            'payment.monthPlaceholder': '月份',
            'payment.yearPlaceholder': '年份',
            'payment.cvvPlaceholder': '请输入安全码',

            // 订单管理
            'orders.title': '订单',
            'orders.myOrders': '我的订单',
            'orders.orderId': '订单号',
            'orders.date': '日期',
            'orders.status': '状态',
            'orders.total': '总计',
            'orders.paymentStatus': '支付状态',
            'orders.details': '详情',
            'orders.noOrders': '暂无订单',
            'orders.customerInfo': '客户信息',
            'orders.shippingAddress': '收货地址',
            'orders.billingAddress': '账单地址',
            'orders.products': '商品',
            'orders.product': '商品',
            'orders.quantity': '数量',
            'orders.unitPrice': '单价',
            'orders.subtotal': '小计',
            'orders.shipping': '运费',
            'orders.tax': '税费',
            'orders.actions': '操作',
            'orders.cancel': '取消订单',
            'orders.cancelConfirm': '确定要取消这个订单吗？',
            'orders.cancelSuccess': '订单取消成功',
            'orders.updateSuccess': '订单更新成功',
            'orders.viewOrder': '查看订单',

            // 商家中心
            'merchant.dashboard': '商家控制台',
            'merchant.welcome': '欢迎来到商家中心',
            'merchant.summary': '概览',
            'merchant.totalSales': '总销售额',
            'merchant.totalOrders': '总订单数',
            'merchant.averageOrder': '平均订单金额',
            'merchant.topProducts': '热销商品',
            'merchant.recentOrders': '最近订单',
            'merchant.quickActions': '快捷操作',
            'merchant.viewAll': '查看全部',

            // 商品管理
            'products.title': '商品管理',
            'products.addProduct': '添加商品',
            'products.editProduct': '编辑商品',
            'products.name': '名称',
            'products.description': '描述',
            'products.price': '价格',
            'products.stock': '库存',
            'products.status': '状态',
            'products.attributes': '属性',
            'products.actions': '操作',
            'products.edit': '编辑',
            'products.uploadImage': '上传图片',
            'products.publish': '上架',
            'products.unpublish': '下架',
            'products.delete': '删除',
            'products.uploadTitle': '上传商品图片',
            'products.selectImage': '选择图片',
            'products.preview': '预览',
            'products.upload': '上传',
            'products.cancel': '取消',
            'products.saveSuccess': '商品保存成功',
            'products.uploadSuccess': '图片上传成功',
            'products.deleteSuccess': '商品删除成功',
            'products.publishSuccess': '商品提交审核成功',
            'products.unpublishSuccess': '商品已下架',
            'products.deleteConfirm': '确定要删除这个商品吗？',
            'products.loadFailed': '加载商品失败',
            'products.saveFailed': '保存商品失败',
            'products.deleteFailed': '删除商品失败',
            'products.uploadFailed': '上传文件失败',
            'products.getUploadUrlFailed': '获取上传URL失败',
            'products.publishFailed': '提交审核失败',
            'products.unpublishFailed': '下架商品失败',
            'products.merchantFeatures': '商家功能',

            // 库存管理
            'inventory.title': '库存管理',
            'inventory.overview': '库存概览',
            'inventory.alerts': '库存警报',
            'inventory.monitoring': '库存监控',
            'inventory.adjustments': '库存调整',
            'inventory.history': '调整历史',
            'inventory.lowStock': '库存不足商品',
            'inventory.outOfStock': '缺货商品',
            'inventory.inStock': '有货商品',
            'inventory.adjust': '调整库存',
            'inventory.increase': '增加',
            'inventory.decrease': '减少',
            'inventory.reason': '原因',
            'inventory.date': '日期',
            'inventory.product': '商品',
            'inventory.currentStock': '当前库存',
            'inventory.adjustment': '调整量',
            'inventory.newStock': '新库存',
            'inventory.setAlert': '设置库存警报',
            'inventory.threshold': '阈值',
            'inventory.alertWhen': '当库存低于以下值时警报',
            'inventory.saveAlert': '保存警报',
            'inventory.noAlerts': '没有配置警报',
            'inventory.adjustSuccess': '库存调整成功',
            'inventory.alertSuccess': '库存警报设置成功',

            // 销售分析
            'analytics.title': '销售分析',
            'analytics.overview': '概览',
            'analytics.period': '周期',
            'analytics.daily': '每日',
            'analytics.weekly': '每周',
            'analytics.monthly': '每月',
            'analytics.yearly': '每年',
            'analytics.custom': '自定义',
            'analytics.from': '从',
            'analytics.to': '至',
            'analytics.apply': '应用',
            'analytics.sales': '销售额',
            'analytics.orders': '订单数',
            'analytics.customers': '客户数',
            'analytics.averageOrder': '平均订单金额',
            'analytics.topProducts': '热销商品',
            'analytics.topCategories': '热门分类',
            'analytics.salesByTime': '按时间的销售额',
            'analytics.salesByCategory': '按分类的销售额',
            'analytics.customerRetention': '客户留存率',
            'analytics.noData': '所选时间段内没有数据',
            'analytics.export': '导出数据',

            // 管理员中心
            'admin.welcome': '欢迎来到管理员面板',
            'admin.systemStatus': '系统状态',
            'admin.userStats': '用户统计',
            'admin.merchantStats': '商家统计',
            'admin.orderStats': '订单统计',
            'admin.recentActivities': '最近活动',
            'admin.quickActions': '快捷操作',

            // 用户管理
            'users.title': '用户管理',
            'users.title.item1': '管理所有消费者和商家账户',
            'users.title.item2': '添加、编辑、删除用户',
            'users.title.item3': '审批商家申请',
            'users.search': '搜索用户',
            'users.id': 'ID',
            'users.name': '姓名',
            'users.email': '邮箱',
            'users.role': '角色',
            'users.status': '状态',
            'users.createdAt': '创建时间',
            'users.lastLogin': '最近登录',
            'users.actions': '操作',
            'users.viewDetails': '查看详情',
            'users.edit': '编辑用户',
            'users.delete': '删除用户',
            'users.activate': '激活',
            'users.deactivate': '停用',
            'users.permissions': '权限',
            'users.resetPassword': '重置密码',
            'users.deleteConfirm': '确定要删除这个用户吗？',
            'users.deactivateConfirm': '确定要停用这个用户吗？',
            'users.active': '活跃',
            'users.inactive': '停用',
            'users.saveSuccess': '用户保存成功',
            'users.deleteSuccess': '用户删除成功',
            'users.statusChangeSuccess': '用户状态修改成功',

            // 数据库管理
            'database.title': '数据库管理',
            'database.tables': '表',
            'database.backups': '备份',
            'database.migrations': '迁移',
            'database.createBackup': '创建备份',
            'database.restoreBackup': '恢复备份',
            'database.runMigration': '运行迁移',
            'database.name': '名称',
            'database.size': '大小',
            'database.records': '记录数',
            'database.lastUpdated': '最后更新',
            'database.actions': '操作',
            'database.view': '查看',
            'database.optimize': '优化',
            'database.truncate': '清空',
            'database.backup': '备份',
            'database.date': '日期',
            'database.download': '下载',
            'database.restore': '恢复',
            'database.delete': '删除',
            'database.backupSuccess': '备份创建成功',
            'database.restoreSuccess': '备份恢复成功',
            'database.deleteSuccess': '备份删除成功',
            'database.optimizeSuccess': '表优化成功',
            'database.truncateConfirm': '确定要清空这个表吗？所有数据将会丢失。',
            'database.truncateSuccess': '表清空成功',

            // 电商地图
            'ecommerceMap.title': '电商地图',
            'ecommerceMap.userDistribution': '用户分布',
            'ecommerceMap.orderDistribution': '订单分布',
            'ecommerceMap.merchantDistribution': '商家分布',
            'ecommerceMap.heatmap': '热力图',
            'ecommerceMap.markers': '标记',
            'ecommerceMap.clusters': '聚合',
            'ecommerceMap.filterBy': '筛选条件',
            'ecommerceMap.timeRange': '时间范围',
            'ecommerceMap.region': '地区',
            'ecommerceMap.userType': '用户类型',
            'ecommerceMap.orderStatus': '订单状态',
            'ecommerceMap.merchantType': '商家类型',
            'ecommerceMap.apply': '应用',
            'ecommerceMap.reset': '重置',
            'ecommerceMap.noData': '所选条件下没有数据',
            'ecommerceMap.loading': '加载地图数据...',
            'ecommerceMap.zoomIn': '放大',
            'ecommerceMap.zoomOut': '缩小',
            'ecommerceMap.legend': '图例',
            'ecommerceMap.exportData': '导出数据',

            // 新增地址管理相关翻译键
            'addresses.loadFailed': '加载地址数据失败，请刷新页面重试',
            'addresses.saveFailed': '保存地址失败，请稍后重试',
            'addresses.deleteFailed': '删除地址失败，请稍后重试',
            'addresses.addressLabel': '地址',
            'addresses.cityStateCountry': '城市/州/国家',
            'addresses.noAddressesPrompt': '您还没有添加任何地址，点击"添加新地址"按钮创建一个新地址',
            'addresses.streetPlaceholder': '街道、门牌号等',
            'addresses.cityPlaceholder': '城市',
            'addresses.provincePlaceholder': '省/州',
            'addresses.countryPlaceholder': '国家',
            'addresses.zipCodePlaceholder': '邮政编码',
            'addresses.country': '国家',

            // 商品状态
            'products.status.draft': '草稿状态',
            'products.status.pending': '待审核',
            'products.status.approved': '审核通过',
            'products.status.rejected': '审核驳回',
            'products.status.soldout': '下架',
            'products.status.unknown': '未知状态({{status}})',
            'products.rejectReason': '驳回原因',
            'products.noProductsForAudit': '没有待审核的商品',
            'common.refresh': '刷新',
            'products.noProducts': '暂无商品',

            // 热门商品
            'home.hotProducts': '热卖爆品',
            'home.hotCategories': '热门分类',
            'home.moreHotProducts': '更多热卖',
            'home.newProducts': '新品上市',
            'home.moreNewProducts': '更多新品',
            'home.addToCart': '加入购物车',
            'home.peopleHaveBought': '人已购买',
            'home.newTag': '新品',
            'home.discount': '% 折扣',
            'home.originalPrice': '原价',
            'home.categories.phone': '手机',
            'home.categories.appliance': '电器',
            'home.categories.computer': '电脑',
            'home.categories.clothing': '服饰',
            'home.categories.beauty': '美妆',
            'home.categories.sports': '运动',

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
