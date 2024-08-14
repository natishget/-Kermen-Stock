import React, { useEffect, useState } from "react";
import axios from "axios";
import sell from "../../assets/sell.png";

const Sell = () => {
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
    console.table(data);
    axios
      .post(`http://localhost:8800/api/sales/makeSales`, data)
      .then((res) => {
        console.log(res.data.messsage);
        if (res.data.message === "Yes") {
          alert("your sells have been made");
          window.location.reload();
        } else {
          throw new Error("Insufficient quantity");
        }
      })
      .catch((err) => {
        alert(err instanceof Error ? err.message : "An error occurred");
      });
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className=" w-full mb-2 col-span-4 row-span-3 overflow-hidden md:no-scrollbar hover:overflow-y-scroll md:flex justify-center items-center">
      <div className="w-full  mt-5 md:pt-28 ">
        <form
          action=""
          onSubmit={handleSubmit}
          className="w-full flex-col justify-center items-center pl-10 md:pb-20 pt-5"
        >
          <h1 className="md:text-4xl text-3xl font-bold">
            Sell <span className="text-blue-300">Now</span>
          </h1>
          <p className="text-xs pt-3 pb-7">Place to make growth!!</p>
          <label htmlFor="" className="text-xs pt-1">
            Product Name
          </label>
          <br />
          <select
            name="product_id"
            onChange={handleChange}
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-2xl bg-mybg p-2 w-11/12 mb-3"
          >
            <option value="1">Aluminium panel: 001</option>
            <option value="2">Rail: 002</option>
            <option value="0">Aluminium plate: 000</option>
          </select>
          <br />
          <label htmlFor="" className="text-xs mt-16">
            Quantity
          </label>
          <br />
          <input
            type="number"
            name="quantity"
            onChange={handleChange}
            id=""
            required
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-2xl bg-mybg p-2 w-11/12 mb-3"
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
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-2xl bg-mybg p-2 w-11/12 mb-3"
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
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-2xl bg-mybg p-2 w-11/12 mb-3"
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
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-2xl bg-mybg p-2 w-11/12 mb-3"
          />
          <br />
          <label htmlFor="description" className="text-xs pt-28">
            Description
          </label>
          <br />
          <textarea
            type="text"
            onChange={handleChange}
            name="description"
            id="description"
            required
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border-2 rounded-2xl bg-mybg p-2 w-11/12 mb-3"
          />
          <br />
          <button
            type="submit"
            className="rounded-full tracking-widest bg-blue-400 w-11/12 my-4 py-2.5 text-xs font-bold "
          >
            SUBMIT
          </button>
          <br />
        </form>
      </div>
      <div className="mt-5 md:pb-0 pb-16">
        <img src={sell} alt="kermen logo" className="w-4/5 pl-10 pt-20" />
      </div>
    </div>
  );
};

export default Sell;
