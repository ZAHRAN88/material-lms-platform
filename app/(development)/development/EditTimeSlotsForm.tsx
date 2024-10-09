'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { deleteTimeSlot } from '@/app/actions';

interface EditTimeSlotFormProps {
  timeSlot: { id: string; day: string; time: string; place: string };
  onClose: () => void;
  onUpdate: (day: string, time: string, place: string) => void;
}

const EditTimeSlotForm: React.FC<EditTimeSlotFormProps> = ({ timeSlot, onClose, onUpdate }) => {
  const [day, setDay] = useState(timeSlot.day);
  const [time, setTime] = useState(timeSlot.time);
  const [place, setPlace] = useState(timeSlot.place);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(day, time, place);
    toast.success("Time slot updated successfully!");
    onClose();
    router.refresh();
  };

  const handleDelete = async () => {
    const result = await deleteTimeSlot(timeSlot.id);
    if (result.success) {
      toast.success("Time slot deleted successfully!");
      onClose();
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete time slot.");
    }
  };

  return (
    <form onSubmit={handleSubmit}  className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg  shadow-md max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Edit Time Slot</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Day</label>
        <Input
          type="text"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
        <Input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Place</label>
        <Input
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row justify-between">
        <Button type="submit" className="bg-blue-500 text-white dark:bg-blue-600 w-full sm:w-auto mb-2 sm:mb-0">Update Time Slot</Button>
        <Button type="button" onClick={handleDelete} className="bg-red-500 text-white dark:bg-red-600 w-full sm:w-auto mb-2 sm:mb-0">Delete Time Slot</Button>
        <Button type="button" onClick={onClose} className="bg-gray-300 dark:bg-gray-600 w-full sm:w-auto">Cancel</Button>
      </div>
    </form>
  );
};

export default EditTimeSlotForm;
