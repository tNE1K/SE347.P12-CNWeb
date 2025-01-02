"use client";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import * as React from "react";
import { useEffect, useState } from "react";
import { sendVerifyDocument } from "../api/teacher";
import { fetchUserInfo, updateInfo } from "../api/user";

interface BirthdatePickProps {
  disabled: boolean;
}

const InfoCard: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifySent, setIsVerifySent] = useState(false);
  const [open, setOpen] = useState(false);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    teacherVerifyRequest: false,
  });

  const BirthdatePick: React.FC<BirthdatePickProps> = ({ disabled }) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          disabled={disabled}
          value={userInfo.birthday ? dayjs(userInfo.birthday) : null}
          onChange={(newValue) =>
            setUserInfo((prevState) => ({
              ...prevState,
              birthday: newValue ? newValue.format("YYYY-MM-DD") : "", // Ensure it stays a string
            }))
          }
        />
      </LocalizationProvider>
    );
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCertificateFiles(Array.from(e.target.files));
    }
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIdFile(e.target.files[0]); // Only one file allowed
    }
  };

  const handleSubmit = async () => {
    if (!certificateFiles.length || !idFile) {
      alert("Please upload all required files.");
      return;
    }
    const formData = new FormData();
    certificateFiles.forEach((file, index) => {
      formData.append(`certificate_${index}`, file);
    });
    formData.append("id_img", idFile);
    await sendVerifyDocument(formData, handleClose);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await updateInfo(userInfo, userInfo.email);
      alert("User information updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user information:", error);
      alert("Failed to update user information.");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchUserInfo();
        setUserInfo(response);
        setIsVerifySent(response.teacherVerifyRequest);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <Card className="w-full shadow-lg rounded-lg overflow-hidden">
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-4">
          <Typography variant="h5" children={userInfo.firstName + " " +  userInfo.lastName} className="font-bold text-center">
          </Typography>
          <Avatar src="" className="flex"/>
        </div>
        <div className="flex flex-row gap-8 w-full">
          <div className="flex flex-col gap-2 w-1/2">
            <Typography variant="h5" component="div" className="font-semibold">
              First Name
            </Typography>
            <TextField
              disabled={!isEditing}
              id="first-name-textfield"
              value={userInfo.firstName}
              onChange={(e) =>
                setUserInfo({ ...userInfo, firstName: e.target.value })
              }
              variant="outlined"
              fullWidth
              className="bg-white"
            />
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <Typography variant="h5" component="div" className="font-semibold">
              Last Name
            </Typography>
            <TextField
              disabled={!isEditing}
              id="last-name-textfield"
              value={userInfo.lastName}
              onChange={(e) =>
                setUserInfo({ ...userInfo, lastName: e.target.value })
              }
              variant="outlined"
              fullWidth
              className="bg-white"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="h5" component="div" className="font-semibold">
            Email
          </Typography>
          <TextField
            disabled
            id="email-textfield"
            value={userInfo.email}
            variant="outlined"
            fullWidth
            className="bg-gray-100"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="h5" component="div" className="font-semibold">
            Birthday
          </Typography>
          <BirthdatePick disabled={!isEditing} />
        </div>
      </CardContent>
      <CardActions className="justify-between">
        <Button variant="contained" color="primary" onClick={handleOpen} disabled={isVerifySent}>
          Verify to be a Teacher
        </Button>
        {InputDialog()}
        {isEditing ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveClick}
            className="ml-auto"
          >
            Save
          </Button>
        ) : (
          <Button variant="outlined" color="secondary" onClick={handleEditClick}>
            Edit
          </Button>
        )}
      </CardActions>
    </Card>
  );

  function InputDialog() {
    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Upload Verification Documents</DialogTitle>
        <DialogContent>
          <TextField
            type="file"
            inputProps={{
              accept: "image/*",
              multiple: true,
            }}
            onChange={handleCertificateChange}
            fullWidth
            margin="dense"
            label="Certificates (Upload multiple images)"
            className="border border-gray-300"
          />
          <TextField
            type="file"
            inputProps={{
              accept: "image/*",
            }}
            onChange={handleIdChange}
            fullWidth
            margin="dense"
            label="ID Image (Upload only one)"
            className="border border-gray-300"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
};

export default InfoCard;