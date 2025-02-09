import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";
import DialogForAddProduct from "./DialogBox/DialogForAddProduct";
import logo from "../assets/kermen_logo.png";
import icon_logout from "../assets/icons/logout.svg";
import NavSide from "./NavSide";
import Home from "../components/pages/Home";
import Sell from "./pages/Sell";
import Buy from "../components/pages/buy";
import Purchase from "../components/pages/purchase";
import Sales from "../components/pages/Sales";
import Develop from "../components//pages/InventoryLevel";
import Cart from "./pages/Cart";
import COGS from "./pages/COGS";
import CartImg from "../assets/icons/cart.svg";

import axios from "axios";

const Pages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.pathname);
  const [currentPath, setCurrentPath] = useState("");
  const [loginUserData, setLoginUserData] = useState();

  // axios credentials
  axios.defaults.withCredentials = true;
  useEffect(() => {
    if (location.pathname === "/pages/") {
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
    } else {
      setCurrentPath("");
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/auth/protectedRoute`
        );
        console.log("response", response.data);
        setLoginUserData(response.data);
      } catch (error) {
        console.log("error", error.message);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8800/api/auth/logout",
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-mybg h-screen w-full text-white overflow-hidden">
      <header className="bg-mycolor flex justify-between">
        <img src={logo} alt="Kermen logo" className="w-32 p-2" />
        <p className="self-center text-white font-bold">
          Stock Management Application -
          <span className="text-yellow-400"> {currentPath}</span>{" "}
        </p>
        <div className="flex justify-center items-center">
          <DialogForAddProduct />
          <Link to="/pages/cart">
            <img
              src={CartImg}
              alt="cart"
              className="fill-yellow-500 mr-6 w-8"
            />
          </Link>
          <div
            className="flex justify-center items-center"
            onClick={handleLogout}
          >
            Logout
            <img src={icon_logout} alt="Kermen logo" className="w-10 p-2" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-5 grid-rows-3 h-full">
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
        </Routes>
        {/* </BrowserRouter>  */}
      </div>
    </div>
  );
};

export default Pages;
