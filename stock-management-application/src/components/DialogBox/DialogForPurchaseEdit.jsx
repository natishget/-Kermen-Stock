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

const DialogForPurchaseEdit = ({ PurchaseData }) => {
  const [editedPurchase, setEditedPurchase] = useState({
    PIID: PurchaseData?.PIID,
    PID: PurchaseData?.PID,
    Product_name: PurchaseData?.Product_name,
    Quantity: PurchaseData?.Quantity,
    Unit_Price: PurchaseData?.Unit_Price,
    Invoice: PurchaseData?.Invoice,
    Seller: PurchaseData?.Seller,
    Date: PurchaseData?.Date,
    Description: PurchaseData?.Description,
    Color: PurchaseData?.Color,
    isImported: PurchaseData?.isImported,
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    console.log("editedPurchase", editedPurchase);
  }, [editedPurchase]);

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

  const handleEditedPurchase = (e) => {
    const { name, value } = e.target;
    setEditedPurchase({ ...editedPurchase, [name]: value });
  };

  const handleOptionChange = (e) => {
    console.log("checkbox clicked");
    editedPurchase.isImported === 1
      ? setEditedPurchase({ ...editedPurchase, isImported: 0 })
      : setEditedPurchase({ ...editedPurchase, isImported: 1 });
  };

  const handleChange = (value) => {
    setEditedPurchase({ ...editedPurchase, PID: value });
    console.log(value + "\n" + editedPurchase);
  };

  const handleEditPurchase = async () => {
    try {
      if (
        editedPurchase.SID === "" ||
        editedPurchase.PID === "" ||
        editedPurchase.Color === "" ||
        editedPurchase.Seller === "" ||
        editedPurchase.Date === "" ||
        editedPurchase.Description === "" ||
        editedPurchase.isImported === "" ||
        editedPurchase.Quantity === "" ||
        editedPurchase.Unit_Price === ""
      ) {
        throw new Error("Every field on the form should be properly field");
      }
      const response = axios.post(
        `http://localhost:8800/api/purchase/editPurchase`,
        editedPurchase
      );
      alert("Purchase Edited");
    } catch (error) {
      alert(error.message);
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
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit purchase</DialogTitle>
          <DialogDescription>Make changes to your Purchase</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prod_name" className="text-right">
              Product Name:
            </Label>
            <Select onValueChange={(value) => handleChange(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={editedPurchase.Product_name} />
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
              value={editedPurchase.Quantity}
              id="Quantity"
              type="number"
              className="col-span-3"
              onChange={(e) => {
                handleEditedPurchase(e);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Date" className="text-right">
              Date:
            </Label>
            <Input
              name="Date"
              value={formatDate(editedPurchase.Date)}
              id="Date"
              type="date"
              className="col-span-3"
              onChange={(e) => {
                handleEditedPurchase(e);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Description:
            </Label>
            <Input
              name="Description"
              value={editedPurchase.Description}
              id="Description"
              className="col-span-3"
              onChange={(e) => {
                handleEditedPurchase(e);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Unit Price:
            </Label>
            <Input
              name="Unit_price"
              onChange={(e) => {
                handleEditedPurchase(e);
              }}
              value={editedPurchase?.Unit_Price}
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
              value={editedPurchase.Color}
              id="color"
              className="col-span-3"
              onChange={(e) => {
                handleEditedPurchase(e);
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
              checked={editedPurchase.isImported === 1}
              name="isImported"
              id="isImported"
              className=" border-white border rounded-2xl bg-mybg  w-11/12 "
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Seller" className="text-right">
              Seller:
            </Label>
            <Input
              name="Seller"
              value={editedPurchase.Seller}
              id="Seller"
              className="col-span-3"
              onChange={(e) => {
                handleEditedPurchase(e);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              handleEditPurchase();
            }}
            type="submit"
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForPurchaseEdit;
