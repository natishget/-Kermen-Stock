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
import DialogForPurchaseEdit from "../DialogBox/DialogForPurchaseEdit";

const BackEndURL = import.meta.env.VITE_BACKEND_URL;

const Purchase = () => {
  const navigate = useNavigate();
  const [allPurchases, setAllPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0); // zero-based for MRT
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const serverPage = page + 1;
      const limit = rowsPerPage;
      const response = await axios.get(`${BackEndURL}/purchase/allPurchase`, {
        params: { page: serverPage, limit },
        withCredentials: true,
      });
      setAllPurchases(response.data.data);
      setTotalCount(response.data.pagination.totalCount);
    } catch (error) {
      console.error("Error fetching purchase data:", error);
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
      { accessorKey: "Product_name", header: "Product Name", size: 140 },
      { accessorKey: "Quantity", header: "Quantity", size: 90 },
      {
        accessorKey: "Date",
        header: "Sales Date",
        size: 140,
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      { accessorKey: "Unit_Price", header: "Unit Price", size: 110 },
      { accessorKey: "Total_Price", header: "Total Price", size: 120 },
      { accessorKey: "Color", header: "Color", size: 100 },
      {
        accessorKey: "isImported",
        header: "Imported",
        size: 100,
        Cell: ({ cell }) => (cell.getValue() === 1 ? "YES" : "NO"),
      },
      { accessorKey: "Seller", header: "Seller", size: 120 },
      { accessorKey: "Description", header: "Description", size: 200 },
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
                ? "rgba(255,255,255,1)"
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

  const handleDeletePurchases = async (PID) => {
    try {
      await axios.post(`${BackEndURL}/purchase/deletePurchase`, { PID });
      fetchData();
    } catch (error) {
      console.error(
        "Error deleting purchase:",
        error.response?.data?.message || error.message
      );
    }
  };

  const tableInstance = useMaterialReactTable({
    columns,
    data: allPurchases,
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
        <DialogForPurchaseEdit PurchaseData={row.original} />
        <IconButton
          color="error"
          onClick={() => handleDeletePurchases(row.original.PID)}
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

  if (isLoading && allPurchases.length === 0) {
    return (
      <div className="flex w-full h-full justify-center items-center px-6 py-4 font-medium text-2xl text-gray-500 whitespace-nowrap dark:text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="m-5">
      <h1 className="text-gray-600 font-bold text-4xl">
        <span className="text-yellow-500">Purchase</span> Table
      </h1>
      <p className="text-gray-500 text-base mt-2 mb-4">
        Total Purchase Records Found:{" "}
        <span className="font-semibold text-yellow-600 text-base">
          {totalCount}
        </span>
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

export default Purchase;
