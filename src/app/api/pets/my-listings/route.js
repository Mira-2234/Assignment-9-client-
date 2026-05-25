import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Pet from "@/models/Pet";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const pets = await Pet.find({ ownerEmail: session.user.email })
            .sort({ createdAt: -1 });

        return NextResponse.json(pets);
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}