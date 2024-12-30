"use client";
import { Box, Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import * as React from "react";
import { useState } from "react";
import { sendVerifyDocument } from "../api/teacher";
interface BirthdatePickProps {
  disabled: boolean;
}

const BirthdatePick: React.FC<BirthdatePickProps> = ({ disabled }) => {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        disabled={disabled}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </LocalizationProvider>
  );
};

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
  </Box>
);

export default function InfoCard() {
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [open, setOpen] = useState(false);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [idFile, setIdFile] = useState<File | null>(null);

  // Open/close dialog handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle certificate files
  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCertificateFiles(Array.from(e.target.files));
    }
  };

  // Handle ID file
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIdFile(e.target.files[0]); // Only one file allowed
    }
  };

  // Submit files to API
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
    setIsEditing(true); // Enable edit mode
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Add logic to save data here
  };

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent className="flex flex-col gap-4">
        <Typography variant="h3">Your information</Typography>
        <div className={"flex flex-row gap-8 w-full"}>
          <div className={"flex flex-col gap-2 w-1/2"}>
            <Typography variant="h5" component="div">
              First name
            </Typography>
            <TextField
              disabled={!isEditing}
              id="first-name-textfield"
              defaultValue="Jane"
            />
          </div>
          <div className={"flex flex-col gap-2 w-1/2"}>
            <Typography variant="h5" component="div">
              Last name
            </Typography>
            <TextField
              disabled={!isEditing}
              id="last-name-textfield"
              defaultValue="Doe"
            />
          </div>
        </div>
        <div className={"flex flex-col gap-2"}>
          <Typography variant="h5" component="div">
            Email
          </Typography>
          <TextField
            disabled={!isEditing}
            id="email-textfield"
            defaultValue="jane.doe@example.com"
          />
        </div>
        <div className={"flex flex-col gap-2"}>
          <Typography variant="h5" component="div">
            Birthday
          </Typography>
          <BirthdatePick disabled={!isEditing} />
        </div>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Verify to be a teacher
        </Button>
        {InputDialog()}
        {isEditing ? (
          <Button variant="contained" color="primary" onClick={handleSaveClick}>
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
    return <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Upload Verification Documents</DialogTitle>
      <DialogContent>
        <TextField
          type="file"
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { accept: "image", multiple: true }
          }}
          onChange={handleCertificateChange}
          fullWidth
          margin="dense"
          label="Certificates (Upload multiple images)" />
        <TextField
          type="file"
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { accept: "image" }
          }}
          onChange={handleIdChange}
          fullWidth
          margin="dense"
          label="ID Image (Upload only one)" />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>;
  }
}