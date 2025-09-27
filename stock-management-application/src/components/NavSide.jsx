// Navside.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import icon_home from "../assets/icons/house-solid.svg";
import icon_purchase from "../assets/icons/purchase.svg";
import icon_sales from "../assets/icons/sales.svg";
import icon_buy from "../assets/icons/buy.svg";
import icon_level from "../assets/icons/level.svg";
import icon_sell from "../assets/icons/sell.svg";
import icon_logout from "../assets/icons/logout.svg";
import axios from "axios";

import { House, BadgeDollarSign, ShoppingBag, Handshake, ShoppingCart, ChartNoAxesColumn, Calculator, LogOut  } from "lucide-react"

// enviroment variable
const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const NavSide = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(1);
  const[isAdmin, setIsAdmin] = useState(false);
  let att =
    `pl-4 py-5 flex gap-2 items-center border-l-4 border-yellow-400 rounded text-gray-600 text-2xl mt-6 bg-gray-100 ml-2 `;
  let att2 = `pl-4 py-4 flex items-center gap-2 text-xl mt-6 border border-black rounded justify-center mx-2  hover:text-gray-800`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BackEndURL}/auth/protectedRoute`, {
          withCredentials: true,
        });
        
        setIsAdmin(response?.data?.user?.userType === "admin" ? true : false);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data.message);
        } else if (error.request) {
          alert("No response from server. Please try again.");
        } else {
          alert("Error: " + error.message);
        }
        console.log("error", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    switch (location.pathname) {
      case "/pages/":
        setValue(1);
        break;
      case "/pages":
        setValue(1);
        break;
      case "/pages/sales":
        setValue(2);
        break;
      case "/pages/purchase":
        setValue(3);
        break;
      case "/pages/sell":
        setValue(4);
        break;
      case "/pages/buy":
        setValue(5);
        break;
      case "/pages/inventory":
        setValue(6);
        break;
      case "/pages/cogs":
        setValue(7);
        break;
      case "/pages/user-management":
        setValue(8);
        break;
      default:
        setValue(0);
        break;
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BackEndURL}/auth/logout`, {
        withCredentials: true,
      });
      console.log(response.data);
      navigate("/");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else if (error.request) {
        alert("No response from server. Please try again.");
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <div className="w-[15%] h-full bg-mycolor text-gray-400 flex flex-col justify-between pb-8 font-bold text-lg drop-shadow-xl">
      <div className="">
        <Link to="/pages/" className={value === 1 ? att : att2}>
          <House />
          Home
        </Link>
        <Link to="/pages/sales" className={value === 2 ? att : att2}>
          <BadgeDollarSign />
          Sales
        </Link>
        <Link to="/pages/purchase" className={value === 3 ? att : att2}>
          <ShoppingBag />
          Purchase
        </Link>
        <Link to="/pages/sell" className={value === 4 ? att : att2}>
          <Handshake />
          Sell Now
        </Link>
        <Link to="/pages/buy" className={value === 5 ? att : att2}>
         <ShoppingCart />
          Buy Now
        </Link>
        <Link to="/pages/inventory" className={value === 6 ? att : att2}>
          <ChartNoAxesColumn />
          Invetory Level
        </Link>
        <Link to="/pages/cogs" className={ isAdmin ? (value === 7 ? att : att2) : "hidden" }>
          <Calculator />
          COGS
        </Link>
        <Link to="/pages/user-management" className={ isAdmin ? (value === 8 ? att : att2) : "hidden" }>
          <Calculator />
          User Management
        </Link>
      </div>
      <div
        className="flex justify-center items-center cursor-pointer border border-gray-600 bg-gray-800 text-white py-2 rounded-full mx-4"
        onClick={handleLogout}
      >
        <LogOut />
        Logout
      </div>
    </div>
  );
};

export default NavSide;
