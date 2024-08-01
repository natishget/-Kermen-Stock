// Navside.jsx
import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import icon_home from "../assets/icons/house-solid.svg"
import icon_purchase from "../assets/icons/purchase.svg"
import icon_sales from "../assets/icons/sales.svg"
import icon_buy from "../assets/icons/buy.svg"
import icon_level from "../assets/icons/level.svg"
import icon_sell from "../assets/icons/sell.svg"
const NavSide = () =>{
  const [value, setValue] = useState(1);
  let att ="pl-4 pt-2 flex border-l-4 border-yellow-400 rounded text-yellow-400 text-xl"
  let att2 ="pl-4 pt-2 flex "
  const LinkChanger = ( value1 ) =>{
    setValue(value1);
  }

  return (
    <>
    
      <div className="col-span-1 row-span-3 bg-mycolor text-white  flex-col justify-center font-bold">
                <Link to="/pages/" className={value === 1 ? att : att2}  onClick={() => {
                  LinkChanger(1)
                }} >
                    <img src={icon_home} alt="" className="w-6 pr-3"/>
                    Home
                </Link>
                <Link to="/pages/sales" className={value === 2 ? att : att2}  onClick={ () => {
                  LinkChanger(2)
                } } >
                    <img src={icon_sales} alt="" className="w-6 pr-3"/>
                    Sales
                </Link>
                <Link  to="/pages/purchase" className={value === 3 ? att : att2}  onClick={ () => {
                  LinkChanger(3)
                } } >
                    <img src={icon_purchase} alt="" className="w-6 pr-3"/>
                    Purchase
                </Link>
                <Link to="/pages/sell" className={value === 4 ? att : att2}  onClick={ () => {
                  LinkChanger(4)
                } } >
                    <img src={icon_sell} alt="" className="w-6 pr-3"/>
                    Sell Now
                </Link>
                <Link to="/pages/buy" className={value === 5 ? att : att2}  onClick={ () => {
                  LinkChanger(5)
                } } >
                    <img src={icon_buy} alt="" className="w-6 pr-3"/>
                    Buy Now
                </Link>
                <Link to="/pages/inventory" className={value === 6 ? att : att2}  onClick={ () => {
                  LinkChanger(6)
                } } >
                    <img src={icon_level} alt="" className="w-6 pr-3"/>
                    Invetory Level
                </Link>
            </div>
    </>
  )
}

export default NavSide
