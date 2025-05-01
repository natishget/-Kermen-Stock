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
import { AlignJustify, X } from "lucide-react";

// enviroment variable
const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const NavSide = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(1);
  let att =
    "md:pl-4 pl-3 pt-2 pb-2 flex border-l-4 border-yellow-400 rounded text-yellow-400 md:text-xl text-sm";
  let att2 = "md:pl-4 pl-3 pt-2 flex pb-2 md:text-xl text-sm";

  const handleOpenCloseMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    switch (location.pathname) {
      case "/pages/":
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
    <div
      className={`${
        isOpen ? "w-[7%] md:h-[5%] h-[3%]" : " md:w-[20%] w-[35%] h-full"
      }  bg-mycolor text-white  flex-col  font-bold text-lg`}
    >
      <button
        onClick={handleOpenCloseMenu}
        className="flex justify-center items-center cursor-pointer pl-1"
      >
        {isOpen ? <AlignJustify /> : <X />}
      </button>
      <div className={`h-[75%] ${isOpen ? "hidden" : "flex-col"}`}>
        <Link to="/pages/" className={value === 1 ? att : att2}>
          <img src={icon_home} alt="" className="md:w-8 w-6 pr-3" />
          Home
        </Link>
        <Link to="/pages/sales" className={value === 2 ? att : att2}>
          <img src={icon_sales} alt="" className="md:w-8 w-6 pr-3" />
          Sales
        </Link>
        <Link to="/pages/purchase" className={value === 3 ? att : att2}>
          <img src={icon_purchase} alt="" className="md:w-8 w-6 pr-3" />
          Purchase
        </Link>
        <Link to="/pages/sell" className={value === 4 ? att : att2}>
          <img src={icon_sell} alt="" className="md:w-8 w-6 pr-3" />
          Sell Now
        </Link>
        <Link to="/pages/buy" className={value === 5 ? att : att2}>
          <img src={icon_buy} alt="" className="md:w-8 w-6 pr-3 " />
          Buy Now
        </Link>
        <Link to="/pages/inventory" className={value === 6 ? att : att2}>
          <img src={icon_level} alt="" className="md:w-8 w-6 pr-3" />
          Invetory Level
        </Link>
        <Link to="/pages/cogs" className={value === 7 ? att : att2}>
          <img src={icon_level} alt="" className="md:w-8 w-6 pr-3" />
          COGS
        </Link>
      </div>
      <div
        className={`flex justify-center items-center cursor-pointer tracking-wider ${
          isOpen ? "hidden" : "flex"
        }`}
        onClick={handleLogout}
      >
        Logout
        <img src={icon_logout} alt="Kermen logo" className="w-10 p-2" />
      </div>
    </div>
  );
};

export default NavSide;
