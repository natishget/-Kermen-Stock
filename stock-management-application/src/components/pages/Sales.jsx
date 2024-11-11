import React, { useState, useEffect, useMemo } from "react";
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

const data = [
  {
    name: {
      firstName: "John",
      lastName: "Doe",
    },
    address: "261 Erdman Ford",
    city: "East Daphne",
    state: "Kentucky",
  },
  {
    name: {
      firstName: "Jane",
      lastName: "Doe",
    },
    address: "769 Dominic Grove",
    city: "Columbus",
    state: "Ohio",
  },
  {
    name: {
      firstName: "Joe",
      lastName: "Doe",
    },
    address: "566 Brakus Inlet",
    city: "South Linda",
    state: "West Virginia",
  },
  {
    name: {
      firstName: "Kevin",
      lastName: "Vandy",
    },
    address: "722 Emie Stream",
    city: "Lincoln",
    state: "Nebraska",
  },
  {
    name: {
      firstName: "Joshua",
      lastName: "Rolluffs",
    },
    address: "32188 Larkin Turnpike",
    city: "Charleston",
    state: "South Carolina",
  },
];

const Sales = () => {
  const [allSales, setAllSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editedSale, setEditedSale] = useState({
    PID: "",
    Quantity: "",
    Unit_price: 10,
    Customer_Name: "natnael",
    Date: "",
    Description: "",
    Color: "",
    isImported: "",
  });
  const [edit, setEdit] = useState({ dere: "43" });
  const [userId, setUserId] = useState(); // This state is not used, so you might consider removing it if it's unnecessary.

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
        accessorKey: "Unit_price",
        header: "Price",
        size: 70,
      },
      {
        accessorKey: "Customer_Name",
        header: "Customer",
        size: 110,
      },
      {
        accessorKey: "Color",
        header: "Color",
        size: 70,
      },
      {
        accessorKey: "isImported",
        header: "Imported",
        size: 70,
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
      .get(`http://localhost:8800/api/sales/allSales`)
      .then((res) => {
        setAllSales(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response.data.msg);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleEditedSale = (e) => {
    const { name, value } = e.target;
    setEditedSale({ ...editedSale, [name]: value });
    console.log(name + value);
  };

  const handleChange = (e) => {
    setEdit({ ...edit, [e.target.name]: e.target.value });
    console.log(e.target.name + e.target.value + "\n" + edit);
  };

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
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
    <>
      <div className="col-span-4 row-span-3 relative overflow-x-auto overflow-hidden no-scrollbar hover:overflow-y-scroll">
        {/* <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mb-16">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product Name
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
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Customer
              </th>
            </tr>
          </thead>
          <tbody>
            {allSales.length === 0 ? (
              <tr className="border-b bg-mybg dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  No sales were made
                </th>
              </tr>
            ) : (
              allSales.map((sale, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {sale.Product_name}
                  </th>
                  <td className="px-6 py-4">{sale.Quantity}</td>
                  <td className="px-6 py-4">{formatDate(sale.Date)}</td>
                  <td className="px-6 py-4">{sale.Description}</td>
                  <td className="px-6 py-4">{sale.Unit_price} Br</td>
                  <td className="px-6 py-4">{sale.Customer_Name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table> */}
        <div className="bg-black">
          <ThemeProvider theme={tableTheme}>
            <MaterialReactTable
              columns={columns}
              data={allSales}
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
                        Color: row.original.Color,
                        isImported: row.original.isImported,
                      });
                    }}
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <EditIcon sx={{ color: "#2a9eb8" }} />

                        {/* Using a Button as the trigger for clarity */}
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit profile</DialogTitle>
                          <DialogDescription>
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="prod_name" className="text-right">
                              Product Name:
                            </Label>
                            <select
                              name="dere"
                              id="prod_name"
                              onChange={handleChange}
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
                            <Label
                              htmlFor="Customer_Name"
                              className="text-right"
                            >
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
      </div>
    </>
  );
};

export default Sales;
