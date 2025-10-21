import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit as EditIcon } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// enviroment varibale
const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const DialogForSalesEdit = ({ salesData }) => {
  const navigate = useNavigate();
  const [editedSale, setEditedSale] = useState({
    SID: salesData?.SID,
    PID: salesData?.PID,
    Product_name: salesData?.Product_name,
    Quantity: salesData?.Quantity,
    Unit_price: salesData?.Unit_price,
    Customer_Name: salesData?.Customer_Name,
    Date: salesData?.Date,
    Description: salesData?.Description,
    Color: salesData?.Color,
    isImported: salesData?.isImported,
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (
      sessionStorage.getItem("products") === null ||
      sessionStorage.getItem("products") === undefined
    ) {
      const fetchProducts = async () => {
        try {
          console.log("fetching again");
          const response = await axios.get(`${BackEndURL}/product/getProducts`);
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

  const handleEditedSale = (e) => {
    const { name, value } = e.target;
    setEditedSale({ ...editedSale, [name]: value });
  };

  const handleOptionChange = (e) => {
    editedSale.isImported === 1
      ? setEditedSale({ ...editedSale, isImported: 0 })
      : setEditedSale({ ...editedSale, isImported: 1 });
  };

  const handleChange = (value) => {
    setEditedSale({ ...editedSale, PID: value });
  };

  const handleEditSales = async () => {
    try {
      if (
        editedSale.SID === "" ||
        editedSale.PID === "" ||
        editedSale.Color === "" ||
        editedSale.Customer_Name === "" ||
        editedSale.Date === "" ||
        editedSale.Description === "" ||
        editedSale.isImported === "" ||
        editedSale.Quantity === "" ||
        editedSale.Unit_price === ""
      ) {
        throw new Error("Every field on the form should be properly field");
      }
      const response = await axios.post(
        `${BackEndURL}/sales/updateSales`,
        editedSale
      );
      sessionStorage.removeItem("sales");
      navigate(0);
    } catch (error) {
      alert(error.message);
      console.clear();
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <EditIcon sx={{ color: "#2a9eb8" }} />

        {/* Using a Button as the trigger for clarity */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prod_name" className="text-right">
              Product Name:
            </Label>

            <Select onValueChange={(value) => handleChange(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={editedSale.Product_name} />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem value={product.PID}>
                    {product.Product_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Quantity" className="text-right">
              Quantity:
            </Label>
            <Input
              name="Quantity"
              value={editedSale.Quantity}
              id="Quantity"
              type="number"
              className="col-span-3"
              onChange={(e) => {
                handleEditedSale(e);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Date" className="text-right">
              Date:
            </Label>
            <Input
              name="Date"
              value={formatDate(editedSale.Date)}
              id="Date"
              type="date"
              className="col-span-3"
              onChange={(e) => {
                handleEditedSale(e);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Description:
            </Label>
            <Input
              name="Description"
              value={editedSale.Description}
              id="Description"
              className="col-span-3"
              onChange={(e) => {
                handleEditedSale(e);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Price:
            </Label>
            <Input
              name="Unit_price"
              onChange={(e) => {
                handleEditedSale(e);
              }}
              value={editedSale.Unit_price}
              id="username"
              type="number"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Color:
            </Label>
            <Input
              name="Color"
              value={editedSale.Color}
              id="color"
              className="col-span-3"
              onChange={(e) => {
                handleEditedSale(e);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Customer_Name" className="text-right">
              Imported:
            </Label>
            <input
              type="radio"
              onClick={handleOptionChange}
              checked={editedSale.isImported === 1}
              name="isImported"
              id="isImported"
              className=" border-white border rounded-2xl bg-mybg  w-11/12 "
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Customer_Name" className="text-right">
              Customer:
            </Label>
            <Input
              name="Customer_Name"
              value={editedSale.Customer_Name}
              id="Customer_Name"
              className="col-span-3"
              onChange={(e) => {
                handleEditedSale(e);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleEditSales} type="submit">
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForSalesEdit;
