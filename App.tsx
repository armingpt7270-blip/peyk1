import React, { useState, useEffect } from 'react';
import { User, UserRole, UserStatus, Order } from './types';
import { CourierPanel } from './components/CourierPanel';
import { AdminPanel } from './components/AdminPanel';
import { Moon, Sun, Lock, UserPlus, LogIn, MapPin, Truck } from 'lucide-react';

const MOCK_USERS: User[] = [
  {
    id: 'super-1',
    username: 'آرمین7270',
    password: 'ادمین',
    role: UserRole.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    fullName: 'آرمین مدیر',
    nationalCode: '0000000000',
    phone: '09120000000',
    address: 'تهران',
  },
  {
    id: 'courier-1',
    username: 'driver1',
    password: '123',
    role: UserRole.COURIER,
    status: UserStatus.ACTIVE,
    fullName: 'علی موتوری',
    nationalCode: '1234567890',
    phone: '09350000000',
    address: 'تهران پارس',
    wallet: { balance: 150000, cardNumber: '60370000', shebaNumber: 'IR000' }
  }
];

const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1',
    customerId: 'cust-1',
    customerName: 'رضا مشتری',
    pickupAddress: 'میدان ولیعصر',
    dropoffAddress: 'ونک',
    price: 85000,
    status: 'PENDING',
    timestamp: Date.now(),
    coordinates: { start: {lat:0, lng:0}, end: {lat:0, lng:0}}
  }
];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // App State
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '', remember: false });
  const [regForm, setRegForm] = useState({ fullName: '', username: '', password: '', phone: '', nationalCode: '', address: '' });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
    
    if (foundUser) {
      if (foundUser.role === UserRole.COURIER && foundUser.status !== UserStatus.ACTIVE) {
        alert("حساب کاربری شما هنوز تایید نشده است یا مسدود می‌باشد.");
        return;
      }
      setUser(foundUser);
    } else {
      alert("نام کاربری یا رمز عبور اشتباه است");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Date.now().toString(),
      role: UserRole.COURIER,
      status: UserStatus.PENDING,
      wallet: { balance: 0 },
      ...regForm
    };
    setUsers([...users, newUser]);
    alert("ثبت نام موفقیت آمیز بود. منتظر تایید ادمین باشید.");
    setAuthMode('login');
  };

  const handleLogout = () => setUser(null);

  // Admin Actions
  const approveUser = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: UserStatus.ACTIVE } : u));
  };
  const blockUser = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: UserStatus.BLOCKED } : u));
  };
  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };
  const addAdmin = (partialUser: Partial<User>) => {
     const newAdmin = { id: Date.now().toString(), ...partialUser } as User;
     setUsers([...users, newAdmin]);
  };
  const createOrder = (partialOrder: Partial<Order>) => {
     const newOrd = { id: Date.now().toString(), timestamp: Date.now(), ...partialOrder } as Order;
     setOrders([...orders, newOrd]);
  };

  // Courier Actions
  const acceptOrder = (orderId: string) => {
    if (!user) return;
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'ASSIGNED', courierId: user.id } : o));
  };
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const updated = { ...o, status };
        // If delivered, add money to wallet (mock logic)
        if (status === 'DELIVERED' && user && user.wallet) {
           const updatedUser = { ...user, wallet: { ...user.wallet, balance: user.wallet.balance + o.price } };
           // Update current user state and users list
           setUser(updatedUser);
           setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
        }
        return updated;
      }
      return o;
    }));
  };
  const requestWithdraw = (amount: number) => {
    if(user && user.wallet) {
       // Just visually deduct for demo
       const updatedUser = { ...user, wallet: { ...user.wallet, balance: user.wallet.balance - amount } };
       setUser(updatedUser);
       setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/20 shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-black text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
           <Truck size={28} className="text-blue-600"/>
           <span>پیک هوشمند</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition">
             {darkMode ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-gray-600"/>}
          </button>
          {user && (
            <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition">
              خروج
            </button>
          )}
        </div>
      </nav>

      <main className="pt-24 pb-10 px-4">
        {!user ? (
          <div className="max-w-md mx-auto mt-10">
            <div className="glass-panel p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
               
               <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
                 {authMode === 'login' ? 'ورود به حساب کاربری' : 'ثبت نام سفیر جدید'}
               </h2>

               {authMode === 'login' ? (
                 <form onSubmit={handleLogin} className="space-y-4">
                   <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-2xl flex items-center border border-transparent focus-within:border-blue-500 transition-all">
                      <div className="p-2 text-gray-400"><UserPlus size={20}/></div>
                      <input 
                        type="text" 
                        placeholder="نام کاربری"
                        className="bg-transparent w-full p-2 outline-none dark:text-white"
                        value={loginForm.username}
                        onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                      />
                   </div>
                   <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-2xl flex items-center border border-transparent focus-within:border-blue-500 transition-all">
                      <div className="p-2 text-gray-400"><Lock size={20}/></div>
                      <input 
                        type="password" 
                        placeholder="کلمه عبور"
                        className="bg-transparent w-full p-2 outline-none dark:text-white"
                        value={loginForm.password}
                        onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                      />
                   </div>
                   
                   <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <input 
                        type="checkbox" 
                        id="remember" 
                        checked={loginForm.remember}
                        onChange={e => setLoginForm({...loginForm, remember: e.target.checked})}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="remember">مرا به خاطر بسپار</label>
                   </div>

                   <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                     ورود
                   </button>
                   
                   <p className="text-center text-sm text-gray-500 mt-4">
                     سفیر جدید هستید؟ <button type="button" onClick={() => setAuthMode('register')} className="text-blue-600 font-bold hover:underline">ثبت نام کنید</button>
                   </p>
                 </form>
               ) : (
                 <form onSubmit={handleRegister} className="space-y-3">
                   <input 
                     placeholder="نام و نام خانوادگی" 
                     className="w-full bg-gray-50 dark:bg-gray-800 p-3 rounded-xl dark:text-white"
                     required
                     value={regForm.fullName}
                     onChange={e => setRegForm({...regForm, fullName: e.target.value})}
                   />
                   <input 
                     placeholder="کد ملی" 
                     className="w-full bg-gray-50 dark:bg-gray-800 p-3 rounded-xl dark:text-white"
                     required
                     value={regForm.nationalCode}
                     onChange={e => setRegForm({...regForm, nationalCode: e.target.value})}
                   />
                   <input 
                     placeholder="شماره تماس" 
                     className="w-full bg-gray-50 dark:bg-gray-800 p-3 rounded-xl dark:text-white"
                     required
                     value={regForm.phone}
                     onChange={e => setRegForm({...regForm, phone: e.target.value})}
                   />
                   <input 
                     placeholder="آدرس دقیق" 
                     className="w-full bg-gray-50 dark:bg-gray-800 p-3 rounded-xl dark:text-white"
                     required
                     value={regForm.address}
                     onChange={e => setRegForm({...regForm, address: e.target.value})}
                   />
                   <div className="flex gap-2">
                     <input 
                       placeholder="نام کاربری" 
                       className="w-full bg-gray-50 dark:bg-gray-800 p-3 rounded-xl dark:text-white"
                       required
                       value={regForm.username}
                       onChange={e => setRegForm({...regForm, username: e.target.value})}
                     />
                     <input 
                       type="password"
                       placeholder="رمز عبور" 
                       className="w-full bg-gray-50 dark:bg-gray-800 p-3 rounded-xl dark:text-white"
                       required
                       value={regForm.password}
                       onChange={e => setRegForm({...regForm, password: e.target.value})}
                     />
                   </div>
                   <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-lg mt-2">
                     ثبت درخواست
                   </button>
                   <p className="text-center text-sm text-gray-500 mt-2">
                     <button type="button" onClick={() => setAuthMode('login')} className="text-blue-600 font-bold">بازگشت به ورود</button>
                   </p>
                 </form>
               )}
            </div>
          </div>
        ) : (
          <div>
            {/* Header Welcome */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
               <div>
                  <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-2">
                    {user.role === UserRole.COURIER ? 'پنل سفیران' : 'پنل مدیریت'}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    خوش آمدید، <span className="text-blue-600 font-bold">{user.fullName}</span>
                  </p>
               </div>
            </div>

            {user.role === UserRole.COURIER ? (
              <CourierPanel 
                user={user} 
                orders={orders}
                onAcceptOrder={acceptOrder}
                onUpdateStatus={updateOrderStatus}
                onRequestWithdraw={requestWithdraw}
              />
            ) : (
              <AdminPanel 
                currentUser={user}
                users={users}
                orders={orders}
                onApproveUser={approveUser}
                onBlockUser={blockUser}
                onDeleteUser={deleteUser}
                onAddAdmin={addAdmin}
                onCreateOrder={createOrder}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
