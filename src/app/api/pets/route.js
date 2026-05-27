import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Pet from "@/models/Pet";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const search  = searchParams.get("search")  || "";
        const species = searchParams.get("species") || "";
        const sort    = searchParams.get("sort")    || "";

        
        const query = {};

        if (search) {
            query.$or = [
                { petName:  { $regex: search, $options: "i" } },
                { name:     { $regex: search, $options: "i" } },
                { breed:    { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
            ];
        }

        if (species) {
            query.species = { $in: species.split(",") };
        }

        const sortMap = {
            fee_asc:  { adoptionFee:  1 },
            fee_desc: { adoptionFee: -1 },
            age_asc:  { age:  1 },
            age_desc: { age: -1 },
        };

        const pets = await Pet.find(query).sort(sortMap[sort] || { createdAt: -1 }).lean();
        return NextResponse.json(pets);

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();

        const pet = await Pet.create({
            ...body,
            ownerEmail: session.user.email,
            ownerName:  session.user.name,
        });

        return NextResponse.json(pet, { status: 201 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}