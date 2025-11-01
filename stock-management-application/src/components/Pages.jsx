import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";
import DialogForAddProduct from "./DialogBox/DialogForAddProduct";
import logo from "../assets/kermen_logo2.png";
import Cart_png from "../assets/shopping-cart.png";
import NavSide from "./NavSide";
import Home from "../components/pages/Home";
import Sell from "./pages/Sell";
import Buy from "../components/pages/buy";
import Purchase from "../components/pages/purchase";
import Sales from "../components/pages/Sales";
import Develop from "../components//pages/InventoryLevel";
import Cart from "./pages/Cart";
import COGS from "./pages/COGS";
import UserManagement from "./pages/UserManagement";

import axios from "axios";
import DialogForAddUser from "./DialogBox/DialogForAddUser";

// enviroment variable
const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const Pages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("");
  const [loginUserData, setLoginUserData] = useState();

  // axios credentials
  axios.defaults.withCredentials = true;
  useEffect(() => {
    if (location.pathname === "/pages/" || location.pathname === "/pages") {
      setCurrentPath("Home");
    } else if (location.pathname === "/pages/sell") {
      setCurrentPath("Sell Now");
    } else if (location.pathname === "/pages/buy") {
      setCurrentPath("Buy Now");
    } else if (location.pathname === "/pages/purchase") {
      setCurrentPath("Purchase");
    } else if (location.pathname === "/pages/sales") {
      setCurrentPath("Sales");
    } else if (location.pathname === "/pages/inventory") {
      setCurrentPath("Inventory Levels");
    } else if (location.pathname === "/pages/cart") {
      setCurrentPath("Carts");
    } else if (location.pathname === "/pages/user-management") {
      setCurrentPath("Users");
    } else if (location.pathname === "/pages/cogs") {
      setCurrentPath("Finance");
    } else {
      setCurrentPath("");
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BackEndURL}/auth/protectedRoute`);
        console.log("response", response.data);
        setLoginUserData(response.data);
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
        } else if (error.request) {
          alert("No response from server. Please try again.");
        } else {
          alert("Error: " + error.message);
        }
        navigate("/");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 h-screen w-full text-white overflow-hidden ">
      <header className="bg-mycolor h-[13%] flex justify-between items-center drop-shadow-xl">
        <img src={logo} alt="Kermen logo" className="w-32 h-16 p-2" />
        <p className="self-center text-xl text-gray-600 font-bold">
          Stock Management Application -
          <span className="text-yellow-400"> {currentPath}</span>{" "}
        </p>
        <div className="flex justify-center items-center">
          <DialogForAddUser />
          <DialogForAddProduct />
          <Link to="/pages/cart">
            <img src={Cart_png} alt="cart" className=" mr-6 w-8" />
          </Link>
        </div>
      </header>

      <div className="flex gap-5 h-[87%]">
        <NavSide />
        {/* <BrowserRouter> */}
        <Routes>
          <Route index path="/" element={<Home userData={loginUserData} />} />
          <Route exact path="sell" element={<Sell />} />
          <Route path="buy" element={<Buy />} />
          <Route path="purchase" element={<Purchase />} />
          <Route path="sales" element={<Sales />} />
          <Route path="inventory" element={<Develop />} />
          <Route path="cart" element={<Cart />} />
          <Route path="cogs" element={<COGS />} />
          <Route path="user-management" element={<UserManagement />} />
        </Routes>
        {/* </BrowserRouter>  */}
      </div>
    </div>
  );
};

export default Pages;
