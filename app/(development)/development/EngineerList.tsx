'use client';
import React, { useState } from 'react';
import { PlusCircle, Clock, Edit } from 'lucide-react';
import AddTimesForm from './AddTimesForm';
import EngineerForm from './EngineerForm';
import EditEngineerForm from './EditEngineerForm'; // Import the new EditEngineerForm
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addTimesToEngineer } from '@/app/actions';
import EditTimeSlotForm from './EditTimeSlotsForm';
import { updateEngineer, updateTimeSlot } from '@/app/actions'; // Import the new actions

interface Time {
  id: string; // Add this line
  day: string;
  time: string;
  place: string;
}

interface Engineer {
  id: string;
  name: string;
  times: Time[];
}

interface EngineerListProps {
  engineers: Engineer[];
}

const defaultValue: Engineer[] = []; // Explicitly define the type of defaultValue

const EngineerList: React.FC<EngineerListProps> = ({ engineers: initialEngineers }) => {
  const [engineers, setEngineers] = useState<Engineer[]>(initialEngineers);
  const [isAddEngineerOpen, setIsAddEngineerOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);
  const [isViewTimesOpen, setIsViewTimesOpen] = useState(false);
  const [isEditEngineerOpen, setIsEditEngineerOpen] = useState(false); // State for edit dialog
  const [isEditTimeSlotOpen, setIsEditTimeSlotOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Time | null>(null);

  const handleAddEngineer = () => {
    setIsAddEngineerOpen(true);
  };

  const handleAddTimes = async (newTimes: Time[]): Promise<void> => {
    if (selectedEngineer) {
      try {
        // Handle adding times
        handleCloseDialogs();
      } catch (error) {
        console.error('Error adding times:', error);
      }
    }
  };

  const handleViewTimes = (engineer: Engineer) => {
    setSelectedEngineer(engineer);
    setIsViewTimesOpen(true);
  };

  const handleEditEngineer = (engineer: Engineer) => {
    setSelectedEngineer(engineer);
    setIsEditEngineerOpen(true);
  };

  const handleUpdateEngineer = async (id: string, name: string) => {
    try {
      const updatedEngineer = await updateEngineer(id, name);
      // Ensure updatedEngineer has all properties of Engineer
      const completeEngineer: Engineer = { ...updatedEngineer, times: [{ id: '', day: '', time: '', place: '' }] }; // Wrap defaultValue in an array of Time objects
      setEngineers((prev: Engineer[]) => // Change type of prev to Engineer[]
        prev.map((engineer) => (engineer.id === completeEngineer.id ? { ...engineer, times: completeEngineer.times } : engineer))
      );
    } catch (error) {
      console.error('Error updating engineer:', error);
    }
  };

  const handleCloseDialogs = () => {
    setIsAddEngineerOpen(false);
    setIsViewTimesOpen(false);
    setIsEditEngineerOpen(false); // Close edit dialog
    setSelectedEngineer(null);
  };

  const handleEditTimeSlot = (timeSlot: Time) => {
    setSelectedTimeSlot(timeSlot);
    setIsEditTimeSlotOpen(true);
  };

  const handleUpdateTimeSlot = async (day: string, time: string, place: string) => {
    if (selectedEngineer && selectedTimeSlot) {
      try {
        const updatedTimeSlot = await updateTimeSlot(selectedTimeSlot.id, day, time, place);
        setEngineers((prev) =>
          prev.map((engineer) => {
            if (engineer.id === selectedEngineer.id) {
              return {
                ...engineer,
                times: engineer.times.map((t) =>
                  t.id === updatedTimeSlot.id ? updatedTimeSlot : t
                ),
              };
            }
            return engineer;
          })
        );
      } catch (error) {
        console.error('Error updating time slot:', error);
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Engineers List</CardTitle>
        <Dialog open={isAddEngineerOpen} onOpenChange={setIsAddEngineerOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddEngineer}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Engineer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Engineer</DialogTitle>
            </DialogHeader>
            <EngineerForm onClose={handleCloseDialogs} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {engineers.map((engineer) => (
              <TableRow key={engineer.id}>
                <TableCell>{engineer.name}</TableCell>
                <TableCell>
                  <Dialog open={isViewTimesOpen && selectedEngineer?.id === engineer.id} onOpenChange={setIsViewTimesOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className='mx-4' size="sm" onClick={() => handleViewTimes(engineer)}>
                        <Clock className="mr-2 h-4 w-4" />
                        View Times
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{engineer.name}&apos;s Schedule</DialogTitle>
                      </DialogHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Place</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {engineer.times.map((time, index) => (
                            <TableRow key={index}>
                              <TableCell>{time.day}</TableCell>
                              <TableCell>{time.time}</TableCell>
                              <TableCell>{time.place}</TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm" onClick={() => handleEditTimeSlot(time)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Time
                                </Button>
                                <Dialog open={isEditTimeSlotOpen && selectedTimeSlot?.day === time.day && selectedTimeSlot?.time === time.time} onOpenChange={setIsEditTimeSlotOpen}>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Edit Time Slot</DialogTitle>
                                    </DialogHeader>
                                    {selectedTimeSlot && (
                                      <EditTimeSlotForm
                                        timeSlot={selectedTimeSlot}
                                        onClose={() => setIsEditTimeSlotOpen(false)}
                                        onUpdate={handleUpdateTimeSlot}
                                      />
                                    )}
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <AddTimesForm 
                        engineerId={engineer.id} 
                        onAddTimes={handleAddTimes as (newTimes: any) => void} // Use 'any' as a temporary fix
                        engineerName={engineer.name} 
                        onClose={handleCloseDialogs} 
                      />
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={() => handleEditEngineer(engineer)}>
                    <Edit className="mx-2 h-4 w-4" />
                    Edit Engineer
                  </Button>
                  <Dialog open={isEditEngineerOpen && selectedEngineer?.id === engineer.id} onOpenChange={setIsEditEngineerOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Engineer</DialogTitle>
                      </DialogHeader>
                      {selectedEngineer && (
                        <EditEngineerForm
                          engineer={selectedEngineer}
                          onClose={handleCloseDialogs}
                          onUpdate={handleUpdateEngineer}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EngineerList;
