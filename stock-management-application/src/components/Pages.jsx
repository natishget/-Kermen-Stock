import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import logo from "../assets/kermen_logo.png";
import icon_logout from "../assets/icons/logout.svg";
import NavSide from "./NavSide";
import Home from "../components/pages/Home";
import Sell from "./pages/Sell";
import Buy from "../components/pages/buy";
import Purchase from "../components/pages/purchase";
import Sales from "../components/pages/Sales";
import Develop from "../components//pages/InventoryLevel";

const Pages = () => {
  const location = useLocation();
  console.log(location.pathname);
  const [currentPath, setCurrentPath] = useState("");
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
    } else {
      setCurrentPath("");
    }
  }, [location.pathname]);

  console.log(currentPath);

  return (
    <div className="bg-mybg h-screen w-full text-white overflow-hidden">
      <header className="bg-mycolor flex justify-between">
        <img src={logo} alt="Kermen logo" className="w-32 p-2" />
        <p className="self-center text-white font-bold">
          Stock Management Application -
          <span className="text-yellow-400"> {currentPath}</span>{" "}
        </p>
        <Link to="/" className="flex justify-center items-center">
          Logout
          <img src={icon_logout} alt="Kermen logo" className="w-10 p-2" />
        </Link>
      </header>

      <div className="grid grid-cols-5 grid-rows-3 h-full">
        <NavSide />
        {/* <BrowserRouter> */}
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route exact path="sell" element={<Sell />} />
          <Route path="buy" element={<Buy />} />
          <Route path="purchase" element={<Purchase />} />
          <Route path="sales" element={<Sales />} />
          <Route path="inventory" element={<Develop />} />
        </Routes>
        {/* </BrowserRouter>  */}
      </div>
    </div>
  );
};

export default Pages;
