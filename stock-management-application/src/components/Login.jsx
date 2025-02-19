import React, { useState, useEffect } from "react";
import cubic from "../assets/cubic1.jpg";
import axios from "axios"; // Import axios
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  // axios credentials
  axios.defaults.withCredentials = true;

  // enviroment variable
  const BackEndURL = process.env.VITE_BACKEND_URL;

  // protected Route
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BackEndURL}/auth/protectedRoute`, {
          withCredentials: true,
        });
        navigate("/pages/");
      } catch (error) {
        console.clear();
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const handleOptionChange = (e) => {
    setIsAdmin(e.target.value === "true");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAdmin === null) {
      alert("Please choose user type");
    } else {
      axios
        .post(`${BackEndURL}/auth/login`, {
          username,
          password,
          isAdmin,
        })
        .then((res) => {
          const userData = res.data;
          console.log("userData", userData);

          navigate("/pages");
        })
        .catch((err) => {
          console.log(err);
          alert("Login Failed, check your credentials and try again.");
        });
    }
  };

  return (
    <div className="w-full h-screen bg-mycolor">
      <div className="md:flex sm:flex-row h-full md:p-10 p-5">
        <form
          onSubmit={handleSubmit}
          className="md:w-1/2 sm:w-full h-full  bg-mybg text-white flex justify-center items-center"
        >
          <div className="mx-5">
            <h1 className="md:text-4xl text-2xl">Welcome!</h1>
            <h1 className="md:text-4xl text-3xl font-bold">Login</h1>
            <p className="text-xs pt-3 pb-7">
              Manage your stock properly and grow your profit
            </p>
            <label htmlFor="username" className="text-xs pt-28">
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
              className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-full bg-mybg p-1 md:w-80 w-72"
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
              className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs border-white border rounded-full bg-mybg p-1 md:w-80 w-72"
            />
            <br />

            <div className="mt-3">
              <input
                type="radio"
                name="type"
                id="usertype"
                className="bg-mybg opacity-35"
                checked={isAdmin === true}
                value="true"
                onChange={handleOptionChange}
              />
              <label htmlFor="usertype" className="mr-3 ml-1 text-xs">
                Admin
              </label>
              <input
                type="radio"
                name="type"
                id="usertype1"
                className="bg-mybg opacity-35"
                checked={isAdmin === false}
                value="false"
                onChange={handleOptionChange}
              />
              <label htmlFor="usertype1" className="ml-1 text-xs">
                User
              </label>
            </div>
            <br />
            <button
              type="submit"
              className="rounded-full bg-mybtn md:w-80 w-72 my-4 py-2.5 text-xs font-bold"
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
