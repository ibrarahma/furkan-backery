import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Search,
  Filter,
  Eye,
  Trash2,
  Plus,
  Edit2,
  Settings,
  MessageCircle,
  ExternalLink,
  Save,
  RotateCcw,
  Sparkles,
  Phone,
  LogOut,
  Layers,
  IndianRupee,
  X,
  Check
} from 'lucide-react';
import { BakeryOrder, OrderStatus, PaymentStatus, CustomCakeInquiry } from '../types/order';
import { Cake, CakeCategory } from '../types/cake';
import { BakeryConfig, saveBakeryConfig } from '../config/bakeryConfig';
import {
  getOrders,
  fetchOrders,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
  getWhatsAppOrderUrl,
  getCustomCakeInquiries,
  fetchCustomCakeInquiries
} from '../services/orderService';
import {
  getCakes,
  fetchCakes,
  addCake,
  updateCake,
  deleteCake,
  resetToDefaultCakes
} from '../services/productService';
import { useToast } from '../context/ToastContext';
import { CakeIllustration } from '../components/common/CakeIllustration';

interface AdminDashboardPageProps {
  config: BakeryConfig;
  onUpdateConfig: (newConfig: BakeryConfig) => void;
  onLogout: () => void;
  onViewStorefront: () => void;
}

export function AdminDashboardPage({
  config,
  onUpdateConfig,
  onLogout,
  onViewStorefront
}: AdminDashboardPageProps) {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'custom' | 'settings'>('orders');

  // Orders State
  const [orders, setOrders] = useState<BakeryOrder[]>(() => getOrders());
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderModal, setSelectedOrderModal] = useState<BakeryOrder | null>(null);

  // Products State
  const [cakesList, setCakesList] = useState<Cake[]>(() => getCakes());
  const [productSearch, setProductSearch] = useState('');
  const [editingCake, setEditingCake] = useState<Cake | null>(null);
  const [isAddingCake, setIsAddingCake] = useState(false);

  // Custom Inquiries
  const [inquiries, setInquiries] = useState<CustomCakeInquiry[]>(() => getCustomCakeInquiries());

  // Business Config Form State
  const [configForm, setConfigForm] = useState<BakeryConfig>(config);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load authenticated data from server
  useEffect(() => {
    let isMounted = true;
    async function loadDashboardData() {
      setIsLoadingData(true);
      try {
        const [ordersData, cakesData, inquiriesData] = await Promise.all([
          fetchOrders(),
          fetchCakes(),
          fetchCustomCakeInquiries()
        ]);
        if (isMounted) {
          setOrders(ordersData);
          setCakesList(cakesData);
          setInquiries(inquiriesData);
        }
      } catch (err) {
        console.error('Failed to load authenticated dashboard data:', err);
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    }
    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Refresh lists helper
  const reloadData = async () => {
    try {
      const [ordersData, cakesData, inquiriesData] = await Promise.all([
        fetchOrders(),
        fetchCakes(),
        fetchCustomCakeInquiries()
      ]);
      setOrders(ordersData);
      setCakesList(cakesData);
      setInquiries(inquiriesData);
    } catch (err) {
      console.error('Reload data error:', err);
    }
  };

  // Orders Statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pending = orders.filter((o) => o.status === 'Pending').length;
    const confirmed = orders.filter((o) => o.status === 'Confirmed').length;
    const preparing = orders.filter((o) => o.status === 'Preparing').length;
    const outForDelivery = orders.filter((o) => o.status === 'Out for Delivery').length;
    const delivered = orders.filter((o) => o.status === 'Delivered').length;
    const cancelled = orders.filter((o) => o.status === 'Cancelled').length;

    const totalSales = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.grandTotal, 0);

    return {
      totalOrders,
      pending,
      confirmed,
      preparing,
      outForDelivery,
      delivered,
      cancelled,
      totalSales
    };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) {
        return false;
      }
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const matchId = order.orderId.toLowerCase().includes(q);
        const matchName = order.customer.fullName.toLowerCase().includes(q);
        const matchPhone = order.customer.mobileNumber.includes(q);
        const matchCake = order.items.some((i) => i.cakeName.toLowerCase().includes(q));
        if (!matchId && !matchName && !matchPhone && !matchCake) return false;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  // Status Handlers
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res) {
      const refreshed = await fetchOrders();
      setOrders(refreshed);
      if (selectedOrderModal && selectedOrderModal.orderId === orderId) {
        setSelectedOrderModal(res);
      }
      showToast('Status Updated', `Order ${orderId} is now "${newStatus}"`, 'success');
    } else {
      showToast('Update Failed', 'Could not update order status on server', 'error');
    }
  };

  const handlePaymentToggle = async (orderId: string, current: PaymentStatus) => {
    const next: PaymentStatus = current === 'Paid' ? 'Pending' : 'Paid';
    const res = await updatePaymentStatus(orderId, next);
    if (res) {
      const refreshed = await fetchOrders();
      setOrders(refreshed);
      showToast('Payment Status', `Marked as ${next}`, 'success');
    } else {
      showToast('Update Failed', 'Could not update payment status on server', 'error');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const ok = await deleteOrder(orderId);
    if (ok) {
      const refreshed = await fetchOrders();
      setOrders(refreshed);
      setSelectedOrderModal(null);
      showToast('Order Deleted', `Order ${orderId} removed from server`, 'info');
    } else {
      showToast('Delete Failed', 'Could not delete order', 'error');
    }
  };

  // Product Handlers
  const handleToggleProductStock = async (cake: Cake) => {
    const updated = await updateCake({ ...cake, inStock: !cake.inStock });
    const refreshed = await fetchCakes();
    setCakesList(refreshed);
    showToast('Catalog Updated', `${updated.name} is now ${updated.inStock ? 'In Stock' : 'Out of Stock'}`, 'info');
  };

  const handleToggleFeatured = async (cake: Cake) => {
    const updated = await updateCake({ ...cake, isFeatured: !cake.isFeatured });
    const refreshed = await fetchCakes();
    setCakesList(refreshed);
    showToast('Catalog Updated', `${updated.name} featured state toggled`, 'info');
  };

  const handleDeleteCake = async (id: string, name: string) => {
    const ok = await deleteCake(id);
    if (ok) {
      const refreshed = await fetchCakes();
      setCakesList(refreshed);
      showToast('Cake Deleted', `${name} removed from catalog`, 'info');
    }
  };

  const handleResetCakes = async () => {
    const refreshed = await resetToDefaultCakes();
    setCakesList(refreshed);
    showToast('Catalog Reset', 'Default cakes restored', 'success');
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveBakeryConfig(configForm);
    onUpdateConfig(configForm);
    showToast('Settings Saved', 'Bakery configurations updated on server.', 'success');
  };

  const statusOptions: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#EADBCE] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#881337]">
              Bakery Operations Hub
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1E17]">
            {config.businessName} Dashboard
          </h1>
          <p className="text-xs text-stone-500">
            Real-time management for orders, cakes, delivery rules, and customer inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewStorefront}
            className="px-4 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-[#EADBCE] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Store</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-[#EADBCE] shadow-xs text-center">
          <span className="text-[11px] font-semibold text-stone-500 block">Total Orders</span>
          <span className="font-mono text-xl font-bold text-[#2A1E17] tabular-nums mt-0.5 block">
            {stats.totalOrders}
          </span>
        </div>

        <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-amber-800 block">Pending</span>
          <span className="font-mono text-xl font-bold text-amber-900 tabular-nums mt-0.5 block">
            {stats.pending}
          </span>
        </div>

        <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-200 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-blue-800 block">Confirmed</span>
          <span className="font-mono text-xl font-bold text-blue-900 tabular-nums mt-0.5 block">
            {stats.confirmed}
          </span>
        </div>

        <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-200 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-purple-800 block">Preparing</span>
          <span className="font-mono text-xl font-bold text-purple-900 tabular-nums mt-0.5 block">
            {stats.preparing}
          </span>
        </div>

        <div className="bg-amber-100/60 p-3.5 rounded-2xl border border-amber-300 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-amber-900 block">Out Delivery</span>
          <span className="font-mono text-xl font-bold text-amber-950 tabular-nums mt-0.5 block">
            {stats.outForDelivery}
          </span>
        </div>

        <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-emerald-800 block">Delivered</span>
          <span className="font-mono text-xl font-bold text-emerald-900 tabular-nums mt-0.5 block">
            {stats.delivered}
          </span>
        </div>

        <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-rose-800 block">Cancelled</span>
          <span className="font-mono text-xl font-bold text-rose-900 tabular-nums mt-0.5 block">
            {stats.cancelled}
          </span>
        </div>

        <div className="bg-[#2A1E17] text-white p-3.5 rounded-2xl border border-stone-800 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-amber-200/90 block">Total Sales</span>
          <span className="font-mono text-base font-bold text-white tabular-nums mt-0.5 block truncate">
            {config.currency}{stats.totalSales}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#EADBCE] gap-6 text-xs sm:text-sm font-semibold text-stone-600 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'orders'
              ? 'text-[#881337] border-b-2 border-[#881337]'
              : 'hover:text-[#2A1E17]'
          }`}
        >
          Orders Management ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'products'
              ? 'text-[#881337] border-b-2 border-[#881337]'
              : 'hover:text-[#2A1E17]'
          }`}
        >
          Cake Catalog ({cakesList.length})
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'custom'
              ? 'text-[#881337] border-b-2 border-[#881337]'
              : 'hover:text-[#2A1E17]'
          }`}
        >
          Custom Cake Inquiries ({inquiries.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'text-[#881337] border-b-2 border-[#881337]'
              : 'hover:text-[#2A1E17]'
          }`}
        >
          Bakery Business Settings
        </button>
      </div>

      {/* ==================== TAB 1: ORDERS ==================== */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Controls: Search and Filter */}
          <div className="bg-white p-4 rounded-2xl border border-[#EADBCE] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search by order ID, customer name, phone, or cake..."
                className="w-full text-xs pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-stone-500">Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-xl text-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses ({orders.length})</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready">Ready</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-[#EADBCE] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-stone-600 font-semibold border-b border-[#EADBCE]">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Cake Items</th>
                    <th className="py-3 px-4">Delivery Schedule</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-stone-500">
                        No orders match the current search or status filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const totalCakes = order.items.reduce((s, i) => s + i.quantity, 0);
                      const primaryCake = order.items[0];

                      return (
                        <tr key={order.orderId} className="hover:bg-[#FAF7F2]/50 transition-colors">
                          {/* Order ID */}
                          <td className="py-3 px-4 font-mono font-bold text-[#881337]">
                            {order.orderId}
                          </td>

                          {/* Customer */}
                          <td className="py-3 px-4">
                            <p className="font-semibold text-stone-900">{order.customer.fullName}</p>
                            <p className="text-[11px] text-stone-500">{order.customer.mobileNumber}</p>
                          </td>

                          {/* Cake Items */}
                          <td className="py-3 px-4">
                            <p className="font-medium text-stone-800 truncate max-w-[180px]">
                              {primaryCake ? primaryCake.cakeName : 'Custom Cake'}
                            </p>
                            <p className="text-[10px] text-stone-500">
                              {primaryCake ? `${primaryCake.size} · ` : ''}
                              {totalCakes > 1 ? `+${totalCakes - 1} more items` : '1 cake'}
                            </p>
                          </td>

                          {/* Delivery Schedule */}
                          <td className="py-3 px-4">
                            <p className="font-semibold text-stone-800">{order.deliveryDate}</p>
                            <p className="text-[10px] text-stone-500 truncate max-w-[140px]">
                              {order.deliveryTimeSlot}
                            </p>
                          </td>

                          {/* Amount */}
                          <td className="py-3 px-4 font-mono font-bold text-stone-900 tabular-nums">
                            {config.currency}{order.grandTotal}
                          </td>

                          {/* Payment */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handlePaymentToggle(order.orderId, order.paymentStatus)}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                                order.paymentStatus === 'Paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800 hover:bg-emerald-100'
                              }`}
                              title="Click to toggle Paid/Pending"
                            >
                              {order.paymentStatus}
                            </button>
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order.orderId, e.target.value as OrderStatus)
                              }
                              className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : order.status === 'Cancelled'
                                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                                  : order.status === 'Preparing'
                                  ? 'bg-purple-50 border-purple-300 text-purple-800'
                                  : 'bg-amber-50 border-amber-300 text-amber-900'
                              }`}
                            >
                              {statusOptions.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Details */}
                              <button
                                onClick={() => setSelectedOrderModal(order)}
                                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                                title="View full order details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* WhatsApp link */}
                              <a
                                href={getWhatsAppOrderUrl(order, config)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Open WhatsApp chat with customer"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>

                              {/* Delete Order */}
                              <button
                                onClick={() => handleDeleteOrder(order.orderId)}
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete order"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: PRODUCTS ==================== */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-[#EADBCE] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search cakes in menu..."
                className="w-full text-xs pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none focus:border-[#881337]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleResetCakes}
                className="px-3 py-2 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Restore default sample menu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                onClick={() => setIsAddingCake(true)}
                className="px-4 py-2 bg-[#881337] hover:bg-[#6e0f2c] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Cake</span>
              </button>
            </div>
          </div>

          {/* Product Cards Grid in Admin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cakesList
              .filter((c) =>
                c.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                c.category.toLowerCase().includes(productSearch.toLowerCase())
              )
              .map((cake) => (
                <div
                  key={cake.id}
                  className="bg-white rounded-2xl border border-[#EADBCE] p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#EADBCE]">
                      <CakeIllustration
                        name={cake.name}
                        themeColor={cake.themeColor}
                        imageUrl={cake.imageUrl}
                        aspectRatio="1/1"
                        showBadge={false}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-bold text-stone-500">
                        {cake.category}
                      </span>
                      <h3 className="font-serif text-sm font-bold text-stone-900 truncate">
                        {cake.name}
                      </h3>
                      <p className="text-xs font-mono font-bold text-[#881337] mt-0.5">
                        {config.currency}{cake.basePrice} (0.5 kg)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                    {/* Stock status toggle */}
                    <button
                      onClick={() => handleToggleProductStock(cake)}
                      className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                        cake.inStock
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {cake.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>

                    <div className="flex items-center gap-1">
                      {/* Featured toggle */}
                      <button
                        onClick={() => handleToggleFeatured(cake)}
                        className={`p-1.5 rounded text-xs cursor-pointer ${
                          cake.isFeatured ? 'text-amber-600 bg-amber-50' : 'text-stone-400'
                        }`}
                        title="Toggle featured status"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => setEditingCake(cake)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-100"
                        title="Edit cake properties"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteCake(cake.id, cake.name)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-rose-50"
                        title="Delete cake"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: CUSTOM INQUIRIES ==================== */}
      {activeTab === 'custom' && (
        <div className="bg-white rounded-2xl border border-[#EADBCE] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#FAF7F2] border-b border-[#EADBCE] flex items-center justify-between">
            <h2 className="font-serif text-base font-bold text-[#2A1E17]">
              Custom Cake Inquiries Received
            </h2>
            <span className="text-xs text-stone-500">{inquiries.length} requests</span>
          </div>

          <div className="divide-y divide-stone-100">
            {inquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No custom cake inquiries submitted yet. They will appear here when customers use the "Custom Cakes" inquiry form.
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="p-4 sm:p-5 flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#881337]">#{inq.id}</span>
                      <span className="font-bold text-stone-900">{inq.customerName}</span>
                      <span className="text-stone-500">({inq.phone})</span>
                    </div>

                    <p className="text-stone-700 font-medium">
                      Theme: <strong>{inq.theme}</strong> · Type: {inq.cakeType} ({inq.weight})
                    </p>
                    <p className="text-stone-500">
                      Flavour: {inq.flavour} · {inq.isEggless ? 'Eggless' : 'With Egg'} · Target Budget: {inq.budgetRange}
                    </p>
                    <p className="text-stone-500">
                      Date: {inq.deliveryDate} ({inq.deliveryTime})
                    </p>
                    {inq.specialInstructions && (
                      <p className="text-stone-600 italic">Notes: "{inq.specialInstructions}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hi ${inq.customerName}, this is ${config.businessName} regarding your custom cake request #${inq.id}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: BAKERY SETTINGS ==================== */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBCE] shadow-xs max-w-3xl">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#2A1E17]">
                Bakery Profile & Operating Rules
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Update business details, WhatsApp order desk number, delivery fees, and operating hours.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Bakery Name
                </label>
                <input
                  type="text"
                  required
                  value={configForm.businessName}
                  onChange={(e) => setConfigForm({ ...configForm, businessName: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={configForm.tagline}
                  onChange={(e) => setConfigForm({ ...configForm, tagline: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Display Phone
                </label>
                <input
                  type="text"
                  required
                  value={configForm.phone}
                  onChange={(e) => setConfigForm({ ...configForm, phone: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  WhatsApp Number (with country code, no + or spaces, e.g. 919876543210)
                </label>
                <input
                  type="text"
                  required
                  value={configForm.whatsappNumber}
                  onChange={(e) => setConfigForm({ ...configForm, whatsappNumber: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={configForm.email}
                  onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  City / State
                </label>
                <input
                  type="text"
                  value={configForm.city}
                  onChange={(e) => setConfigForm({ ...configForm, city: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Physical Address
              </label>
              <textarea
                rows={2}
                value={configForm.address}
                onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none"
              />
            </div>

            {/* Delivery & Pricing configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-stone-100">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Delivery Charge (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={configForm.deliveryCharges}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, deliveryCharges: Number(e.target.value) })
                  }
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Free Delivery Over (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={configForm.freeDeliveryThreshold}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, freeDeliveryThreshold: Number(e.target.value) })
                  }
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Minimum Order (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={configForm.minimumOrder}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, minimumOrder: Number(e.target.value) })
                  }
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Opening Time
                </label>
                <input
                  type="text"
                  value={configForm.openingTime}
                  onChange={(e) => setConfigForm({ ...configForm, openingTime: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Closing Time
                </label>
                <input
                  type="text"
                  value={configForm.closingTime}
                  onChange={(e) => setConfigForm({ ...configForm, closingTime: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-[#881337] hover:bg-[#6e0f2c] text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Bakery Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== MODAL: FULL ORDER VIEW ==================== */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-[#EADBCE] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Full Order Details
                </span>
                <h3 className="font-serif text-xl font-bold text-[#2A1E17]">
                  Order {selectedOrderModal.orderId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderModal(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EADBCE] text-xs space-y-1.5">
              <p><strong>Customer:</strong> {selectedOrderModal.customer.fullName}</p>
              <p><strong>Mobile:</strong> {selectedOrderModal.customer.mobileNumber}</p>
              <p><strong>WhatsApp:</strong> {selectedOrderModal.customer.whatsappNumber}</p>
              <p><strong>Email:</strong> {selectedOrderModal.customer.email}</p>
              <p>
                <strong>Delivery Address:</strong> {selectedOrderModal.customer.deliveryAddress},{' '}
                {selectedOrderModal.customer.landmark ? `${selectedOrderModal.customer.landmark}, ` : ''}
                {selectedOrderModal.customer.city} - {selectedOrderModal.customer.pincode}
              </p>
              <p>
                <strong>Delivery Schedule:</strong> {selectedOrderModal.deliveryDate} ({selectedOrderModal.deliveryTimeSlot})
              </p>
              {selectedOrderModal.specialInstructions && (
                <p><strong>Order Notes:</strong> {selectedOrderModal.specialInstructions}</p>
              )}
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Cake Items ({selectedOrderModal.items.length})
              </h4>
              {selectedOrderModal.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-stone-900">{item.cakeName}</p>
                    <p className="text-stone-500">
                      {item.size} · {item.flavour} · {item.isEggless ? 'Eggless' : 'With Egg'} · Qty: {item.quantity}
                    </p>
                    {item.customCakeDesign && (
                      <div className="text-[11px] text-[#881337] mt-0.5 space-y-0.5">
                        <p>
                          <strong>Shape:</strong> {item.customCakeDesign.shape} ·{' '}
                          <strong>Filling:</strong> {item.customCakeDesign.filling} ·{' '}
                          <strong>Frosting:</strong> {item.customCakeDesign.frostingColorName} {item.customCakeDesign.frosting}
                        </p>
                        {item.customCakeDesign.decorations.length > 0 && (
                          <p>
                            <strong>Toppings:</strong>{' '}
                            {item.customCakeDesign.decorations.map((d) => d.replace(/_/g, ' ')).join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                    {item.cakeMessage && (
                      <p className="text-[#881337] italic">Message: "{item.cakeMessage}"</p>
                    )}
                  </div>
                  <div className="font-mono font-bold text-stone-900">
                    {config.currency}{item.unitPrice * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Status change in modal */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs">
              <div className="flex items-center gap-2">
                <span>Update Status:</span>
                <select
                  value={selectedOrderModal.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrderModal.orderId, e.target.value as OrderStatus)
                  }
                  className="px-3 py-1.5 border border-[#EADBCE] rounded-lg font-bold"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <a
                href={getWhatsAppOrderUrl(selectedOrderModal, config)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD / EDIT CAKE ==================== */}
      {(isAddingCake || editingCake) && (
        <CakeEditModal
          cake={editingCake}
          config={config}
          onClose={() => {
            setIsAddingCake(false);
            setEditingCake(null);
          }}
          onSave={async (cake) => {
            if (editingCake) {
              await updateCake(cake);
              showToast('Updated', `Cake ${cake.name} updated`, 'success');
            } else {
              await addCake(cake);
              showToast('Added', `New cake ${cake.name} added`, 'success');
            }
            const refreshed = await fetchCakes();
            setCakesList(refreshed);
            setIsAddingCake(false);
            setEditingCake(null);
          }}
        />
      )}
    </div>
  );
}

// Sub-component for adding / editing a cake in admin
function CakeEditModal({
  cake,
  config,
  onClose,
  onSave
}: {
  cake: Cake | null;
  config: BakeryConfig;
  onClose: () => void;
  onSave: (cake: Cake) => void;
}) {
  const [name, setName] = useState(cake ? cake.name : '');
  const [category, setCategory] = useState<CakeCategory>(
    cake ? cake.category : 'Birthday Cakes'
  );
  const [basePrice, setBasePrice] = useState(cake ? cake.basePrice : 550);
  const [tagline, setTagline] = useState(cake ? cake.tagline : '');
  const [description, setDescription] = useState(cake ? cake.description : '');
  const [isEgglessByDefault, setIsEgglessByDefault] = useState(
    cake ? cake.isEgglessByDefault : true
  );
  const [themeColor, setThemeColor] = useState(cake ? cake.themeColor : '#881337');
  const [prepTimeHours, setPrepTimeHours] = useState(cake ? cake.prepTimeHours : 3);
  const [flavoursStr, setFlavoursStr] = useState(
    cake ? cake.availableFlavours.join(', ') : 'Belgian Chocolate, Vanilla Bean, Hazelnut'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const flavours = flavoursStr.split(',').map((f) => f.trim()).filter(Boolean);

    const newOrUpdated: Cake = {
      id: cake ? cake.id : `cake-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: tagline.trim(),
      description: description.trim(),
      category,
      basePrice: Number(basePrice),
      isEgglessByDefault,
      egglessAllowed: true,
      rating: cake ? cake.rating : 5.0,
      reviewCount: cake ? cake.reviewCount : 12,
      isFeatured: cake ? cake.isFeatured : true,
      inStock: cake ? cake.inStock : true,
      prepTimeHours: Number(prepTimeHours),
      themeColor,
      accentFlavor: flavours[0] || 'Signature',
      availableFlavours: flavours.length > 0 ? flavours : ['Signature Flavour']
    };

    onSave(newOrUpdated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto border border-[#EADBCE] shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="font-serif text-lg font-bold text-[#2A1E17]">
            {cake ? `Edit "${cake.name}"` : 'Add New Bakery Cake'}
          </h3>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Cake Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CakeCategory)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none"
              >
                <option value="Birthday Cakes">Birthday Cakes</option>
                <option value="Anniversary Cakes">Anniversary Cakes</option>
                <option value="Chocolate Cakes">Chocolate Cakes</option>
                <option value="Wedding Cakes">Wedding Cakes</option>
                <option value="Photo Cakes">Photo Cakes</option>
                <option value="Eggless Cakes">Eggless Cakes</option>
                <option value="Kids Cakes">Kids Cakes</option>
                <option value="Custom Cakes">Custom Cakes</option>
                <option value="Cupcakes">Cupcakes</option>
                <option value="Pastries">Pastries</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Base Price for 0.5 kg (₹)
              </label>
              <input
                type="number"
                required
                min={100}
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Short Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. 54% dark chocolate with hazelnut praline"
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Full Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Available Flavours (comma-separated)
            </label>
            <input
              type="text"
              value={flavoursStr}
              onChange={(e) => setFlavoursStr(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Baking Prep Hours</label>
              <input
                type="number"
                min={1}
                value={prepTimeHours}
                onChange={(e) => setPrepTimeHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Theme Color</label>
              <select
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl focus:outline-none"
              >
                <option value="#881337">Crimson / Red Velvet (#881337)</option>
                <option value="#3E2723">Dark Chocolate (#3E2723)</option>
                <option value="#450A0A">Black Forest (#450A0A)</option>
                <option value="#F59E0B">Golden Caramel / Mango (#F59E0B)</option>
                <option value="#047857">Fresh Fruit Emerald (#047857)</option>
                <option value="#9333EA">Purple Unicorn (#9333EA)</option>
                <option value="#BE123C">Ruby Anniversary (#BE123C)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isEgglessByDefault}
                onChange={(e) => setIsEgglessByDefault(e.target.checked)}
                className="rounded text-[#881337]"
              />
              <span className="font-semibold text-stone-700">100% Eggless by Default</span>
            </label>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#881337] hover:bg-[#6e0f2c] text-white font-bold rounded-xl transition-colors cursor-pointer"
            >
              {cake ? 'Save Changes' : 'Create Cake'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
