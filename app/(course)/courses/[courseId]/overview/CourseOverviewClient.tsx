"use client";

import dynamic from 'next/dynamic';
import { Clock, Book, User, Star, Users, BarChart, CheckCircle, PlayCircle, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';
import { calculateProgressPercentage } from '@/components/layout/CourseSideBar';
import { useState } from 'react';

const ReadText = dynamic(() => import("@/components/custom/ReadText"), { ssr: false });
const SectionMenu = dynamic(() => import("@/components/layout/SectionMenu"), { ssr: false });
const MotionDiv = dynamic(() => import("@/components/MotionDiv").then(mod => mod.MotionDiv), { ssr: false });
const MotionP = dynamic(() => import("@/components/MotionDiv").then(mod => mod.MotionP), { ssr: false });

interface StatCardProps {
  icon: any;
  label: string;
  value: string | number;
  className?: string;
}

const StatCard = ({ icon: Icon, label, value, className = "" }: StatCardProps) => (
  <Card className={`transform transition-all duration-300 hover:scale-105 ${className}`}>
    <CardContent className="flex items-center gap-4 p-6">
      <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900">
        <Icon className="w-6 h-6 text-blue-500 dark:text-blue-300" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </CardContent>
  </Card>
);

interface CourseOverviewClientProps {
  course: any; // Replace with proper type
  sections: any[]; // Replace with proper type
  levelName: string | null;
  instructorName: string | null;
  progress:number
  completedSections:number
}

export default function CourseOverviewClient({ 
  course, 
  sections, 
  levelName, 
  instructorName 
  ,
  progress,
  
}: CourseOverviewClientProps) {
   

      
    
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-gray-900 my-3">
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-500/20 text-white">
                  {levelName ? `Level: ${levelName}` : 'Course'}
                </Badge>
              {/*   {course.isPublished && (
                  <Badge variant="secondary" className="bg-green-500/20 text-white">
                    Published
                  </Badge>
                )} */}
              </div>
              <h1 className="text-4xl font-bold">{course.title}</h1>
              <MotionP
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-blue-100"
              >
                {course.subtitle}
              </MotionP>
            </div>
            <SectionMenu course={{ ...course, sections }} />
          </div>
        </MotionDiv>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            label="Total Sections"
            value={sections.length}
            className="bg-white dark:bg-gray-800"
          />
            {/*  <StatCard
                icon={Clock}
                label="Duration"
                value={`${Math.ceil(sections.length * 0.5)}h`}
                className="bg-white dark:bg-gray-800"
            /> */}
          <StatCard
            icon={User}
            label="Instructor"
            value={instructorName || 'Not specified'}
            className="bg-white dark:bg-gray-800"
          />
        </div>

        {/* Course Progress */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-sm"
        >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Progress</h3>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{`${progress}% Complete`}</span>
              <span>{(progress/100)*sections.length}/{sections.length} sections</span>
            </div>
          </div>
        </MotionDiv>

        {/* Course Description */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Course Notes
          </h2>
          {course.description ? (
            <div className="prose dark:prose-invert max-w-none">
              <ReadText value={course.description} />
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400 border-2 border-dashed rounded-lg">
              <p className="text-center">Course description will be available soon.</p>
            </div>
          )}
        </MotionDiv>

        {/* Course Sections Preview */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-4"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Course Content
          </h2>
          {sections.map((section, index) => (
            <Link className='mb-5' 
            key={section.id}
          href={`/courses/${course.id}/sections/${section.id}`}
            >
            
            <Card key={section.id} className="transition-all my-3 duration-300 hover:shadow-md hover:-translate-y-1">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/50">
                  <Book className="w-6 h-6 text-blue-500 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Section {index + 1}
                  </p>
                </div>
                {section.isCompleted && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    Completed
                  </Badge>
                )}
              </CardContent>
            </Card>
            </Link>
          ))}
        </MotionDiv>
      </div>
    </div>
  );
}