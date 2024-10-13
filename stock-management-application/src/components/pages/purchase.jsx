import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import { Box, IconButton } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";
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

const Purchase = () => {
  const [allPurchases, setAllPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editedSale, setEditedSale] = useState({
    PID: "",
    Quantity: "",
    Unit_price: 10,
    Customer_Name: "natnael",
    Date: "",
    Description: "",
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "Product_name", //access nested data with dot notation
        header: "Product Name",
        size: 110,
      },
      {
        accessorKey: "Quantity",
        header: "Quantity",
        size: 70,
      },
      {
        accessorKey: "Date", //normal accessorKey
        header: "Sales Date",
        size: 190,
        Cell: ({ cell }) => formatDate(cell.getValue()), // Format the date using the formatDate function
      },
      {
        accessorKey: "Description",
        header: "Description",
        size: 150,
      },
      {
        accessorKey: "Unit_Price",
        header: "Price",
        size: 70,
      },
      {
        accessorKey: "Seller",
        header: "Seller",
        size: 110,
      },
    ],
    []
  );

  const globalTheme = useTheme();

  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: globalTheme.palette.mode, //let's use the same dark/light mode as the global theme
          primary: globalTheme.palette.secondary, //swap in the secondary color as the primary for the table
          delete: globalTheme.palette.success,
          info: {
            main: "rgb(255,122,0)", //add in a custom color for the toolbar alert background stuff
          },
          background: {
            default:
              globalTheme.palette.mode === "light"
                ? "rgb(22,32,42,255)" //random light yellow color for the background in light mode
                : "#000", //pure black table in dark mode for fun
          },
          text: {
            primary: "#c0c2be",
          },
        },
        typography: {
          button: {
            textTransform: "none", //customize typography styles for all buttons in table by default
            fontSize: "1.2rem",
          },
        },
        components: {
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: "1.1rem", //override to make tooltip font size larger
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              thumb: {
                color: "pink", //change the color of the switch thumb in the columns show/hide menu to pink
              },
            },
          },
          MuiCheckbox: {
            styleOverrides: {
              root: {
                color: "#d9d4c5", // Custom color for checkboxes (unchecked state)
                "&.Mui-checked": {
                  color: "#1e88e5", // Custom color for checkboxes (checked state)
                },
              },
            },
          },
          MuiIcon: {
            styleOverrides: {
              root: {
                color: "#d9d4c5", // Custom color for icons
              },
            },
          },
          MuiSvgIcon: {
            styleOverrides: {
              root: {
                color: "#d9d4c5", // Custom color for icons like filter
              },
            },
          },
          MuiInputAdornment: {
            styleOverrides: {
              root: {
                color: "#000", // Custom color for search icon in input fields
              },
            },
          },
        },
      }),
    [globalTheme]
  );

  useEffect(() => {
    axios
      .get(`http://localhost:8800/api/purchase/allPurchase`)
      .then((res) => {
        console.log(res.data);
        if (res.data.msg != "") setAllPurchases(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("there is something wrong please trying again");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const formatDate = (dataTimeString) => {
    const date = new Date(dataTimeString);
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-full justify-center items-center px-6 py-4 font-medium text-2xl text-gray-500 whitespace-nowrap dark:text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="col-span-4 row-span-3 overflow-hidden no-scrollbar hover:overflow-y-scroll  relative overflow-x-auto">
      {/* <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mb-16">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Product name
            </th>
            <th scope="col" className="px-6 py-3">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3">
              Sales Date
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              unit Price
            </th>
            <th scope="col" className="px-6 py-3">
              Seller
            </th>
          </tr>
        </thead>
        <tbody>
          {allPurchases.length === 0 ? (
            <tr className="border-b  bg-mybg dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                No purchase were made
              </th>
            </tr>
          ) : (
            allPurchases.map((purchases, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {purchases.Product_name}
                </th>
                <td className="px-6 py-4">{purchases.Quantity}</td>
                <td className="px-6 py-4">{formatDate(purchases.Date)}</td>
                <td className="px-6 py-4">{purchases.Description}</td>
                <td className="px-6 py-4">{purchases.Unit_Price} Br</td>
                <td className="px-6 py-4">{purchases.Seller}</td>
              </tr>
            ))
          )}
        </tbody>
      </table> */}

      <ThemeProvider theme={tableTheme}>
        <MaterialReactTable
          columns={columns}
          data={allPurchases}
          enableColumnOrdering
          enableColumnPinning
          enableRowActions
          positionActionsColumn={`last`}
          renderRowActions={({ row, table }) => (
            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap",
                gap: "8px",
              }}
            >
              <IconButton
                sx={{ color: "#1e88e5" }}
                onClick={() => {
                  console.log(row.original);
                  setEditedSale({
                    PID: row.original.PID,
                    Quantity: row.original.Quantity,
                    Unit_price: row.original.Unit_price,
                    Customer_Name: row.original.Customer_Name,
                    Date: row.original.Date,
                    Description: row.original.Description,
                  });
                }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <EditIcon sx={{ color: "#2a9eb8" }} />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        youa&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prod_name" className="text-right">
                          Product Name:
                        </Label>
                        <select
                          name="PID"
                          id="prod_name"
                          value={editedSale.PID}
                          onChange={(e) => {
                            console.log(editedSale);
                            console.log(e.target.value);
                            setEditedSale({
                              ...editedSale,
                              PID: e.target.value,
                            });
                            console.log(editedSale);
                          }}
                          className=" col-span-3 py-2 px-1 border-[1px] border-slate-200 rounded-md"
                        >
                          <option value="1">Aluminium panel: 001</option>
                          <option value="2">Rail: 002</option>
                          <option value="0">Aluminium plate: 000</option>
                        </select>
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
                          value={editedSale.Date}
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
                      <Button
                        onClick={() => {
                          console.log(editedSale);
                        }}
                        type="submit"
                      >
                        Update
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </IconButton>
              <IconButton
                color="error"
                onClick={() => {
                  data.splice(row.index, 1); //assuming simple data table
                  setAllSales([...data]);
                }}
              >
                <DeleteIcon sx={{ color: "#d44c3d" }} />
              </IconButton>
            </Box>
          )}
        />
      </ThemeProvider>
    </div>
  );
};

export default Purchase;
