"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HiSearch } from "react-icons/hi";
import PetCard from "@/app/components/PetCard";

const SPECIES = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Hamster", "Other"];

export default function AllPetsPage() {
    const [search,    setSearch]    = useState("");
    const [debounced, setDebounced] = useState("");
    const [species,   setSpecies]   = useState([]);
    const [sort,      setSort]      = useState("");

    useEffect(() => {
        const t = setTimeout(() => setDebounced(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    const { data: pets = [], isLoading } = useQuery({
        queryKey: ["allPets", debounced, species, sort],
        queryFn: () =>
            axios.get("/api/pets", {
                params: {
                    ...(debounced && { search: debounced }),
                    ...(species.length && { species: species.join(",") }),
                    ...(sort && { sort }),
                },
            }).then((r) => r.data),
    });

    const toggle = (sp) =>
        setSpecies((prev) =>
            prev.includes(sp) ? prev.filter((s) => s !== sp) : [...prev, sp]
        );

    return (
        <div className="min-h-screen bg-gray-50 mt-15">
            <div className="bg-white border-b border-gray-100 py-5 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900">All Pets</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {pets.length} pets available for adoption
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filter Bar */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <div className="relative flex-1">
                            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="Search by name, breed, location…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {/* <select
                            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 sm:w-44"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="">Latest First</option>
                            <option value="fee_asc">Fee: Low to High</option>
                            <option value="fee_desc">Fee: High to Low</option>
                            <option value="age_asc">Youngest First</option>
                            <option value="age_desc">Oldest First</option>
                        </select> */}
                    </div>

                    {/* Species chips */}
                    <div className="flex flex-wrap gap-2">
                        {SPECIES.map((sp) => (
                            <button
                                key={sp}
                                onClick={() => toggle(sp)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                                    species.includes(sp)
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
                                }`}
                            >
                                {sp}
                            </button>
                        ))}
                        {species.length > 0 && (
                            <button
                                onClick={() => setSpecies([])}
                                className="text-xs text-red-500 hover:underline ml-1"
                            >
                                Clear ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Pet Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 rounded-full border-4 border-green-100 border-t-green-600 animate-spin" />
                    </div>
                ) : pets.length === 0 ? (
                    <div className="text-center py-24">
                        <span className="text-6xl block mb-4">🐾</span>
                        <p className="text-gray-400 font-medium">
                            No pets found. Try a different search.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {pets.map((pet) => (
                            <PetCard key={pet._id} pet={pet} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}