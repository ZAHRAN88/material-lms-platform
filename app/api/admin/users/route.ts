import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getUserFromToken } from "@/app/actions";

async function getUserRole(userId: string) {
  const userRole = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return userRole?.role || 'USER';  
}

export async function GET(req: NextRequest) {
  const tokenUser = await getUserFromToken();
  
  if (!tokenUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userRole = await getUserRole(tokenUser.id);

  if (userRole !== "MASTER") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const users = await db.user.findMany({
   
  });

  const formattedUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'USER',
  }));

  return NextResponse.json(formattedUsers);
}

export async function POST(req: NextRequest) {
  const tokenUser = await getUserFromToken();
  
  if (!tokenUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userRole = await getUserRole(tokenUser.id);

  if (userRole !== "MASTER") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { name, email, password, role } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  return NextResponse.json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role || 'USER',
  });
}

export async function PUT(req: NextRequest) {
  const tokenUser = await getUserFromToken();
  
  if (!tokenUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userRole = await getUserRole(tokenUser.id);

  if (userRole !== "MASTER") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id, role } = await req.json();

  const updatedUser = await db.user.update({
    where: { id },
    data: {
      role: role,
    },
  });

  return NextResponse.json({
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role || 'USER',
  });
}
