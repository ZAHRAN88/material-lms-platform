import { Suspense } from "react";
import CourseCard from "@/components/courses/CourseCard";
import CourseSkeleton from "@/components/courses/CourseSkeleton";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Header from "./Header";
import { MotionDiv } from "@/components/MotionDiv";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserFromToken } from "@/app/actions";

const PurchasedCourses = async () => {
	const user = await getUserFromToken();

	if (!user) {
		return redirect("/sign-in");
	}

	const purchasedCourses = await db.purchase.findMany({
		where: {
			customerId: user.id,
		},
		select: {
			course: {
				include: {
					category: true,
					subCategory: true,
					sections: {
						where: {
							isPublished: true,
						},
					},
				},
			},
		},
	});

	if (purchasedCourses.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center px-4">
				<h2 className="text-2xl font-semibold text-slate-700 mb-4">
					No courses enrolled yet
				</h2>
				<p className="text-slate-500 mb-6 max-w-md">
					Explore our course catalog and start your learning journey today!
				</p>
				<Link href="/">
					<Button size="lg">Browse Courses</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<Header />
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{purchasedCourses.map((purchase) => (
					<MotionDiv
						key={purchase.course.id}
						className="group hover:translate-y-[-5px] transition-all duration-300 ease-in-out"
					>
						<CourseCard course={purchase.course} />
					</MotionDiv>
				))}
			</div>
		</div>
	);
};

const LoadingSkeleton = () => (
	<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
		{[...Array(4)].map((_, index) => (
			<CourseSkeleton key={index} />
		))}
	</div>
);

const LearningPage = async () => {
	const user = await getUserFromToken();

	if (!user) {
		return redirect("/sign-in");
	}

	return (
		<div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
			<Suspense fallback={<LoadingSkeleton />}>
				<PurchasedCourses />
			</Suspense>
		</div>
	);
};

export default LearningPage;