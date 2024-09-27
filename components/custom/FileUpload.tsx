"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
  page: string;
}

const FileUpload = ({ value, onChange, endpoint, page }: FileUploadProps) => {
  return (
    <Card className="w-full max-w-[300px] bg-muted">
      <CardContent className="p-3">
        {value && (
          <div className="relative mb-4">
            {page === "Edit Course" && (
              <div className="relative aspect-video">
                <Image
                  src={value}
                  alt="Uploaded image"
                  fill
                  className="object-cover rounded-md"
                  loading="lazy"
                  placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
               
                />
              </div>
            )}
            {page === "Edit Section" && (
              <p className="text-sm font-medium break-all">{value}</p>
            )}
            <Button
              onClick={() => onChange("")}
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            onChange(res?.[0].url);
            toast.success("File uploaded successfully");
          }}
          onUploadError={(error: unknown) => { // Change type to unknown
            const errorMessage = (error instanceof Error) ? error.message : "Upload error"; // Check type
            toast.error(errorMessage);
          }}
          className="ut-button:bg-primary ut-button:hover:bg-primary/90 ut-button:ut-readying:bg-primary/80 ut-button:ut-uploading:bg-primary/80"
        />
      </CardContent>
    </Card>
  );
};

export default FileUpload;
