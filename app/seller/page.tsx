import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Activity 
} from "lucide-react";
import Link from "next/link";

// Mock data for the dashboard
const stats = [
  {
    name: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    name: "Orders",
    value: "356",
    change: "+12.5%",
    changeType: "positive",
    icon: ShoppingBag,
  },
  {
    name: "Customers",
    value: "2,450",
    change: "-2.4%",
    changeType: "negative",
    icon: Users,
  },
  {
    name: "Active Products",
    value: "124",
    change: "+14.2%",
    changeType: "positive",
    icon: Activity,
  },
];

const recentOrders = [
  { id: "#ORD-001", customer: "Liam Johnson", product: "Classic Linen Shirt", date: "Today, 10:42 AM", amount: "$85.00", status: "Completed" },
  { id: "#ORD-002", customer: "Olivia Smith", product: "Everyday Tote Bag", date: "Today, 09:15 AM", amount: "$120.00", status: "Processing" },
  { id: "#ORD-003", customer: "Noah Williams", product: "Premium Cotton Tee", date: "Yesterday, 04:30 PM", amount: "$45.00", status: "Completed" },
  { id: "#ORD-004", customer: "Emma Brown", product: "Linen Trousers", date: "Yesterday, 02:10 PM", amount: "$95.00", status: "Pending" },
  { id: "#ORD-005", customer: "Ava Jones", product: "Classic Linen Shirt", date: "Oct 7, 11:20 AM", amount: "$85.00", status: "Completed" },
];

const topProducts = [
  { name: "Classic Linen Shirt", sales: 124, revenue: "$10,540", stock: 45 },
  { name: "Everyday Tote Bag", sales: 98, revenue: "$11,760", stock: 12 },
  { name: "Premium Cotton Tee", sales: 85, revenue: "$3,825", stock: 156 },
  { name: "Linen Trousers", sales: 64, revenue: "$6,080", stock: 0 },
];

export default function SellerDashboard() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Here is what is happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-gray-600" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className={`flex items-center font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.changeType === 'positive' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {stat.change}
              </span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/seller/orders" className="text-sm font-medium text-black hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-600">{order.product}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
            <Link href="/seller/products" className="text-sm font-medium text-black hover:underline">
              View All
            </Link>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-6">
            {topProducts.map((product) => (
              <div key={product.name} className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <span>{product.sales} sales</span>
                    <span>•</span>
                    <span className={product.stock === 0 ? "text-red-500 font-medium" : ""}>
                      {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">{product.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
