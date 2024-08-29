import React, { useState, useTransition } from 'react'
import { addTimesToEngineer } from '../../actions'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast'; // Assuming you're using react-hot-toast
import { useRouter } from 'next/navigation';

interface Time {
  day: string;
  time: string;
  place: string;
}

interface AddTimesFormProps {
  engineerId: string;
  engineerName: string;
  onClose: () => void; // Add this line
  onAddTimes: (newTimes: Time[]) => void; // Updated prop type
}

const AddTimesForm: React.FC<AddTimesFormProps> = ({ engineerId, engineerName, onClose, onAddTimes }) => {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const newTime = await addTimesToEngineer(formData);
        toast.success('Time added successfully');
        onAddTimes([newTime]); 
        router.refresh();
        setIsOpen(false);
      } catch (error) {
        toast.error('Failed to add times');
        console.error(error);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Times</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Times for <span className="font-bold text-blue-500"> Eng: {engineerName}</span></DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="engineerId" value={engineerId} />
          
          <div className="space-y-2">
            <Label htmlFor="day">Day</Label>
            <Select name="day" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {['Monday' || 'monday', 'Tuesday' || 'tuesday', 'Wednesday' || 'wednesday', 'Thursday' || 'thursday', 'Friday' || 'friday', 'Saturday' || 'saturday', 'Sunday' || 'sunday'].map((day) => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              type="time"
              id="time"
              name="time"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="place">Place</Label>
            <Input
              type="text"
              id="place"
              name="place"
              placeholder="Enter location"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Adding...' : 'Add Times'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddTimesForm
