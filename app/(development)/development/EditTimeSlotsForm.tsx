'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface EditTimeSlotFormProps {
  timeSlot: { day: string; time: string; place: string };
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded shadow-md">
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
      <div className="flex justify-between">
        <Button type="submit" className="bg-blue-500 text-white dark:bg-blue-600">Update Time Slot</Button>
        <Button type="button" onClick={onClose} className="bg-gray-300 dark:bg-gray-600">Cancel</Button>
      </div>
    </form>
  );
};

export default EditTimeSlotForm;
