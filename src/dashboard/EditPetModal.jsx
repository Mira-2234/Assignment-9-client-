"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiX } from "react-icons/hi";

const SPECIES = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Hamster", "Other"];
const VACC = ["Vaccinated", "Not Vaccinated", "Partially Vaccinated"];

export default function EditPetModal({ pet, onClose }) {
    const axios = useAxios();
    const qc = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm({
        defaultValues: {
            name:              pet.name || pet.petName,
            species:           pet.species,
            breed:             pet.breed,
            age:               pet.age,
            gender:            pet.gender,
            image:             pet.image || pet.imageUrl,
            healthStatus:      pet.healthStatus,
            vaccinationStatus: pet.vaccinationStatus,
            location:          pet.location,
            adoptionFee:       pet.adoptionFee,
            description:       pet.description,
        },
    });

    const mutation = useMutation({
        mutationFn: (data) =>
            axios.put(`/pets/${pet._id}`, {
                ...data,
                age:         Number(data.age),
                adoptionFee: Number(data.adoptionFee),
            }),
        onSuccess: () => {
            toast.success("Pet updated successfully! 🐾");
            qc.invalidateQueries(["myListings"]);
            onClose();
        },
        onError: (err) =>
            toast.error(err.response?.data?.message || "Update failed"),
    });

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-900">Update Pet</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition"
                    >
                        <HiX size={18} />
                    </button>
                </div>

                {/* Form */}
                <div className="overflow-y-auto flex-1 p-6">
                    <form
                        onSubmit={handleSubmit((data) => mutation.mutate(data))}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Pet Name *
                                </label>
                                <input
                                    {...register("name", { required: true })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Species *
                                </label>
                                <select
                                    {...register("species", { required: true })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                >
                                    {SPECIES.map((s) => (
                                        <option key={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Breed *
                                </label>
                                <input
                                    {...register("breed", { required: true })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Age (years) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    {...register("age", { required: true })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Gender *
                                </label>
                                <select
                                    {...register("gender", { required: true })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Adoption Fee ($) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    {...register("adoptionFee", { required: true })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Health Status *
                                </label>
                                <input
                                    {...register("healthStatus", { required: true })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Vaccination Status *
                                </label>
                                <select
                                    {...register("vaccinationStatus", { required: true })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                >
                                    {VACC.map((v) => (
                                        <option key={v}>{v}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Image URL
                            </label>
                            <input
                                type="url"
                                {...register("image")}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Location *
                            </label>
                            <input
                                {...register("location", { required: true })}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Description *
                            </label>
                            <textarea
                                rows={3}
                                {...register("description", { required: true })}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-1">
                            <button
                                type="submit"
                                disabled={isSubmitting || mutation.isPending}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
                            >
                                {isSubmitting || mutation.isPending
                                    ? "Saving…"
                                    : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}