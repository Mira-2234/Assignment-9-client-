"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import {
    HiLocationMarker, HiShieldCheck, HiHeart,
    HiCalendar, HiUser, HiMail, HiClock,
    HiClipboardList
} from "react-icons/hi";

export default function PetDetailsPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();
    const qc = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ pickupDate: "", message: "" });

    const { data: pet, isLoading } = useQuery({
        queryKey: ["pet", id],
        queryFn: () => axios.get(`/api/pets/${id}`).then((r) => r.data),
    });

    // ── user এর existing request check ──
    const { data: myRequests = [] } = useQuery({
        queryKey: ["myRequests"],
        queryFn: () =>
            axios.get("/api/requests", { withCredentials: true }).then((r) => r.data),
        enabled: !!user, // user না থাকলে fetch করবে না
    });

    // এই pet এর জন্য user এর active request আছে?
    const existingRequest = myRequests.find(
        (r) =>
            r.petId === id &&
            (r.status === "pending" || r.status === "approved")
    );

    const adoptMutation = useMutation({
        mutationFn: (data) =>
            axios.post("/api/requests", data, { withCredentials: true }),
        onSuccess: () => {
            toast.success("Adoption request submitted! 🐾");
            setShowForm(false);
            setFormData({ pickupDate: "", message: "" });
            qc.invalidateQueries(["myRequests"]);
            qc.invalidateQueries(["pet", id]); // pet status ও refresh করো
        },
        onError: (err) =>
            toast.error(err.response?.data?.message || "Failed to submit"),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) { router.push(`/login?from=/pets/${id}`); return; }
        adoptMutation.mutate({
            petId:      pet._id,
            petName:    petName,
            petImage:   image,
            ownerEmail: pet.ownerEmail,
            userName:   user.name,
            userEmail:  user.email,
            pickupDate: formData.pickupDate,
            message:    formData.message,
        });
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-10 h-10 rounded-full border-4 border-green-100 border-t-green-600 animate-spin" />
        </div>
    );

    if (!pet) return (
        <div className="text-center py-20">
            <div className="text-6xl mb-10">🐾</div>
            <p className="text-gray-500 text-lg">Pet not found.</p>
            <Link href="/pets" className="mt-4 inline-block text-green-600 hover:underline text-sm">
                ← Back to All Pets
            </Link>
        </div>
    );

    const petName = pet.petName || pet.name;
    const image   = pet.imageUrl || pet.image;
    const isOwner = user?.email === pet.ownerEmail;

    return (
        <div className="min-h-screen bg-gray-50 py-10 mt-20">
            <div className="max-w-6xl mx-auto px-4">

                <Link href="/pets"
                    className="inline-flex items-center gap-1 text-sm text-green-600 font-medium mb-8 hover:underline">
                    ← Back to All Pets
                </Link>

                <div className="grid grid-cols-2 gap-5 items-start">

                    {/* LEFT — Image + Details */}
                    <div className="space-y-5">
                        <div className="relative rounded-2xl overflow-hidden h-52 bg-gray-100 shadow-sm">
                            {image && (
                                <img src={image} alt={petName} className="w-full h-full object-cover" />
                            )}
                            <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                                pet.status === "adopted"
                                    ? "bg-gray-200 text-gray-700"
                                    : "bg-green-500 text-white"
                            }`}>
                                {pet.status === "adopted" ? "Adopted" : "Available"}
                            </span>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{petName}</h1>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {pet.breed} · {pet.age} yr{pet.age !== 1 ? "s" : ""} · {pet.gender}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">Adoption Fee</p>
                                    <p className="text-xl font-bold text-green-600">৳{pet.adoptionFee}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <HiLocationMarker className="text-green-500" />
                                {pet.location}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
                                <p className="text-xs text-gray-400 mb-1">Species</p>
                                <p className="font-medium text-sm text-gray-700">{pet.species}</p>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
                                <p className="text-xs text-gray-400 mb-1">Health</p>
                                <p className="font-medium text-sm text-gray-700">{pet.healthStatus}</p>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 col-span-2">
                                <p className="text-xs text-gray-400 mb-1">Vaccination</p>
                                <p className="font-medium text-sm text-gray-700 flex items-center gap-1">
                                    <HiShieldCheck className={
                                        pet.vaccinationStatus === "Vaccinated"
                                            ? "text-green-500"
                                            : "text-amber-500"
                                    } />
                                    {pet.vaccinationStatus}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-2">
                            <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">About</p>
                            <p className="text-gray-600 text-sm leading-relaxed">{pet.description}</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-2">
                            <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">Owner</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold flex-shrink-0">
                                    {pet.ownerName?.[0]?.toUpperCase() || "?"}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-800">{pet.ownerName}</p>
                                    <p className="text-xs text-gray-400">{pet.ownerEmail}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-2xl border border-green-100 p-5 mt-2">
                            <p className="font-bold text-green-800 text-sm mb-3">🐾 How Adoption Works</p>
                            <div className="space-y-2">
                                {[
                                    "Submit your adoption application",
                                    "Owner reviews your request",
                                    "Get approved & arrange pickup",
                                    "Welcome your new family member!",
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center shrink-0 font-bold">
                                            {i + 1}
                                        </span>
                                        <p className="text-sm text-green-800">{s}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT — Adopt Section */}
                    <div className="sticky top-24">

                        {isOwner ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-10 text-center">
                                <div className="text-5xl mb-4">🏠</div>
                                <p className="font-bold text-amber-800 mb-1">This is your listing</p>
                                <p className="text-sm text-amber-600">You cannot adopt your own pet.</p>
                            </div>

                        ) : pet.status === "adopted" ? (
                            <div className="bg-gray-100 border border-gray-200 rounded-2xl p-10 text-center">
                                <div className="text-5xl mb-4">🐾</div>
                                <p className="font-bold text-gray-700 mb-1">Already Adopted</p>
                                <p className="text-sm text-gray-500 mb-5">This pet has found a loving home.</p>
                                <Link href="/pets"
                                    className="inline-block px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition font-medium">
                                    Find Other Pets
                                </Link>
                            </div>

                        ) : existingRequest ? (
                            /*request */
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-10 text-center">
                                <HiClipboardList className="text-5xl text-blue-400 mx-auto mb-4" />
                                <p className="font-bold text-blue-800 mb-1">Request Already Submitted</p>
                                <p className="text-sm text-blue-600 mb-2">
                                    You have already applied to adopt {petName}.
                                </p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                    existingRequest.status === "approved"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}>
                                    Status: {existingRequest.status === "approved" ? "✅ Approved" : "⏳ Pending"}
                                </span>
                                <div className="mt-5">
                                    <Link href="/dashboard/my-requests"
                                        className="inline-block px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition font-medium">
                                        View My Requests
                                    </Link>
                                </div>
                            </div>

                        ) : !showForm ? (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                                <div className="text-6xl mb-5">🐾</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                    Interested in {petName}?
                                </h3>
                                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                                    Fill out a quick adoption form and give {petName} a loving forever home.
                                </p>
                                <button
                                    onClick={() => {
                                        if (!user) { router.push(`/login?from=/pets/${id}`); return; }
                                        setShowForm(true);
                                    }}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition flex items-center justify-center gap-2 text-base"
                                >
                                    <HiHeart className="text-lg" />
                                    Apply to Adopt
                                </button>
                            </div>

                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-xl font-bold text-gray-800">Adoption Application</h2>
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 text-xl transition"
                                    >
                                        ×
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {[
                                        { icon: HiHeart, label: "Pet Name",   value: petName },
                                        { icon: HiUser,  label: "Your Name",  value: user?.name || "" },
                                        { icon: HiMail,  label: "Your Email", value: user?.email || "" },
                                    ].map(({ icon: Icon, label, value }) => (
                                        <div key={label}>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                                            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50">
                                                <Icon className="text-gray-400 flex-shrink-0" />
                                                <span className="text-sm text-gray-500 truncate">{value}</span>
                                            </div>
                                        </div>
                                    ))}

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Pickup Date *</label>
                                        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-green-400">
                                            <HiCalendar className="text-gray-400 flex-shrink-0" />
                                            <input
                                                type="date"
                                                min={new Date().toISOString().split("T")[0]}
                                                value={formData.pickupDate}
                                                onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                                                required
                                                className="flex-1 text-sm outline-none bg-transparent text-gray-700"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Message *</label>
                                        <div className="flex gap-2 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-green-400">
                                            <HiClock className="text-gray-400 flex-shrink-0 mt-0.5" />
                                            <textarea
                                                rows={4}
                                                placeholder="Why would you be a great match?"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                required
                                                className="flex-1 text-sm outline-none resize-none bg-transparent text-gray-700 placeholder-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={adoptMutation.isPending}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2"
                                    >
                                        <HiHeart />
                                        {adoptMutation.isPending ? "Submitting…" : "Submit Application"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}