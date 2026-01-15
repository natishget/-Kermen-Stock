import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  createTheme,
  ThemeProvider,
  useTheme,
  Box,
  IconButton,
  Paper,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DialogForSalesEdit from "../DialogBox/DialogForSalesEdit";

const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const Sales = () => {
  const navigate = useNavigate();
  const [allSales, setAllSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0); // MRT uses 0-based pageIndex
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const serverPage = page + 1;
      const limit = rowsPerPage;
      const response = await axios.get(`${BackEndURL}/sales/allSales`, {
        params: { page: serverPage, limit },
        withCredentials: true,
      });
      setAllSales(response.data.data);
      setTotalCount(response.data.pagination.totalCount);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, BackEndURL]);

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    return date.toLocaleDateString();
  };

  const columns = useMemo(
    () => [
      { accessorKey: "Product_name", header: "Product Name", size: 110 },
      { accessorKey: "Quantity", header: "Quantity", size: 70 },
      {
        accessorKey: "Date",
        header: "Sales Date",
        size: 190,
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      { accessorKey: "Description", header: "Description", size: 150 },
      { accessorKey: "Unit_price", header: "Unit Price", size: 70 },
      { accessorKey: "Total_Price", header: "Total Price", size: 70 },
      { accessorKey: "Customer_Name", header: "Customer", size: 110 },
      { accessorKey: "Color", header: "Color", size: 70 },
      {
        accessorKey: "isImported",
        header: "Imported",
        size: 70,
        Cell: ({ cell }) => (cell.getValue() === 1 ? "YES" : "NO"),
      },
    ],
    []
  );

  const globalTheme = useTheme();
  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: globalTheme.palette.mode,
          primary: globalTheme.palette.secondary,
          delete: globalTheme.palette.success,
          info: { main: "rgb(255,122,0)" },
          background: {
            default:
              globalTheme.palette.mode === "light"
                ? "rgba(255,255, 255,1)"
                : "#000",
          },
          text: { primary: "#3b3b3bff" },
        },
        typography: {
          button: { textTransform: "none", fontSize: "1rem" },
        },
      }),
    [globalTheme]
  );

  const handleDeleteSales = async (SID) => {
    try {
      await axios.post(`${BackEndURL}/sales/deleteSales`, { SID });
      fetchData();
    } catch (error) {
      console.error(
        "Error deleting sales:",
        error.response?.data?.message || error.message
      );
    }
  };

  const tableInstance = useMaterialReactTable({
    columns,
    data: allSales,
    enableColumnOrdering: true,
    enableColumnPinning: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    enablePagination: true,
    manualPagination: true,
    rowCount: totalCount,
    state: {
      isLoading,
      pagination: { pageIndex: page, pageSize: rowsPerPage },
    },
    onPaginationChange: ({ pageIndex, pageSize }) => {
      setPage(pageIndex);
      setRowsPerPage(pageSize);
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
        <DialogForSalesEdit salesData={row.original} onUpdate={fetchData} />
        <IconButton
          color="error"
          onClick={() => handleDeleteSales(row.original.SID)}
        >
          <DeleteIcon sx={{ color: "#d44c3d" }} />
        </IconButton>
      </Box>
    ),
    initialState: {
      density: "comfortable",
      showColumnFilters: true,
      showGlobalFilter: true,
    },
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 25, 50],
    },
  });

  if (isLoading && allSales.length === 0) {
    return (
      <div className="flex w-full h-full justify-center items-center px-6 py-4 font-medium text-2xl text-gray-500 whitespace-nowrap dark:text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="m-5">
      <h1 className="text-gray-600 font-bold text-4xl">
        <span className="text-blue-500">Sales</span> Table
      </h1>
      <p className="text-gray-500 text-sm mt-2 mb-4">
        Total Sales Records Found:{" "}
        <span className="font-semibold text-blue-600">{totalCount}</span>
      </p>
      <div className="bg-black">
        <ThemeProvider theme={tableTheme}>
          <Paper>
            <MaterialReactTable table={tableInstance} />
          </Paper>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default Sales;
