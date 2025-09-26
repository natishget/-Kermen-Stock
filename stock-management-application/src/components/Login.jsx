import React, { useState, useEffect } from "react";
import cubic from "../assets/cubic1.jpg";
import axios from "axios"; // Import axios
import { useNavigate } from "react-router-dom"; // Import useNavigate

// enviroment variable
const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  // protected Route
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BackEndURL}/auth/protectedRoute`, {
          withCredentials: true,
        });
        navigate("/pages/");
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

  const handleOptionChange = (e) => {
    setIsAdmin(e.target.value === "true");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdmin === null) {
      alert("Please choose user type");
    } else {
      try {
        const response = await axios.post(
          `${BackEndURL}/auth/login`,
          { username, password, isAdmin },
          { withCredentials: true }
        );
        navigate("/pages");
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
          console.log(error.response.data.message);
        } else if (error.request) {
          alert("No response from server. Please try again.");
        } else {
          alert("Error: " + error.message);
        }
        console.log("error", error);
      }
    }
  };

  return (
    <div className="w-full h-screen bg-mybg">
      <div className="md:flex sm:flex-row h-full md:p-10 p-5 drop-shadow-xl">
        <form
          onSubmit={handleSubmit}
          className="md:w-1/2 sm:w-full h-full text-gray-600 bg-mycolor flex justify-center items-center"
        >
          <div className="mx-5">
            <h1 className="md:text-4xl text-2xl">Welcome!</h1>
            <h1 className="md:text-4xl text-3xl font-bold">Login</h1>
            <p className=" pt-3 pb-7">
              Manage your stock properly and grow your profit
            </p>
            <label htmlFor="username" className=" pt-28">
              Username
            </label>
            <br />
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Example: JohnTheBest"
              required
              className="placeholder:italic placeholder:text-slate-400 border-white border rounded-full bg-gray-100 p-2 md:w-80 w-72"
            />
            <br />
            <label htmlFor="password" className="text-xs mt-3">
              Password
            </label>
            <br />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 Character"
              required
              className="placeholder:italic placeholder:text-slate-400  border-white border rounded-full bg-gray-100 p-2 md:w-80 w-72"
            />
            <br />

            <div className="mt-5 flex items-center">
              <input
                type="radio"
                name="type"
                id="usertype"
                className="h-5 w-5 appearance-none rounded-full border-2 border-gray-300 checked:border-blue-400 checked:bg-blue-400 transition-colors duration-200 cursor-pointer"
                checked={isAdmin === true}
                value="true"
                onChange={handleOptionChange}
              />
              <label htmlFor="usertype" className="mr-3 ml-1">
                Admin
              </label>
              <input
                type="radio"
                name="type"
                id="usertype1"
                className="h-5 w-5 appearance-none rounded-full border-2 border-gray-300 checked:border-blue-400 checked:bg-blue-400 transition-colors duration-200 cursor-pointer"
                checked={isAdmin === false}
                value="false"
                onChange={handleOptionChange}
              />
              <label htmlFor="usertype1" className="ml-1 ">
                User
              </label>
            </div>
            <br />
            <button
              type="submit"
              className="rounded-full bg-yellow-400 hover:bg-yellow-500 transition md:w-80 w-72 my-4 py-2.5  font-bold"
            >
              Login
            </button>
          </div>
        </form>

        <div className="md:w-1/2 md:block hidden  md:h-full">
          <img src={cubic} alt="" className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default Login;
