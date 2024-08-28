import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // 1. Cleanup old data
   

    // 2. Cache popular courses

    // 3. Update course statistics
    await updateCourseStatistics();

    return NextResponse.json({ success: true, message: 'Cron job completed successfully' });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ success: false, message: 'Cron job failed' }, { status: 500 });
  }
}





async function updateCourseStatistics() {
  const courses = await db.course.findMany({
    where: { isPublished: true },
    include: { purchases: true,  }
  });

 
}

function calculateCompletionRate(enrollments: number, completions: number): number {
  return enrollments > 0 ? (completions / enrollments) * 100 : 0;
}