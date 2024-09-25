'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import Shadcn Input
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface EditEngineerFormProps {
  engineer: { id: string; name: string };
  onClose: () => void;
  onUpdate: (id: string, name: string) => void;
}

const EditEngineerForm: React.FC<EditEngineerFormProps> = ({ engineer, onClose, onUpdate }) => {
  const [name, setName] = useState(engineer.name);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(engineer.id, name);
    toast.success("Engineer updated successfully!");
    onClose();
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div className="flex justify-between">
        <Button type="submit" className="bg-blue-500 text-white dark:bg-blue-600">Update Engineer</Button>
        <Button type="button" onClick={onClose} className="bg-gray-300 dark:bg-gray-600">Cancel</Button>
      </div>
    </form>
  );
};

export default EditEngineerForm;
