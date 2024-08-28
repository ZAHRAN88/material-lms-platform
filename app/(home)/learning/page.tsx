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
			<div className="w-full text-center py-10">
				<p className="text-2xl font-semibold text-slate-600 mb-4">
					No courses enrolled yet
				</p>
				<p className="text-slate-500 mb-6">
					Explore our course catalog and start your learning journey today!
				</p>
				<Link href="/">
					<Button>Browse Courses</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2 justify-center items-center   ">
			<Header/>
			{purchasedCourses.map((purchase, index) => (
				<MotionDiv
					key={purchase.course.id}
					className="border rounded-lg shadow-sm cursor-pointer overflow-hidden group hover:translate-y-3 hover:shadow-md transition-all ease-in-out duration-300 delay-75"
				>
					<CourseCard course={purchase.course} />
				</MotionDiv>
			))}
		</div>
	);
};

const LoadingSkeleton = () => (
	<>
		{[...Array(4)].map((_, index) => (
			<div key={index} className="w-72">
				<CourseSkeleton />
			</div>
		))}
	</>
);

const LearningPage = async () => {
	const user = await getUserFromToken();

	if (!user) {
		return redirect("/sign-in");
	}

	return (
		<div className="flex flex-col gap-2 justify-center items-center px-4 py-6 md:mt-5 md:px-10 xl:px-16">

			
			<div className="flex items-center justify-center flex-wrap gap-7 mt-7">
				<Suspense fallback={<LoadingSkeleton />}>
					<PurchasedCourses />
				</Suspense>
			</div>
		</div>
	);
};

export default LearningPage;