import { getInstructorCourses, getUserFromToken } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { redirect } from "next/navigation";
import { MotionDiv } from "@/components/MotionDiv";
import { TextEffect } from "@/components/TextEffect";

type CourseData = {
  name: string;
  sales: number;
  revenue: number;
  totalSections: number;
  completedSections: number;
  totalStudents: number;
  averageProgress: number;
};

const PerformancePage = async () => {
	const user = await getUserFromToken();

	if (!user) {
		return redirect("/sign-in");
	}

	const courses = await getInstructorCourses(user.id);

	const totalRevenue = courses.reduce((sum, course) => sum + (course.price || 0) * course.purchases.length, 0);
	const totalSales = courses.reduce((sum, course) => sum + course.purchases.length, 0);

	const courseData: CourseData[] = courses.map(course => ({
		name: course.title,
		sales: course.purchases.length,
		revenue: (course.price || 0) * course.purchases.length,
		totalSections: course.sections.length,
		completedSections: course.sections.reduce((sum, section) => 
			sum + section.progress.filter(p => p.isCompleted).length, 0),
		totalStudents: course.purchases.length,
		averageProgress: course.sections.length > 0 
			? (course.sections.reduce((sum, section) => 
				sum + section.progress.filter(p => p.isCompleted).length, 0) / 
			(course.sections.length * course.purchases.length)) * 100
			: 0
	}));

	return (
		<div className="p-6 space-y-6">
			<TextEffect per="char" preset="fade" as="animate"  className="text-2xl font-bold dark:text-white text-gray-800">
				{`Welcome, ${user.name}`}
			</TextEffect>
			
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Sales</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalSales}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Courses</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{courses.length}</div>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="sales" className="space-y-4">
				<TabsList className=" bg-transparent">
					
					<TabsTrigger value="progress">Show Students Progress</TabsTrigger>
				</TabsList>
				
				
				<TabsContent value="progress" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Course Progress</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Course</TableHead>
										<TableHead>Total Students</TableHead>
										<TableHead>Average Progress</TableHead>
										<TableHead>Progress Bar</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{courseData.map((course) => (
										<TableRow key={course.name}>
											<TableCell>{course.name}</TableCell>
											<TableCell>{course.totalStudents}</TableCell>
											<TableCell>{course.averageProgress.toFixed(2)}%</TableCell>
											<TableCell>
                      <MotionDiv
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay:  0.1 + 0.3, duration: 0.5 }}
                    >
                      <Progress
                        value={course.averageProgress}
                        className="h-3 w-full"
                      />
                    </MotionDiv>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default PerformancePage;