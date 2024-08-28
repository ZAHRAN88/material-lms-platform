import React from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { addEngineer } from '../../actions';
import { Button } from '@/components/ui/button';

const EngineerForm = () => {
  return (
    <Box className=" mt-10 p-6 bg-white shadow-md rounded-lg">
     
      <form action={addEngineer}>
        <div className='flex flex-col gap-5'>
        <Typography variant="h5" className="text-center dark:text-black font-bold mb-6">
        Add Engineer
      </Typography>
        {/* Name Field */}
        <TextField
          id="name"
          name="name"
          label="Name"
          variant="outlined"
          fullWidth
          required
          className="mb-4"
        />
        {/* Day Field */}
        <TextField
          id="day"
          name="day"
          label="Day"
          variant="outlined"
          fullWidth
          required
          className="mb-4"
        />
        {/* Time Field */}
        <TextField
          id="time"
          name="time"
          label="Time"
          variant="outlined"
          fullWidth
          required
          className="mb-4"
        />
        {/* Place Field */}
        <TextField
          id="place"
          name="place"
          label="Place"
          variant="outlined"
          fullWidth
          required
          className="my-4"
        />
         <Button
          type="submit"
          
          color="primary"
          
          className="py-2"
        >
          Add Engineer
        </Button>
        </div>

      
       
      </form>
    </Box>
  );
};

export default EngineerForm;
