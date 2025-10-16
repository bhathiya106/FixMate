
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';

// Components
import Navbar from './components/Navbar/Navbar';

// Pages
import Home from './pages/Home/Home';
import SignUp from './pages/SignUp';
import Register from './pages/Register';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import Contact from './pages/Contact/Contact';
import About from './pages/About/About';
import SupplyStore from './pages/SupplyStore';
import ProductCardDynamic from './pages/ProductCardDynamic';
import UserProfile from './pages/UserProfile';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import ServiceBookingPage from './pages/ServiceBookingPage';

// Admin Components
import AdminDashboard from './admin/AdminDashboard';
import DashboardMain from './admin/DashboardMain';
import Users from './admin/Users';
import Vendors from './admin/Vendors';
import Suppliers from './admin/Suppliers';
import Products from './admin/Products';
import Services from './admin/Services';
import DeliveryDrivers from './admin/DeliveryDrivers';
import Adminlogin from './admin/Adminlogin';

// Vendor Components
import VendorDashboard from './vendor/VendorDashboard';
import VendorProfile from './vendor/Profile';
import VendorAvailableOrders from './vendor/AvailableOrders';
import OngoingOrders from './vendor/OngoingOrders';
import PreviousOrders from './vendor/PreviousOrders';
import Revenue from './vendor/Revenue';
import VendorReviews from './vendor/Reviews';
import VendorLogin from './vendor/VendorLogin';
import VendorRegister from './vendor/VendorRegister';
import VendorNotices from './vendor/Notices';
import { VendorContextProvider } from './Context/VendorContext';

// Supplier Components
import SupplierDashboard from './supplier/SupplierDashboard';
import SupplierAvailableOrders from './supplier/AvailableOrders';
import SupplierPreviousOrders from './supplier/PreviousOrders';
import SupplierWaitingOrders from './supplier/WaitingOrders';
import SupplierReviews from './supplier/Reviews';
import SupplierRevenue from './supplier/Revenue';
import SupplierLogin from './supplier/SupplierLogin';
import SupplierRegister from './supplier/SupplierRegister';
import SupplierProfile from './supplier/SupplierProfile';
import AddProducts from './supplier/AddProducts';
import AvailableProducts from './supplier/AvailableProducts';
import SupplierNotices from './supplier/Notices';
import { SupplierContextProvider } from './Context/SupplierContext';

// Delivery Components
import DeliveryLogin from './delivery/DeliveryLogin';
import DeliveryRegister from './delivery/DeliveryRegister';
import DeliveryDashboard from './delivery/DeliveryDashboard';
import DeliveryContextProvider from './Context/DeliveryContext';
import DeliveryAvailableOrders from './delivery/AvailableOrders';
import DeliveryOngoingOrders from './delivery/OngoingOrders';
import DeliveryPreviousOrders from './delivery/PreviousOrders';
import DeliveryRevenue from './delivery/Revenue';
import DeliveryProfile from './delivery/Profile';
import DeliveryNotices from './delivery/Notices';

// Services Components
import AllServicesPage from './pages/Services/AllServicesPage';
import ServicesCard from './pages/Services/ServicesCard';
import VendorCard from './pages/Services/VendorCard';
import VendorsByCategory from './pages/Services/VendorsByCategory';
import VendorCardDynamic from './pages/Services/VendorCardDynamic';
import Terms from './pages/Terms';


const App = () => {
  // Only show Navbar except on login/register/dashboard routes
  const showNavbar = (path) => {
    // Don't show on admin pages
    if (path.startsWith('/admin')) return false;
    // Don't show on supplier pages
    if (path.startsWith('/supplier')) return false;
    // Don't show on vendor pages
    if (path.startsWith('/vendor')) return false;
    // Don't show on delivery pages
    if (path.startsWith('/delivery')) return false;
    // Don't show on auth pages
    if (path === '/signup' || path === '/register' || path === '/reset-password' || path === '/email-verify') return false;
    // Show on all other pages
    return true;
  };

  return (
    <div className='app'>
      <ToastContainer />
      {showNavbar(window.location.pathname) && <Navbar />}
      <main>
        <Routes>
  <Route path="/supplystore" element={<SupplyStore />} />
  <Route path="/product/:id" element={<ProductCardDynamic />} />
  <Route path="/booking" element={<BookingPage />} />
  <Route path="/payment" element={<PaymentPage />} />
  <Route path="/service-booking" element={<ServiceBookingPage />} />
    <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/adminlogin" element={<Adminlogin />} />
        <Route path='/' element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/About" element={<About />} />
        

  <Route path='/AllServicesPage' element={<AllServicesPage />} />
  <Route path='/ServicesCard' element={<ServicesCard />} />
  <Route path='/VendorCard' element={<VendorCard />} />
  <Route path='/services/category/:category' element={<VendorsByCategory />} />
  <Route path='/services/category/vendor/:id' element={<VendorCardDynamic />} />

  <Route path="/terms" element={<Terms />} />


        <Route path="/vendorlogin" element={<VendorLogin />} />
        <Route path="/vendorregister" element={<VendorRegister />} />

        <Route path="/vendor" element={
          <VendorContextProvider>
            <VendorDashboard />
          </VendorContextProvider>
        }>
          <Route index element={<VendorAvailableOrders />} />
          <Route path="orders" element={<VendorAvailableOrders />} />
          <Route path="ongoing" element={<OngoingOrders />} />
          <Route path="previous" element={<PreviousOrders />} />
          <Route path="notices" element={<VendorNotices />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="reviews" element={<VendorReviews />} />
          <Route path="profile" element={<VendorProfile />} />
        </Route>

        <Route path="/supplierlogin" element={
          <SupplierContextProvider>
            <SupplierLogin />
          </SupplierContextProvider>
        } />
        <Route path="/supplierregister" element={
          <SupplierContextProvider>
            <SupplierRegister />
          </SupplierContextProvider>
        } />

        <Route path="/deliverylogin" element={<DeliveryLogin />} />
        <Route path="/deliveryregister" element={<DeliveryRegister />} />

        <Route path="/supplier" element={
          <SupplierContextProvider>
            <SupplierDashboard />
          </SupplierContextProvider>
        }>
          <Route index element={<SupplierAvailableOrders />} />
          <Route path="orders" element={<SupplierAvailableOrders />} />
          <Route path="waiting" element={<SupplierWaitingOrders />} />
          <Route path="previous" element={<SupplierPreviousOrders />} />
          <Route path="notices" element={<SupplierNotices />} />
          <Route path="availableProducts" element={<AvailableProducts />} />
          <Route path="addProducts" element={<AddProducts />} />
          <Route path="revenue" element={<SupplierRevenue />} />
          <Route path="reviews" element={<SupplierReviews />} />
          <Route path="profile" element={<SupplierProfile />} />
        </Route>

        <Route path="/delivery" element={
          <DeliveryContextProvider>
            <DeliveryDashboard />
          </DeliveryContextProvider>
        }>
          <Route index element={<DeliveryAvailableOrders />} />
          <Route path="orders" element={<DeliveryAvailableOrders />} />
          <Route path="ongoing" element={<DeliveryOngoingOrders />} />
          <Route path="previous" element={<DeliveryPreviousOrders />} />
          <Route path="notices" element={<DeliveryNotices />} />
          <Route path="revenue" element={<DeliveryRevenue />} />
          <Route path="profile" element={<DeliveryProfile />} />
        </Route>

        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<DashboardMain />} />
          <Route path="users" element={<Users />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="products" element={<Products />} />
          <Route path="delivery-drivers" element={<DeliveryDrivers />} />
          <Route path="services" element={<Services />} />
        </Route>
      </Routes>
      </main>
    </div>
  );
};

export default App;