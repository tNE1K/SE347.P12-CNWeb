import { fetchAllTeacherRequest } from "@/app/api/admin";
import { Button, Dialog, DialogContent, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";

export default function TeacherRequestTable() {
  const handleAccept = async (id: string) => {
    console.log("Test:", id);
    try {
      const response = await axios.post(
        `${process.env.MY_API_URL}/admin/accept_teacher`,
        { _id: id },
        { withCredentials: true },
      );
      console.log("Accepted:", response.data);
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleDecline = async (id: string) => {
    console.log("Test:", id);
    try {
      const response = await axios.post(
        `${process.env.MY_API_URL}/admin/decline_teacher`,
        { _id: id },
        { withCredentials: true },
      );
      console.log("Declined:", response.data);
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "index", headerName: "Index", width: 100 },
    { field: "_id", headerName: "ID", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "image",
      headerName: "Images",
      width: 150,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "5px" }}>
          {params.row.verifyImage &&
            params.row.verifyImage.map((url: string, index: number) => (
              <img
                key={index}
                onClick={() => handleImageClick(url)}
                src={url}
                alt={`Verification ${index + 1}`}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            ))}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => {
              handleAccept(params.row._id);
            }}
          >
            Accept
          </Button>
          <Button
            onClick={() => {
              handleDecline(params.row._id);
            }}
          >
            Decline
          </Button>
        </div>
      ),
    },
  ];
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllTeacherRequest();
        const formattedData = data.data.map((user: any, index: number) => ({
          id: index + 1,
          index: index + 1,
          _id: user.id,
          email: user.email,
          role: user.role,
          verifyImage: user.verifyImage,
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

  const handleImageClick = (url: string) => {
    setCurrentImage(url);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentImage(null);
  };

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          {currentImage && (
            <img
              src={currentImage}
              alt="Full Image"
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
