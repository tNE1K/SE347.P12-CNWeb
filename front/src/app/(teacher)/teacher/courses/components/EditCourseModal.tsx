import { createCourse, updateCourse, uploadImage } from "@/app/api/course";
import { Theme, useTheme } from "@mui/material/styles";
import {
  Button,
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
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import { ICourse, UpdateCoursePayload } from "@/app/types/course";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { labels } from "@/app/utils/labels";
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

export function EditCourseModal({
  open,
  toggle,
  iniCourse,
}: {
  open: boolean;
  toggle: () => void;
  iniCourse: ICourse;
}) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: (newCourseData: UpdateCoursePayload) => {
      return updateCourse(newCourseData);
    },
    onSuccess: () => {
      toast.success("Update course successfully!");
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-detail"],
      });
    },
    onError: (error: any) => {
      toast.error(`Error: ${error?.message || "Something went wrong"}`);
    },
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const imgUrl = useRef<string>();
  const [error, setError] = useState("");
  const [nameCourse, setNameCourse] = useState("");
  const [label, setLabel] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);

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
    let imgSrc = "";
    if (selectedImage) {
      const res = await uploadImage(selectedImage);
      imgSrc = res?.file_url;
    }
    if (imgSrc) {
    }
    const payload: UpdateCoursePayload = {
      courseId: iniCourse._id,
      data: {
        title: nameCourse,
        description: description,
        label: label,
        cover: imgSrc || iniCourse.cover,
        status: "publish",
        price: price,
      },
    };

    mutate(payload);
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
  useEffect(() => {
    if (iniCourse) {
      setNameCourse(iniCourse.title);
      setDescription(iniCourse.description);
      setLabel(iniCourse.label);
      setPrice(iniCourse.price);
      imgUrl.current = iniCourse.cover;
    }
  }, []);
  return (
    <Dialog open={open} onClose={toggle} fullWidth maxWidth="md">
      <div className="flex items-center justify-between p-4">
        <Typography
          sx={{ ml: 2, flex: 1, justifyItems: "center" }}
          variant="h6"
          component="div"
          className="hidden sm:block"
        >
          Edit course
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
        <div className="flex flex-col">
          <p className="mb-[4px]">Description:</p>
          <ReactQuill
            theme="snow"
            value={description}
            className="h-[140px] pb-[50px]"
            onChange={setDescription}
          />
        </div>
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
