import React, { useState } from 'react';
import { User, Order } from '../types';
import { MapPin, Navigation, Wallet, MessageSquare, CheckCircle, Package } from 'lucide-react';
import { AIChat } from './AIChat';

interface CourierPanelProps {
  user: User;
  orders: Order[];
  onAcceptOrder: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onRequestWithdraw: (amount: number, card: string, sheba: string) => void;
}

export const CourierPanel: React.FC<CourierPanelProps> = ({
  user,
  orders,
  onAcceptOrder,
  onUpdateStatus,
  onRequestWithdraw
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'wallet' | 'chat'>('orders');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [cardNum, setCardNum] = useState(user.wallet?.cardNumber || '');
  const [shebaNum, setShebaNum] = useState(user.wallet?.shebaNumber || '');

  // Filter orders available or assigned to this courier
  const availableOrders = orders.filter(o => o.status === 'PENDING');
  const myOrders = orders.filter(o => o.courierId === user.id && o.status !== 'DELIVERED');

  const handleWithdraw = () => {
    onRequestWithdraw(Number(withdrawAmount), cardNum, shebaNum);
    setWithdrawAmount('');
    alert('درخواست تسویه با موفقیت ثبت شد.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">درآمد امروز</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
            {(user.wallet?.balance || 0).toLocaleString()} <span className="text-xs">تومان</span>
          </p>
        </div>
        <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">سفارشات فعال</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
            {myOrders.length}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex p-1 bg-gray-200 dark:bg-gray-800 rounded-2xl">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'orders' ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400' : 'text-gray-500'
          }`}
        >
          سفارشات
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'wallet' ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400' : 'text-gray-500'
          }`}
        >
          کیف پول
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'chat' ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400' : 'text-gray-500'
          }`}
        >
          پشتیبانی هوشمند
        </button>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* My Active Task */}
            {myOrders.length > 0 && (
              <div className="glass-panel p-6 rounded-3xl border-l-4 border-blue-500">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Navigation className="text-blue-500" /> ماموریت جاری
                </h3>
                {myOrders.map(order => (
                  <div key={order.id} className="space-y-4">
                     <div className="space-y-2 text-sm">
                       <div className="flex items-start gap-2">
                         <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 shrink-0"></div>
                         <div>
                           <p className="text-gray-500">مبدا:</p>
                           <p className="font-medium">{order.pickupAddress}</p>
                         </div>
                       </div>
                       <div className="w-0.5 h-4 bg-gray-300 mr-1"></div>
                       <div className="flex items-start gap-2">
                         <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shrink-0"></div>
                         <div>
                           <p className="text-gray-500">مقصد:</p>
                           <p className="font-medium">{order.dropoffAddress}</p>
                         </div>
                       </div>
                     </div>
                     
                     {/* Visual Map Placeholder */}
                     <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Map_of_Tehran_communes.svg')] bg-cover bg-center"></div>
                        <span className="relative z-10 bg-white/80 dark:bg-black/80 px-4 py-2 rounded-full text-xs font-bold backdrop-blur">
                          نقشه زنده (شبیه‌سازی شده)
                        </span>
                     </div>

                     <div className="flex gap-2">
                        {order.status === 'ASSIGNED' && (
                          <button 
                            onClick={() => onUpdateStatus(order.id, 'PICKED_UP')}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
                          >
                            دریافت مرسوله
                          </button>
                        )}
                        {order.status === 'PICKED_UP' && (
                          <button 
                            onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
                            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
                          >
                            تحویل به مشتری
                          </button>
                        )}
                     </div>
                  </div>
                ))}
              </div>
            )}

            {/* Available Orders */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-700 dark:text-gray-300">سفارش‌های جدید</h3>
              {availableOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-3xl">
                  سفارشی در حال حاضر موجود نیست.
                </div>
              ) : (
                <div className="grid gap-4">
                  {availableOrders.map(order => (
                    <div key={order.id} className="glass-panel p-5 rounded-3xl flex justify-between items-center transition hover:scale-[1.01]">
                       <div>
                         <div className="flex items-center gap-2 mb-2">
                           <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-lg font-bold">
                             {order.price.toLocaleString()} تومان
                           </span>
                           <span className="text-xs text-gray-500">مشتری: {order.customerName}</span>
                         </div>
                         <p className="text-sm font-medium line-clamp-1">{order.pickupAddress} ➔ {order.dropoffAddress}</p>
                       </div>
                       <button 
                         onClick={() => onAcceptOrder(order.id)}
                         className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl text-sm font-bold hover:opacity-80"
                       >
                         قبول
                       </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="glass-panel p-6 rounded-3xl space-y-6">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
                   <Wallet size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-lg">کیف پول سفیر</h3>
                   <p className="text-sm text-gray-500">مدیریت درآمد و تسویه حساب</p>
                </div>
             </div>

             <div className="space-y-4">
               <div>
                 <label className="block text-sm mb-2 font-medium">شماره کارت</label>
                 <input 
                    type="text" 
                    value={cardNum} 
                    onChange={e => setCardNum(e.target.value)}
                    placeholder="0000-0000-0000-0000"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-green-500"
                 />
               </div>
               <div>
                 <label className="block text-sm mb-2 font-medium">شماره شبا</label>
                 <input 
                    type="text" 
                    value={shebaNum}
                    onChange={e => setShebaNum(e.target.value)} 
                    placeholder="IR0000000000000000000000"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-green-500"
                 />
               </div>
               <div>
                 <label className="block text-sm mb-2 font-medium">مبلغ درخواستی (تومان)</label>
                 <input 
                    type="number" 
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    placeholder="500,000"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-green-500"
                 />
               </div>
               <button 
                 onClick={handleWithdraw}
                 disabled={!withdrawAmount}
                 className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 disabled:opacity-50"
               >
                 درخواست تسویه
               </button>
             </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-4">
             <AIChat userName={user.fullName} />
             <div className="glass-panel p-4 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">تماس با پشتیبانی</h4>
                    <p className="text-sm text-gray-500">شماره مستقیم ادمین: 021-88888888</p>
                  </div>
                </div>
                <button className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl">تماس</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
