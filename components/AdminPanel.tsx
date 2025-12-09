import React, { useState } from 'react';
import { User, UserRole, UserStatus, Order } from '../types';
import { Users, Package, Check, X, Shield, Map as MapIcon, Plus } from 'lucide-react';

interface AdminPanelProps {
  currentUser: User;
  users: User[];
  orders: Order[];
  onApproveUser: (id: string) => void;
  onBlockUser: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onAddAdmin: (user: Partial<User>) => void;
  onCreateOrder: (order: Partial<Order>) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  users,
  orders,
  onApproveUser,
  onBlockUser,
  onDeleteUser,
  onAddAdmin,
  onCreateOrder
}) => {
  const [activeTab, setActiveTab] = useState<'couriers' | 'admins' | 'orders'>('couriers');
  const [newOrder, setNewOrder] = useState({ pickup: '', dropoff: '', price: '', customerName: '' });
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', fullName: '' });

  const couriers = users.filter(u => u.role === UserRole.COURIER);
  const admins = users.filter(u => u.role === UserRole.ADMIN);

  const handleCreateOrder = () => {
    onCreateOrder({
      pickupAddress: newOrder.pickup,
      dropoffAddress: newOrder.dropoff,
      price: parseInt(newOrder.price),
      customerName: newOrder.customerName,
      status: 'PENDING',
    });
    setNewOrder({ pickup: '', dropoff: '', price: '', customerName: '' });
    alert('سفارش ایجاد شد');
  };

  const handleCreateAdmin = () => {
    onAddAdmin({
      username: newAdmin.username,
      password: newAdmin.password,
      fullName: newAdmin.fullName,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE
    });
    setNewAdmin({ username: '', password: '', fullName: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
         <button 
           onClick={() => setActiveTab('couriers')}
           className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'couriers' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-500'}`}
         >
           مدیریت سفیران
         </button>
         <button 
           onClick={() => setActiveTab('orders')}
           className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-500'}`}
         >
           مدیریت سفارشات
         </button>
         {currentUser.role === UserRole.SUPER_ADMIN && (
           <button 
             onClick={() => setActiveTab('admins')}
             className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'admins' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-500'}`}
           >
             مدیریت ادمین‌ها
           </button>
         )}
      </div>

      <div className="glass-panel rounded-3xl p-6 min-h-[500px]">
        {activeTab === 'couriers' && (
          <div className="space-y-4">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
               <Users className="text-blue-500"/> لیست سفیران
             </h2>
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                 <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                   <tr>
                     <th className="px-4 py-3 rounded-r-lg">نام</th>
                     <th className="px-4 py-3">وضعیت</th>
                     <th className="px-4 py-3">درآمد</th>
                     <th className="px-4 py-3 rounded-l-lg text-center">عملیات</th>
                   </tr>
                 </thead>
                 <tbody>
                   {couriers.map(courier => (
                     <tr key={courier.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                       <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                         {courier.fullName}
                         <div className="text-xs text-gray-500">{courier.phone}</div>
                       </td>
                       <td className="px-4 py-3">
                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                           courier.status === UserStatus.ACTIVE ? 'bg-green-100 text-green-600' :
                           courier.status === UserStatus.PENDING ? 'bg-yellow-100 text-yellow-600' :
                           'bg-red-100 text-red-600'
                         }`}>
                           {courier.status === 'ACTIVE' ? 'فعال' : courier.status === 'PENDING' ? 'در انتظار تایید' : 'مسدود'}
                         </span>
                       </td>
                       <td className="px-4 py-3">{courier.wallet?.balance.toLocaleString()}</td>
                       <td className="px-4 py-3 flex justify-center gap-2">
                         {courier.status === UserStatus.PENDING && (
                           <button onClick={() => onApproveUser(courier.id)} className="text-green-500 hover:bg-green-100 p-2 rounded-lg" title="تایید">
                             <Check size={18} />
                           </button>
                         )}
                         {courier.status !== UserStatus.BLOCKED ? (
                            <button onClick={() => onBlockUser(courier.id)} className="text-orange-500 hover:bg-orange-100 p-2 rounded-lg" title="مسدود">
                              <Shield size={18} />
                            </button>
                         ) : (
                            <button onClick={() => onApproveUser(courier.id)} className="text-green-500 hover:bg-green-100 p-2 rounded-lg" title="رفع مسدودی">
                              <Check size={18} />
                            </button>
                         )}
                         <button onClick={() => onDeleteUser(courier.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-lg" title="حذف">
                           <X size={18} />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <h3 className="font-bold text-lg">ثبت سفارش جدید</h3>
              <div className="space-y-3">
                 <input 
                   placeholder="نام مشتری" 
                   className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700"
                   value={newOrder.customerName}
                   onChange={e => setNewOrder({...newOrder, customerName: e.target.value})}
                 />
                 <input 
                   placeholder="آدرس مبدا" 
                   className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700"
                   value={newOrder.pickup}
                   onChange={e => setNewOrder({...newOrder, pickup: e.target.value})}
                 />
                 <input 
                   placeholder="آدرس مقصد" 
                   className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700"
                   value={newOrder.dropoff}
                   onChange={e => setNewOrder({...newOrder, dropoff: e.target.value})}
                 />
                 <input 
                   placeholder="هزینه (تومان)" 
                   type="number"
                   className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-700"
                   value={newOrder.price}
                   onChange={e => setNewOrder({...newOrder, price: e.target.value})}
                 />
                 <button 
                   onClick={handleCreateOrder}
                   className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
                 >
                   ثبت سفارش
                 </button>
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-bold text-lg mb-4">لیست سفارشات</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {orders.map(order => (
                  <div key={order.id} className="p-4 bg-white dark:bg-gray-700 rounded-2xl shadow-sm flex justify-between items-center border border-gray-100 dark:border-gray-600">
                    <div>
                      <p className="font-bold text-sm">{order.pickupAddress} به {order.dropoffAddress}</p>
                      <p className="text-xs text-gray-500 mt-1">
                         وضعیت: {order.status === 'PENDING' ? 'در انتظار پیک' : order.status === 'ASSIGNED' ? 'پیک در مسیر' : 'تحویل شده'}
                         {order.courierId && <span className="mr-2 text-blue-500">پیک: {users.find(u => u.id === order.courierId)?.fullName}</span>}
                      </p>
                    </div>
                    <div className="text-left">
                       <span className="font-bold text-blue-600 block">{order.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admins' && (
           <div className="space-y-6">
             <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800">
                <h3 className="font-bold text-lg mb-3">افزودن ادمین جدید</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                   <input 
                     placeholder="نام کامل" 
                     className="p-2 rounded-lg bg-white dark:bg-gray-800"
                     value={newAdmin.fullName}
                     onChange={e => setNewAdmin({...newAdmin, fullName: e.target.value})}
                   />
                   <input 
                     placeholder="نام کاربری" 
                     className="p-2 rounded-lg bg-white dark:bg-gray-800"
                     value={newAdmin.username}
                     onChange={e => setNewAdmin({...newAdmin, username: e.target.value})}
                   />
                   <input 
                     placeholder="رمز عبور" 
                     type="password"
                     className="p-2 rounded-lg bg-white dark:bg-gray-800"
                     value={newAdmin.password}
                     onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                   />
                   <button 
                     onClick={handleCreateAdmin}
                     className="bg-blue-600 text-white rounded-lg font-bold"
                   >
                     افزودن
                   </button>
                </div>
             </div>
             
             <div className="grid gap-4">
                {admins.map(admin => (
                  <div key={admin.id} className="flex justify-between items-center p-4 bg-white dark:bg-gray-700 rounded-xl">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                           {admin.fullName.charAt(0)}
                        </div>
                        <div>
                           <p className="font-bold">{admin.fullName}</p>
                           <p className="text-xs text-gray-500">@{admin.username}</p>
                        </div>
                     </div>
                     <button onClick={() => onDeleteUser(admin.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                       <X size={18}/>
                     </button>
                  </div>
                ))}
             </div>
           </div>
        )}
      </div>
    </div>
  );
};
