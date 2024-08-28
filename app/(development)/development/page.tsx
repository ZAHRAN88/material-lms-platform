import { db } from "@/lib/db";
import React from "react";
import EngineerForm from "./EngineerForm";
import EngineerList from "./EngineerList";

const page = async () => {
  const engineers = await db.engineer.findMany({
    include: {
      times: true,
    },
  });

  const formattedEngineers = engineers.map((engineer) => ({
    ...engineer,
    id: engineer.id,
    times: engineer.times.map((time) => ({
      ...time,
      id: Number(time.id),
      engineerId: Number(time.engineerId),
    })),
  }));

  return (
    <div className=" p-5">
      <h1 className="text-3xl text-center font-bold mb-4 text-gray-800">
        Engineer Dashboard
      </h1>
      <div className="flex items-center flex-col gap-5 justify-between">
        <div className=" w-[80%] ">
          <EngineerForm />
        </div>
        <div className=" w-[80%] ">
          <EngineerList engineers={formattedEngineers} />
        </div>
      </div>
    </div>
  );
};

export default page;
