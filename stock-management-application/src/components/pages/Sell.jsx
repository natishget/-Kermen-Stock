import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import sell from "../../assets/sell.png";

const Sell = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    product_id: "0",
    quantity: "",
    date: "",
    description: "",
    unit_price: "",
    customer: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("sending to backend");
    axios
      .post(`http://localhost:8800/api/sales/makeSales`, data)
      .then((res) => {
        console.log(res.data);
        navigate();
      })
      .catch((err) => {
        console.error(err.message);
        alert("something wrong please try again after refereshing");
      });
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="col-span-2 row-span-3 mt-5 ">
        <form
          action=""
          onSubmit={handleSubmit}
          className="w-full h-full flex-col justify-center items-center pl-10 "
        >
          <h1 className="md:text-4xl text-3xl font-bold">Sell Now</h1>
          <p className="text-xs pt-3 pb-7">Place to make growth!!</p>
          <label htmlFor="" className="text-xs pt-28">
            Product Name
          </label>
          <br />
          <select
            onSelect={(value) => {
              setData({ ...data, product_id: value });
            }}
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-full bg-mybg p-1 md:w-80 w-72"
          >
            <option value="0">Aluminium panel: 000</option>
            <option value="1">Rail: 001</option>
            <option value="2">Aluminium plate: 002</option>
          </select>
          <br />
          <label htmlFor="" className="text-xs pt-28">
            Quantity
          </label>
          <br />
          <input
            type="number"
            name="quantity"
            onChange={handleChange}
            id=""
            required
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-full bg-mybg p-1 md:w-80 w-72"
          />
          <br />
          <label htmlFor="date" className="text-xs pt-28">
            Date
          </label>
          <br />
          <input
            type="date"
            name="date"
            onChange={handleChange}
            id="date"
            required
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-full bg-mybg p-1 md:w-80 w-72"
          />
          <br />
          <label htmlFor="description" className="text-xs pt-28">
            Description
          </label>
          <br />
          <input
            type="text"
            onChange={handleChange}
            name="description"
            id="description"
            required
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-full bg-mybg p-1 md:w-80 w-72"
          />
          <br />
          <label htmlFor="price" className="text-xs pt-28">
            Unit price
          </label>
          <br />
          <input
            type="number"
            onChange={handleChange}
            name="unit_price"
            id="price"
            required
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-full bg-mybg p-1 md:w-80 w-72"
          />
          <br />
          <label htmlFor="customer" className="text-xs pt-28">
            Customer Name /Optional/
          </label>
          <br />
          <input
            type="text"
            onChange={handleChange}
            name="customer"
            id="customer"
            required
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-full bg-mybg p-1 md:w-80 w-72"
          />
          <br />
          <button
            type="submit"
            className="rounded-full bg-mybtn md:w-80 w-72 my-4 py-2.5 text-xs font-bold "
          >
            Submit
          </button>
          <br />
        </form>
      </div>
      <div className="col-span-2 row-span-3 mt-5">
        <img src={sell} alt="kermen logo" className="w-2/3 pl-10 pt-20" />
      </div>
    </>
  );
};

export default Sell;
