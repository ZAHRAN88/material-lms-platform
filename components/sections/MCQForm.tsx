"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addQuestionToSection } from "@/app/actions";
import toast from "react-hot-toast";
import { Input } from "../ui/input";

const MCQForm: React.FC<{ sectionId: string }> = ({ sectionId }) => {
  const [question, setQuestion] = useState({ text: "", options: ["", "", "", ""], answer: "" });

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("question", question.text);
    formData.append("answer", question.answer);
    question.options.forEach((option, index) => {
      formData.append(`option${index + 1}`, option);
    });

    try {
      await addQuestionToSection(formData, sectionId);
      toast.success("Question added successfully");
      setQuestion({ text: "", options: ["", "", "", ""], answer: "" });
    } catch (err) {
      console.log("Failed to add question", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleAddQuestion} className="space-y-6 my-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Add a Multiple Choice Question</h2>
      <Input
        type="text"
        placeholder="Question text"
        value={question.text}
        onChange={(e) => setQuestion({ ...question, text: e.target.value })}
        className="input w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      />
      {question.options.map((option, index) => (
        <Input
          key={index}
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => {
            const newOptions = [...question.options];
            newOptions[index] = e.target.value;
            setQuestion({ ...question, options: newOptions });
          }}
          className="input w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      ))}
      <Input
        type="text"
        placeholder="Correct Answer (Option 1, 2, 3, or 4)"
        value={question.answer}
        onChange={(e) => setQuestion({ ...question, answer: e.target.value })}
        className="input w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      />
      <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600">
        Add Question
      </Button>
    </form>
  );
};

export default MCQForm;
