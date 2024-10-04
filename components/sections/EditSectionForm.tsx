"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MuxData, Resource, Section } from "@prisma/client";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Trash } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RichEditor from "@/components/custom/RichEditor";
import FileUpload from "../custom/FileUpload";
import { Switch } from "@/components/ui/switch";
import ResourceForm from "@/components/sections/ResourceForm";
import Delete from "@/components/custom/Delete";
import PublishButton from "@/components/custom/PublishButton";
import { useState } from "react";
import { addQuestionToSection } from "@/app/actions";
import MCQForm from "./MCQForm";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required and must be at least 2 characters long",
  }),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  isFree: z.boolean().optional(),
});

interface EditSectionFormProps {
  section: Section & { resources: Resource[]; muxData?: MuxData | null };
  courseId: string;
  isCompleted: boolean;
}

const EditSectionForm = ({
  section,
  courseId,
  isCompleted,
}: EditSectionFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: section.title,
      description: section.description || "",
      videoUrl: section.videoUrl || "",
      isFree: section.isFree,
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.title === "" && values.description === "") return;
    try {
      await axios.post(
        `/api/courses/${courseId}/sections/${section.id}`,
        values
      );
      toast.success("Section Updated");
      router.refresh();
    } catch (err) {
      console.log("Failed to update the section", err);
      toast.error("Something went wrong!");
    }
  };

  const [question, setQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    answer: "",
  });

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("question", question.text);
    formData.append("answer", question.answer);
    question.options.forEach((option, index) => {
      formData.append(`option${index + 1}`, option);
    });

    try {
      const response = await addQuestionToSection(formData, section.id);
      console.log("Response from adding question:", response);
      toast.success("Question added successfully");
      setQuestion({ text: "", options: ["", "", "", ""], answer: "" });
    } catch (err) {
      console.error("Failed to add question", err);
      const errorMessage =
        (err as any).response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  const [editorLanguage, setEditorLanguage] = useState<"en" | "ar">("en");

  const switchLanguage = () => {
    setEditorLanguage((prev) => (prev === "en" ? "ar" : "ar"));
  };

  return (
    <div className=" w-full mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between mb-8">
        <Link href={`/instructor/courses/${courseId}/sections`}>
          <Button variant="ghost" className="text-sm font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Weeks
          </Button>
        </Link>

        <div className="flex gap-3 items-center">
          {}
          <Delete item="section" courseId={courseId} sectionId={section.id} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2 dark:text-white">
          Section Details
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Complete this section with detailed information, good resources to
          give students the best learning experience
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Introduction to Web Development"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="flex items-center space-x-2 mb-2">
                    {/* <Switch
                      checked={editorLanguage === "ar"}
                      onCheckedChange={() =>
                        setEditorLanguage(editorLanguage === "en" ? "ar" : "en")
                      }
                    />
                    <Label htmlFor="language-switch">
                      {editorLanguage === "en"
                        ? "Switch to Arabic"
                        : "Switch to English"}
                    </Label> */}
                  </div>
                  <FormControl>
                    <RichEditor
                      placeholder="What is this section about?"
                      value={field.value}
                      language={editorLanguage as "en" | "ar"}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {section.videoUrl && (
              <div className="my-6">
                <h2 className="text-lg font-semibold mb-2 dark:text-white">
                  Preview Video
                </h2>
                <MuxPlayer
                  playbackId={section.muxData?.playbackId || ""}
                  className="w-full aspect-video rounded-lg shadow-sm"
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Accessibility</FormLabel>
                    <FormDescription>
                      Everyone can access this section for FREE
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end mt-8">
              <Link href={`/instructor/courses/${courseId}/sections`}>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <ResourceForm section={section} courseId={courseId} />
      </div>

      {}
      <MCQForm sectionId={section.id} />
    </div>
  );
};

export default EditSectionForm;
