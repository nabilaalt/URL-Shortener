/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "./ui/card";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Error from "./error";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { updateUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import { QRCode } from "react-qrcode-logo";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";

export function EditLink({ url }) {
  const ref = useRef();
  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: "",
    customUrl: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(!!longLink);
  const navigate = useNavigate();

  useEffect(() => {
    if (url) {
      setFormValues({
        title: url.title,
        longUrl: url.originalUrl,
        customUrl: url.customUrl,
      });
    }
  }, [url]);

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    fn: fnEditUrl,
    data,
  } = useFetch(updateUrl, {
    title: formValues.title,
    longUrl: formValues.longUrl,
    customUrl: formValues.customUrl,
    userId: url?.userId, 
    shortUrl: url?.shortUrl, 
    linkId : url?._id
  });

  const editLink = async () => {
    setErrors({});
    try {
      await schema.validate(formValues, { abortEarly: false });

      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));
      
      // We don't need to pass formValues here since they're already in the options
      await fnEditUrl(blob);
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  useEffect(() => {
    if (error === null && data && !loading) {
      toast.success("URL updated successfully!"); // Changed message to reflect update
      setIsDialogOpen(false);
    setTimeout(() => {
      navigate(0);
    }, 3000);
    }
  }, [error, loading, data, navigate]);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(res) => {
        setIsDialogOpen(res);
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-rose-500 text-white hover:border-rose-500 hover:bg-rose-500"
        >
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Edit Link</DialogTitle>
        </DialogHeader>
        {formValues?.longUrl && (
          <QRCode ref={ref} size={250} value={formValues?.longUrl} />
        )}

        <Input
          id="title"
          placeholder="Short Link's Title"
          value={formValues.title}
          onChange={handleChange}
          disabled
        />
        {errors.title && <Error message={errors.title} />}
        <Input
          id="longUrl"
          placeholder="Enter your Long URL"
          value={formValues.longUrl}
          onChange={handleChange}
        />
        {errors.longUrl && <Error message={errors.longUrl} />}
        <div className="flex items-center gap-2">
          <Card className="p-2">ss.shortif.com</Card> /
          <Input
            id="customUrl"
            placeholder="Custom Link (optional)"
            value={formValues.customUrl}
            onChange={handleChange}
            disabled
          />
        </div>
        {error && <Error message={error.message} />}
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="destructive"
            onClick={editLink}
            disabled={loading}
          >
            {loading ? <BeatLoader size={10} color="white" /> : "Edit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}