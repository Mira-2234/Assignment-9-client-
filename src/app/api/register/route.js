import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import User from "@/models/User.model";

export async function POST(req) {
    try {
        await connectDB();
        const { name, email, photoURL, password } = await req.json();

        // already exists check
        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json(
                { message: "Email already in use" },
                { status: 400 }
            );
        }

        // password hash
        const hashed = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            image: photoURL || "",
            password: hashed,
        });

        return NextResponse.json({ message: "User created" }, { status: 201 });

    } catch (err) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}