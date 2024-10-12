"use client";

import { Resource, Section } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { File, Loader2, PlusCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/custom/FileUpload";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required and must be at least 2 characters long",
  }),
  fileUrl: z.string().optional(),
  link: z.string().url("Must be a valid URL").optional(),
});

interface ResourceFormProps {
  section: Section & { resources: Resource[] };
  courseId: string;
}

const ResourceForm = ({ section, courseId }: ResourceFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      fileUrl: "",
      link: "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const resourceData = {
      name: values.name,
      fileUrl: values.fileUrl,
      link: values.link || values.fileUrl,
    };

    try {
      await axios.post(
        `/api/courses/${courseId}/sections/${section.id}/resources`,
        resourceData
      );
      toast.success("New Resource uploaded!");
      form.reset();
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong!");
      console.log("Failed to upload resource", err);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await axios.delete(
        `/api/courses/${courseId}/sections/${section.id}/resources/${id}`
      );
      toast.success("Resource deleted!");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong!");
      console.log("Failed to delete resource", err);
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center text-xl font-bold mt-12">
        <PlusCircle />
        Add Resources (optional)
      </div>

      <p className="text-sm font-medium mt-2">
        Add resources to this section to help students learn better.
      </p>

      <div className="mt-5 flex flex-col gap-5">
        {section.resources.map((resource) => (
          <div
            key={resource.id}
            className="flex justify-between bg-[#9aabbda1] rounded-lg text-sm font-medium p-3"
          >
            <div className="flex items-center">
              <File className="h-4 w-4 mr-4" />
              <a
                href={resource.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {resource.name}
              </a>
            </div>
            <button
              className="text-[#003285] text-white"
              disabled={isSubmitting}
              onClick={() => onDelete(resource.id)}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </button>
          </div>
        ))}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 my-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Textbook" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {}
            <div className="flex flex-col">
              <FormLabel>Resource Type</FormLabel>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="file"
                    name="resourceType"
                    onChange={() => {
                      form.setValue("fileUrl", "");
                      form.setValue("link", "");
                    }}
                    className="mr-2"
                    defaultChecked
                  />
                  Upload File
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="link"
                    name="resourceType"
                    onChange={() => {
                      form.setValue("fileUrl", "");
                      form.setValue("link", "");
                    }}
                    className="mr-2"
                  />
                  Add Link
                </label>
              </div>
            </div>

            {}
            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Upload File</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value || ""}
                      onChange={(url) => field.onChange(url)}
                      endpoint="sectionResource"
                      page="Edit Section"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Resource Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={
                !isValid ||
                isSubmitting ||
                (!form.getValues("fileUrl") && !form.getValues("link"))
              }
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Upload"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ResourceForm;
