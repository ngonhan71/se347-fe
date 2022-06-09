import { Routes, Route } from "react-router-dom";
import DefaultLayout from "./components/Layout/DefaultLayout"
import AdminLayout from "./components/Layout/AdminLayout"
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
// import ContactPage from "./pages/ContactPage";
// import DiscountPage from "./pages/DiscountPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";
// import LikePage from "./pages/LikePage";
import AccountPage from "./pages/AccountPage";
import MyOrderPage from "./pages/MyOrderPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PaymentPage from "./pages/PaymentPage";
import OccasionDetailPage from "./pages/OccasionDetailPage";
import SearchPage from "./pages/SearchPage";

import ProtectedRoute from "./components/ProtectedRoute";
import FormAddFlower from "./components/FormAddFlower"
import FormUpdateFlower from "./components/FormUpdateFlower"
import FormAddOccasion from "./components/FormAddOccasion"
import FormUpdateOccasion from "./components/FormUpdateOccasion"
import DashboardPage from "./components/DashboardPage"
import FlowerList from "./components/FlowerList"
import OccasionList from "./components/OccasionList"
import OrderList from "./components/OrderList";
import AccessDenied from "./pages/AccessDenied"

import './App.css';
import { useDispatch, useSelector } from "react-redux";
import userApi from "./api/userApi";
import { login, logout } from "./redux/actions/user";
import { useEffect } from "react";

function App() {
  const currentUser = useSelector((state) => state.user.currentUser)
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await userApi.getCurrentUser()
        const { email, fullName, phoneNumber, avatar, _id, role } = data?.user
        dispatch(login({email, fullName, phoneNumber, avatar, userId: _id, role}))
      } catch (error) {
        if (error.response.status === 403 || error.response.status === 401) {
          localStorage.removeItem('accessToken')
          dispatch(logout())
        }
      }
    }
    const token = localStorage.getItem('accessToken')
    if (token && !currentUser.userId) {
      fetchData()
    }
  },[dispatch, currentUser])
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/gio-hang" element={<CartPage />} />
          {/* <Route path="/lien-he" element={<ContactPage />} />  */}
          {/* <Route path="/khuyen-mai" element={<DiscountPage />} /> */}
          <Route path="/dang-nhap" element={<LoginPage />} />
          <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />
          <Route path="/dat-lai-mat-khau/:code" element={<ResetPasswordPage />} />
          <Route path="/dang-ki" element={<RegisterPage />} />
          <Route path="/san-pham" element={<ProductPage />} />
          <Route path="/chi-tiet-san-pham/:slug" element={<ProductDetailPage />} />
          {/* <Route path="/yeu-thich" element={<LikePage />} /> */}
         
          <Route path="/thanh-toan" element={<PaymentPage />} />
          <Route path="/san-pham/chu-de/:occasion" element={<OccasionDetailPage/>} />
          <Route path="/tim-kiem" element={<SearchPage />} />
        </Route>

        <Route path="/" element={<ProtectedRoute role={!!currentUser.userId} />}>
          <Route element={<DefaultLayout />}>
            <Route path="tai-khoan" element={<AccountPage />} />
            <Route path="don-hang" element={<MyOrderPage />} />
          </Route>
        </Route>

        {currentUser && currentUser.role && (
          <Route path="/admin" element={<ProtectedRoute role={currentUser.role} />}>
            <Route element={<AdminLayout />}>
              <Route path="" element={<DashboardPage />} />
              <Route path="flower" element={<FlowerList />} />
              <Route path="flower/add" element={<FormAddFlower />} />
              <Route path="flower/update/:id" element={<FormUpdateFlower />} />

              <Route path="occasion" element={<OccasionList />} />
              <Route path="occasion/add" element={<FormAddOccasion />} />
              <Route path="occasion/update/:id" element={<FormUpdateOccasion />} />


              <Route path="order" element={<OrderList />} />

            </Route>
          </Route>
        )}

        {!currentUser.role && (
          <Route path="/admin/*" element={<AccessDenied />} />
        )}

      </Routes> 
    </div>
  );
}

export default App;
