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
import { Button } from "@/components/ui/button";
import axios from "axios";

// enviroment variable
const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const DialogForAddProduct = () => {
  //axios credentials
  axios.defaults.withCredentials = true;
  // protected Route
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    unit_of_measurment: "",
    description: "",
  });

  useEffect(() => {
    console.log("newProduct", newProduct);
  }, [newProduct]);

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleNewProduct = async () => {
    try {
      console.log("adding");
      const response = await axios.post(
        `${BackEndURL}/product/newProduct`,
        newProduct
      );
      console.log("response", response);
      sessionStorage.removeItem("products");
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-myblue text-gray-600 border border-gray-600 hover:text-white hover:bg-gray-800 text-lg px-4 py-2 mr-3">
          Add Product
        </Button>

        {/* Using a Button as the trigger for clarity */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Adding new Product</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product_name" className="text-right">
              Product Name:
            </Label>
            <Input
              name="product_name"
              value={newProduct.Quantity}
              id="product_name"
              type="text"
              className="col-span-3"
              onChange={(e) => {
                handleNewProductChange(e);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit_of_measurment" className="text-right">
              Unit of measurment:
            </Label>
            <Input
              name="unit_of_measurment"
              value={newProduct.unit_of_measurment}
              id="unit_of_measurment"
              type="text"
              className="col-span-3"
              onChange={(e) => {
                handleNewProductChange(e);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Date" className="text-right">
              Description:
            </Label>
            <Input
              name="description"
              value={newProduct.description}
              id="description"
              type="text"
              className="col-span-3"
              onChange={(e) => {
                handleNewProductChange(e);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleNewProduct} type="submit">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForAddProduct;
