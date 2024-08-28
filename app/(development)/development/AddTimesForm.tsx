import React from 'react'
import { addTimesToEngineer } from '../../actions'
import { Button } from '@/components/ui/button';

interface AddTimesFormProps {
  engineerId: string;
}

const AddTimesForm: React.FC<AddTimesFormProps> = ({ engineerId }) => {
  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <form action={addTimesToEngineer} className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Add Times</h1>
        <input
          type="text"
          id="engineerId"
          name="engineerId"
          placeholder="Engineer ID"
          value={engineerId}
          hidden
          
        />
        <input
          type="text"
          id="day"
          name="day"
          placeholder="Day"
          required
          className="block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          id="time"
          name="time"
          placeholder="Time"
          required
          className="block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          id="place"
          name="place"
          placeholder="Place"
          required
          className="block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Add Times
        </Button>
      </form>
    </div>
  )
}

export default AddTimesForm
