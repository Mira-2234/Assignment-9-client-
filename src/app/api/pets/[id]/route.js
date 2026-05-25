import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Pet from "@/models/Pet";
import mongoose from "mongoose";

export async function GET(_, { params }) {
    try {
        const { id } = await params;
        await connectDB();

        let pet;
        if (mongoose.Types.ObjectId.isValid(id)) {
            pet = await Pet.findById(id);
        } else {
            pet = await Pet.findOne({ _id: id });
        }

        if (!pet) {
            return NextResponse.json({ message: "Pet not found" }, { status: 404 });
        }
        return NextResponse.json(pet);

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        let pet;
        if (mongoose.Types.ObjectId.isValid(id)) {
            pet = await Pet.findById(id);
        } else {
            pet = await Pet.findOne({ _id: id });
        }

        if (!pet) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }
        if (pet.ownerEmail !== session.user.email) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        let updated;
        if (mongoose.Types.ObjectId.isValid(id)) {
            updated = await Pet.findByIdAndUpdate(
                id,
                { ...body, age: Number(body.age), adoptionFee: Number(body.adoptionFee) },
                { new: true }
            );
        } else {
            updated = await Pet.findOneAndUpdate(
                { _id: id },
                { ...body, age: Number(body.age), adoptionFee: Number(body.adoptionFee) },
                { new: true }
            );
        }
        return NextResponse.json(updated);

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

        await connectDB();

        let pet;
        if (mongoose.Types.ObjectId.isValid(id)) {
            pet = await Pet.findById(id);
        } else {
            pet = await Pet.findOne({ _id: id });
        }

        if (!pet) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }
        if (pet.ownerEmail !== session.user.email) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        if (mongoose.Types.ObjectId.isValid(id)) {
            await Pet.findByIdAndDelete(id);
        } else {
            await Pet.findOneAndDelete({ _id: id });
        }

        return NextResponse.json({ message: "Deleted" });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}