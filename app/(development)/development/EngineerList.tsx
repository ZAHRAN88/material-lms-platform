'use client';
import React, { useState } from 'react';
import { PlusCircle, Clock } from 'lucide-react';
import AddTimesForm from './AddTimesForm';
import EngineerForm from './EngineerForm';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addTimesToEngineer } from '@/app/actions';

interface Time {
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

const EngineerList: React.FC<EngineerListProps> = ({ engineers: initialEngineers }) => {
  const [engineers, setEngineers] = useState<Engineer[]>(initialEngineers);
  const [isAddEngineerOpen, setIsAddEngineerOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null);
  const [isViewTimesOpen, setIsViewTimesOpen] = useState(false);

  const handleAddEngineer = () => {
    setIsAddEngineerOpen(true);
  };

  const handleAddTimes = async (newTimes: Time[]) => {
    if (selectedEngineer) {
      try {
        // Remove the loop and formData logic
        // The actual adding of times should be handled in the AddTimesForm component
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

  const handleCloseDialogs = () => {
    setIsAddEngineerOpen(false);
    setIsViewTimesOpen(false);
    setSelectedEngineer(null);
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
                      <Button variant="outline" size="sm" onClick={() => handleViewTimes(engineer)}>
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
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <AddTimesForm engineerId={engineer.id} onAddTimes={handleAddTimes} engineerName={engineer.name} onClose={handleCloseDialogs} />
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
