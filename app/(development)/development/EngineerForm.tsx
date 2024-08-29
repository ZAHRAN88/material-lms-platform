import React, { useState } from 'react';
import { addEngineer } from '../../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from "lucide-react";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface EngineerFormProps {
  onClose: () => void;
}

const EngineerForm: React.FC<EngineerFormProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await addEngineer(formData);
      toast.success('Engineer added successfully');
      onClose();
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Failed to add engineer: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Add Engineer</CardTitle>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter engineer's name"
              required
            />
          </div>

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
              id="place"
              name="place"
              placeholder="Enter location"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Adding...' : 'Add Engineer'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EngineerForm;
