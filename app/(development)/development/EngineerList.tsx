'use client';
import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PlusCircle } from 'lucide-react';
import AddTimesForm from './AddTimesForm';

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

const EngineerList: React.FC<EngineerListProps> = ({ engineers }) => {
  const [openEngineerId, setOpenEngineerId] = useState<string | null>(null);

  // Handle Esc key to close the form
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenEngineerId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggle = (id: string) => {
    setOpenEngineerId(openEngineerId === id ? null : id);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <Typography variant="h5" className="text-2xl py-3 font-semibold mb-4 text-gray-800">
        Engineers List
      </Typography>
      <div className="space-y-4">
        {engineers.map((engineer) => (
          <Accordion key={engineer.id} className="border border-gray-200">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${engineer.id}-content`}
              id={`panel-${engineer.id}-header`}
            >
              <Typography className="font-medium text-lg text-blue-600 flex justify-between items-center w-full">
                {engineer.name}
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(engineer.id);
                  }}
                  className="cursor-pointer"
                >
                  <PlusCircle />
                </span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ul className="mt-2 space-y-1 text-gray-700">
                {engineer.times.map((time, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2 text-sm font-medium">{time.day}:</span>
                    <span className="text-sm">{time.time} ({time.place})</span>
                  </li>
                ))}
              </ul>
              {openEngineerId === engineer.id && (
                <AddTimesForm engineerId={engineer.id} />
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default EngineerList;
