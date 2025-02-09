import React, { useEffect, useState } from "react";
import axios from "axios";
import buy from "../../assets/buy.png";

const Buy = () => {
  const [data, setData] = useState({
    product_id: "0",
    quantity: "",
    date: "",
    description: "",
    unit_price: "",
    invoice_no: "",
    seller: "",
    color: "",
    isimported: 1,
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (
      sessionStorage.getItem("products") === null ||
      sessionStorage.getItem("products") === undefined
    ) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8800/api/product/getProducts`
          );
          sessionStorage.setItem("products", JSON.stringify(response.data));
          setProducts(response.data);
        } catch (error) {
          console.log("error", error);
        }
      };
      fetchProducts();
    } else {
      setProducts(JSON.parse(sessionStorage.getItem("products")));
    }
  }, []);

  const handleSubmit = () => {
    if (
      data.quantity === "" ||
      data.date === "" ||
      data.unit_price === "" ||
      data.invoice_no === "" ||
      data.seller === "" ||
      data.color === ""
    )
      alert("Please Fill the form properly");
    else {
      axios
        .post(`http://localhost:8800/api/purchase/makePurchase`, data)
        .then((res) => {
          console.log(res.data);
          if (res.data === "1") {
            alert("successfully purchased");
            window.location.reload();
          }
        })
        .catch((err) => {
          console.error(err);
          alert("something wrong please trying again after refreshing");
        });
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "color") {
      const color = e.target.value.toLowerCase();
      setData({ ...data, [e.target.name]: color });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const handleOptionChange = (e) => {
    console.log("checkbox clicked");
    data.isimported === 1
      ? setData({ ...data, isimported: 0 })
      : setData({ ...data, isimported: 1 });
  };

  return (
    <div className="col-span-4 row-span-3 overflow-hidden no-scrollbar hover:overflow-y-scroll md:flex justify-center items-center">
      <div className="w-full mt-24 md:pt-28 pt-0">
        <form
          action=""
          className="w-full flex-col justify-center items-center pl-10 md:pb-20 pt-5"
        >
          <h1 className="md:text-4xl text-3xl font-bold">
            Buy <span className="text-yellow-500">Now</span>
          </h1>
          <p className="text-xs pt-3 pb-7">
            Small purchase makes a big difference
          </p>
          <label htmlFor="" className="text-xs pt-28">
            Product ID
          </label>
          <br />
          <select
            name="product_id"
            onChange={handleChange}
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs focus:outline-none focus:border-red-300 focus:ring-1 focus:ring-red-300
             border-white border rounded-2xl bg-mybg p-2 w-11/12 mb-3"
          >
            {products.map((product, index) => (
              <option value={product.PID}>{product?.Product_name}</option>
            ))}
          </select>
          <br />
          <label htmlFor="quantity" className="text-xs pt-28">
            Quantity
          </label>
          <br />
          <input
            type="number"
            onChange={handleChange}
            name="quantity"
            id="quantity"
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300
             border-white border rounded-2xl bg-mybg p-2 w-11/12 mb-3"
          />
          <br />
          <label htmlFor="date" className="text-xs pt-28">
            Date
          </label>
          <br />
          <input
            type="date"
            onChange={handleChange}
            name="date"
            id="date"
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300
             border-white border rounded-2xl bg-mybg p-2 w-11/12 mb-3"
          />
          <br />
          <label htmlFor="invoice_no" className="text-xs pt-28">
            Invoice No
          </label>
          <br />
          <input
            type="text"
            onChange={handleChange}
            name="invoice_no"
            id="invoice"
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300
             border-white border rounded-2xl bg-mybg p-2 w-11/12 mb-3"
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
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300
             border-white border rounded-2xl bg-mybg p-2 w-11/12 mb-3"
          />
          <br />
          <label htmlFor="color" className="text-xs pt-28">
            Color
          </label>
          <br />
          <input
            type="text"
            onChange={handleChange}
            name="color"
            id="color"
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300
             border-white border rounded-2xl bg-mybg p-2 w-11/12 mb-3"
          />
          <br />
          <label htmlFor="description" className="text-xs pt-28">
            Seller Name
          </label>
          <br />
          <input
            type="text"
            onChange={handleChange}
            name="seller"
            id="seller"
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300
             border-white border rounded-2xl bg-mybg p-2 w-11/12 mb-3"
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
            className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300
             border-white border rounded-2xl bg-mybg p-2 w-11/12 mb-3"
          />
          <br />
          <label htmlFor="isImported" className="text-xs">
            Imported
          </label>
          <input
            type="radio"
            onClick={handleOptionChange}
            checked={data.isimported === 1}
            name="isimported"
            id="isImported"
            className=" border-white border rounded-2xl bg-mybg  w-11/12 "
          />
          <br />
          <button
            onClick={handleSubmit}
            className="rounded-full bg-yellow-500 tracking-widest md:w-11/12 w-72 my-4 py-2.5 text-xs font-bold "
          >
            SUBMIT
          </button>
          <br />
        </form>
      </div>
      <div className="">
        <img src={buy} alt="" className="w-4/5 pl-10 pt-20 md:pb-0 pb-16" />
      </div>
    </div>
  );
};

export default Buy;
