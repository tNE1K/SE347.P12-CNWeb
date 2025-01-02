/* eslint-disable @next/next/no-img-element */
"use client";

import { createCourse, uploadImage } from "@/app/api/course";
import { useAuth } from "@/app/component/authProvider";
import { UpdateCoursePayload } from "@/app/types/course";
import AddIcon from "@mui/icons-material/Add";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import { Theme, useTheme } from "@mui/material/styles";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
// import { labels } from "~/constant/labels";
// import routePath from "~/constant/routePath";
// import { generatePathname } from "~/helper/generatePathname";
// import useCreateCourse from "~/hooks/course/useCreateCourse";
// import { useUploadImage } from "~/hooks/useUploadFile";

const labels = ["C#", "Javascript", "Java", "C++", "Python"];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const AddCourseButton = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((p) => !p);
  };

  return (
    <>
      <Button onClick={toggle} variant="contained" startIcon={<AddIcon />}>
        Add Course
      </Button>

      <CustomDialog open={open} toggle={toggle} />
    </>
  );
};

export default AddCourseButton;

function CustomDialog({ open, toggle }: { open: boolean; toggle: () => void }) {
  const theme = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (newCourseData: FormData) => {
      return createCourse(newCourseData);
    },
    onSuccess: () => {
      toast.success("Course created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
    onError: (error: any) => {
      toast.error(`Error: ${error?.message || "Something went wrong"}`);
    },
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { user } = useAuth();
  const imgUrl = useRef<string>();
  const [error, setError] = useState("");
  const [nameCourse, setNameCourse] = useState("");
  const [price, setPrice] = useState(0);
  const [label, setLabel] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const file = files[0];
      setSelectedImage(file);
      imgUrl.current = URL.createObjectURL(file);
    }
  };

  const handleSaveInformation = async () => {
    if (nameCourse === "") {
      setError("Please enter name course");
      return;
    }
    if (!user?.id) return;
    let imgSrc = "";
    if (selectedImage) {
      const res = await uploadImage(selectedImage);
      imgSrc = res?.file_url;
    }
    if (imgSrc) {
    }
    const formData = new FormData();
    formData.append("title", nameCourse);
    formData.append("description", description);
    formData.append("cover", imgSrc);
    formData.append("price", price.toString());
    formData.append("label", JSON.stringify(label));
    formData.append("status", "publish");
    formData.append("teacher_id", user.id);
    mutate(formData);
    toggle();
  };

  const handleChange = (event: SelectChangeEvent<typeof label>) => {
    const {
      target: { value },
    } = event;
    setLabel(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  return (
    <Dialog open={open} onClose={toggle} fullWidth maxWidth="md">
      <div className="flex items-center justify-between p-4">
        <Typography
          sx={{ ml: 2, flex: 1, justifyItems: "center" }}
          variant="h6"
          component="div"
          className="hidden sm:block"
        >
          Create course description
        </Typography>
        <IconButton
          edge="start"
          color="inherit"
          onClick={toggle}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className="flex flex-col space-y-4 p-7">
        <div className="flex flex-col">
          <TextField
            label="Course title"
            name="title"
            value={nameCourse}
            onChange={(e) => {
              setNameCourse(e.target.value);
              setError("");
            }}
            required
            error={error !== ""}
          />
          {error !== "" && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <TextField
          label="Course description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
        />
        <TextField
          label="Price"
          name="price"
          value={price}
          type="number"
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <FormControl sx={{ width: 300 }}>
          <InputLabel id="demo-multiple-name-label">
            Add labels Course
          </InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={label}
            onChange={handleChange}
            input={<OutlinedInput label="Add labels Course" />}
            MenuProps={MenuProps}
          >
            {labels.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, labels, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="relative mx-auto w-fit rounded-2xl">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <img
            src={
              imgUrl.current ||
              "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
            }
            alt="Uploaded"
            className="aspect-[1.67] h-[240px]"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 opacity-0 transition-opacity hover:opacity-100">
            <IconButton
              className="!text-white"
              onClick={() => fileInputRef.current?.click()}
            >
              <AddAPhotoIcon color="inherit" />
            </IconButton>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="contained"
            autoFocus
            onClick={handleSaveInformation}
            className=""
          >
            Save
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
