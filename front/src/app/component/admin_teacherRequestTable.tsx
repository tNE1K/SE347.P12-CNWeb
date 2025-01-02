import { fetchAllTeacherRequest } from "@/app/api/admin";
import { Button, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from 'axios';
import { useEffect, useState } from "react";

const handleAccept = async (id: string) => {
  console.log("Test:", id);
  try {
    const response = await axios.post('http://127.0.0.1:5000/admin/accept_teacher', 
            { _id: id },  // Pass the correct property named "_id"
            { withCredentials: true }  // Move `withCredentials` here
    );
    console.log('Accepted:', response.data);
  } catch (error) {
    console.error('Error accepting request:', error);
  }
};


const handleDecline = async (id: string) => {
  console.log("Test:", id);
  try {
    const response = await axios.post('http://127.0.0.1:5000/admin/decline_teacher',
      { _id: id },  // Pass the correct property named "_id"
      { withCredentials: true }  // Move `withCredentials` here
    );

    console.log('Declined:', response.data);
  } catch (error) {
    console.error('Error accepting request:', error);
  }
};

const columns: GridColDef[] = [
  { field: "index", headerName: "Index", width: 200 },
  { field: "_id", headerName: "ID", width: 200 },
  { field: "email", headerName: "Email", width: 250 },
  { field: "role", headerName: "Role", width: 150 },
  {
    field: "actions",
    headerName: "Actions",
    width: 200,
    renderCell: (params) => (
      <div>
        <Button onClick={() => handleAccept(params.row._id)}>Accept</Button>
        <Button onClick={() => handleDecline(params.row._id)}>Decline</Button>
      </div>
    ),
  },
];

export default function TeacherRequestTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllTeacherRequest();
        const formattedData = data.data.map((user: any, index: number) => ({
          id: index + 1,
          index: index + 1,
          _id: user._id,
          email: user.email,
          role: user.role,
        }));
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
