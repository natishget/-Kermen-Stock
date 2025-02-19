import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit as EditIcon } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import axios from "axios";

// enviroment variable
const BackEndURL = process.env.VITE_BACKEND_URL;

const DialogForAddUser = () => {
  //axios credentials
  axios.defaults.withCredentials = true;
  // protected Route
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    isAdmin: false,
    adminPass: "",
  });

  useEffect(() => {
    console.log("newUser", newUser);
  }, [newUser]);

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleOptionChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value === "true" });
  };

  const handleNewUser = async () => {
    if (
      newUser.isAdmin === "" ||
      newUser.adminPass === "" ||
      newUser.username === "" ||
      newUser.password === ""
    ) {
      alert("Please fill all the fields");
    } else {
      try {
        const response = await axios.post(
          `${BackEndURL}/auth/createUser`,
          newUser
        );
        console.log("response", response);
        alert(response.data.message);
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
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
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-myblue text-white border border-white px-4 py-2 mr-3">
          Add User
        </Button>

        {/* Using a Button as the trigger for clarity */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>Registering a New User</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username:
            </Label>
            <Input
              name="username"
              value={newUser.username}
              id="username"
              type="text"
              className="col-span-3"
              onChange={(e) => {
                handleNewUserChange(e);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password:
            </Label>
            <Input
              name="password"
              value={newUser.password}
              id="password"
              type="password"
              className="col-span-3"
              onChange={(e) => {
                handleNewUserChange(e);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isAdmin" className="text-right">
              Admin:
            </Label>
            <Input
              name="isAdmin"
              id="isAdmin"
              type="radio"
              checked={newUser.isAdmin === true}
              value="true"
              className="w-4 h-4"
              onChange={handleOptionChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="adminPass" className="text-right">
              Register Password:
            </Label>
            <Input
              name="adminPass"
              value={newUser.adminPass}
              id="adminPass"
              type="password"
              className="col-span-3"
              onChange={(e) => {
                handleNewUserChange(e);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleNewUser} type="submit">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForAddUser;
