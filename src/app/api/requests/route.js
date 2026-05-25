import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Request from "@/models/Request";
import Pet from "@/models/Pet";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { petId } = body;

    // ObjectId বা String দুটোই handle
    let pet = null;
    if (mongoose.Types.ObjectId.isValid(petId) && petId.length === 24) {
      pet = await Pet.findById(petId).lean();
    }
    if (!pet) {
      pet = await Pet.collection.findOne({ _id: petId });
    }

    if (!pet) {
      return NextResponse.json({ message: "Pet not found" }, { status: 404 });
    }
    if (pet.ownerEmail && pet.ownerEmail === session.user.email) {
      return NextResponse.json({ message: "You cannot adopt your own pet" }, { status: 400 });
    }
    if (pet.status === "adopted") {
      return NextResponse.json({ message: "This pet is already adopted" }, { status: 400 });
    }

    const existing = await Request.findOne({
      petId:          String(petId),
      requesterEmail: session.user.email,
      status:         { $in: ["pending", "approved"] },
    });
    if (existing) {
      return NextResponse.json({ message: "You already have an active request for this pet" }, { status: 400 });
    }

    const request = await Request.create({
      petId:          String(petId),
      petName:        pet.petName || pet.name || "",
      petImage:       pet.imageUrl || pet.image || "",
      requesterName:  session.user.name || "",
      requesterEmail: session.user.email,
      ownerEmail:     pet.ownerEmail || "",
      pickupDate:     body.pickupDate || "",
      message:        body.message || "",
      status:         "pending",
    });

    return NextResponse.json(request, { status: 201 });

  } catch (err) {
    console.error("POST /api/requests error:", err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const ownerEmail = searchParams.get("ownerEmail");

    const query = ownerEmail
      ? { ownerEmail }
      : { requesterEmail: session.user.email };

    const requests = await Request.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(requests);

  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}