import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import sell from "../../assets/sell.png";
import cart from "../../assets/icons/cart.svg";
import { CartContext } from "../CartContext";

// enviroment variable
const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const Sell = () => {
  axios.defaults.withCredentials = true;

  const { addToCart } = useContext(CartContext);
  const [data, setData] = useState({
    product_id: "1",
    quantity: "",
    date: "",
    description: "",
    unit_price: "",
    customer: "",
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
          const response = await axios.get(`${BackEndURL}/product/getProducts`);
          sessionStorage.setItem("products", JSON.stringify(response.data));
          setProducts(response.data);
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
      fetchProducts();
    } else {
      setProducts(JSON.parse(sessionStorage.getItem("products")));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("sending to backend");
    console.table(data);
    axios
      .post(`${BackEndURL}/sales/makeSales`, data)
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

  const handleAddToCart = () => {
    if (
      data.quantity === "" ||
      data.date === "" ||
      data.description === "" ||
      data.unit_price === "" ||
      data.color === ""
    )
      alert("fill the form propely");
    else {
      addToCart(data);
      alert("Item added to cart");
    }
  };

  const handleOptionChange = (e) => {
    console.log("checkbox clicked");
    data.isImported === 1
      ? setData({ ...data, isimported: 0 })
      : setData({ ...data, isimported: 1 });
  };

  return (
    <div className=" w-full mb-2 overflow-hidden md:no-scrollbar hover:overflow-y-scroll md:flex justify-center items-center">
      <div className="w-full mt-24 md:pt-28 ">
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
            {products.map((product) => (
              <option value={product?.PID}>{product?.Product_name}</option>
            ))}
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
          <label htmlFor="color" className="text-xs pt-28">
            Color
          </label>
          <br />
          <input
            type="text"
            onChange={handleChange}
            name="color"
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

          <label htmlFor="isImported" className="text-xs">
            Imported
          </label>
          <input
            type="radio"
            onClick={handleOptionChange}
            checked={data.isimported === 1}
            name="isImported"
            id="isImported"
            className=" border-white border rounded-2xl bg-mybg  w-11/12 "
          />
          <br />
          {/* <button
            type="submit"
            className="rounded-full tracking-widest bg-blue-400 w-11/12 my-4 py-2.5 text-xs font-bold "
          >
            SUBMIT
          </button> */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-full  flex justify-center items-start bg-blue-400 text-black w-11/12 my-4 py-2.5 text-sm font-bold "
          >
            <img src={cart} alt="" className="w-6 mr-3" />
            <div>Add To Cart</div>
          </button>
          <br />
        </form>
      </div>
      <div className="mt-5 md:pb-0 pb-16">
        <img src={sell} alt="" className="w-4/5 pl-10 pt-20" />
      </div>
    </div>
  );
};

export default Sell;
