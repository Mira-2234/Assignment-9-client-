import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Request from "@/models/Request";
import Pet from "@/models/Pet";
import mongoose from "mongoose";

export async function PATCH(req, { params }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid request ID" }, { status: 400 });
        }

        await connectDB();
        const { status } = await req.json();
        const request = await Request.findById(id);

        if (!request) {
            return NextResponse.json({ message: "Request not found" }, { status: 404 });
        }
        if (request.ownerEmail !== session.user.email) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        if (status === "approved") {
            const alreadyApproved = await Request.findOne({
                petId:  request.petId,
                status: "approved",
                _id:    { $ne: id },
            });
            if (alreadyApproved) {
                return NextResponse.json(
                    { message: "Another request already approved" },
                    { status: 400 }
                );
            }
            await Pet.findByIdAndUpdate(request.petId, { status: "adopted" });
        }

        request.status = status;
        await request.save();
        return NextResponse.json(request);

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function DELETE(_, { params }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid request ID" }, { status: 400 });
        }

        await connectDB();
        const request = await Request.findById(id);

        if (!request) {
            return NextResponse.json({ message: "Request not found" }, { status: 404 });
        }

        const isRequester = request.requesterEmail === session.user.email;
        const isOwner     = request.ownerEmail === session.user.email;

        if (!isRequester && !isOwner) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        if (request.status === "approved") {
            return NextResponse.json(
                { message: "Cannot cancel an approved request" },
                { status: 400 }
            );
        }

        await Request.findByIdAndDelete(id);
        return NextResponse.json({ message: "Cancelled" });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}