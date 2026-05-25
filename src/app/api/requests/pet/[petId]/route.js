import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Request from "@/models/Request";
import Pet from "@/models/Pet";
import mongoose from "mongoose";

export async function GET(_, { params }) {
    try {
        const { petId } = await params;
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!mongoose.Types.ObjectId.isValid(petId)) {
            return NextResponse.json({ message: "Invalid pet ID" }, { status: 400 });
        }

        await connectDB();
        const pet = await Pet.findById(petId);

        if (!pet) {
            return NextResponse.json({ message: "Pet not found" }, { status: 404 });
        }
        if (pet.ownerEmail !== session.user.email) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const requests = await Request.find({ petId }).sort({ createdAt: -1 });
        return NextResponse.json(requests);

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}