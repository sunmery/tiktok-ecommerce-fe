interface SalesData {
    date: string
    sales: number
    orders: number
}

interface ProductSales {
    name: string
    sales: number
    quantity: number
}

interface AnalyticsSummary {
    totalSales: number
    totalOrders: number
    averageOrderValue: number
    currency: string
}
