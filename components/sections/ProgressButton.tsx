"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

interface ProgressButtonProps {
  courseId: string;
  sectionId: string;
  isCompleted: boolean;
  onClick?: () => void; // Optional onClick handler
}

const ProgressButton = ({
  courseId,
  sectionId,
  isCompleted,
}: ProgressButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [completionStatus, setCompletionStatus] = useState(isCompleted);

  const handleProgress = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`/api/courses/${courseId}/sections/${sectionId}/progress`, {
        isCompleted: !completionStatus,
      });
      console.log("Progress update response:", response.data);
      setCompletionStatus(!completionStatus);
      toast.success(completionStatus ? "Progress reset!" : "Progress updated!");
      router.refresh();
    } catch (err) {
      console.error("Failed to update progress", err);
      if (axios.isAxiosError(err)) {
        console.error("Error response:", err.response?.data);
        toast.error(`Failed to update progress: ${err.response?.data || err.message}`);
      } else {
        toast.error("Failed to update progress. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [courseId, sectionId, completionStatus, router]);

  return (
    <Button
      variant={completionStatus ? "complete" : "default"}
      onClick={handleProgress}
      disabled={isLoading}
      className="transition-all duration-300 ease-in-out"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : completionStatus ? (
        <div className="flex items-center dark:bg ">
          <CheckCircle className="h-4 w-4 mr-2 dark:text-white" />
          <span className="dark:text-white">Completed</span>
        </div>
      ) : (
        "Mark as complete"
      )}
    </Button>
  );
};

export default ProgressButton;