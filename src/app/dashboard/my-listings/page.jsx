"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loading from "@/app/loading";
import RequestsModal from "@/dashboard/RequestsModal";
import EditPetModal from "@/dashboard/EditPetModal";
import { HiEye, HiPencil, HiTrash, HiCollection } from "react-icons/hi";

export default function MyListingsPage() {
  const axios = useAxios();
  const qc = useQueryClient();
  const [reqPet, setReqPet] = useState(null);
  const [editPet, setEditPet] = useState(null);

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["myListings"],
    queryFn: () => axios.get("/pets/my-listings").then((r) => r.data),
  });

  const delMutation = useMutation({
    mutationFn: (id) => axios.delete(`/pets/${id}`),
    onSuccess: () => {
      toast.success("Listing deleted");
      qc.invalidateQueries(["myListings"]);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Delete failed"),
  });

  const handleDelete = (pet) =>
    Swal.fire({
      title: `Delete ${pet.name}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    }).then((r) => r.isConfirmed && delMutation.mutate(pet._id));

  const stats = {
    total: pets.length,
    available: pets.filter((p) => p.status === "available").length,
    adopted: pets.filter((p) => p.status === "adopted").length,
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-8 mt-10">

     
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-green-700">
          My Listings 🐾
        </h1>
        <p className="text-gray-500 mt-2">
          Manage all your pets in one place
        </p>
      </div>

 
      <div className="grid grid-cols-3 gap-5 mb-10">
        {[
          { label: "Total", value: stats.total, cls: "bg-green-50 text-green-700" },
          { label: "Available", value: stats.available, cls: "bg-emerald-50 text-emerald-700" },
          { label: "Adopted", value: stats.adopted, cls: "bg-green-100 text-green-800" },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.cls} rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition`}
          >
            <div className="text-3xl font-extrabold">{s.value}</div>
            <div className="text-xs font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      
      {pets.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-green-100 shadow-sm">
          <HiCollection className="mx-auto text-green-200 text-7xl mb-4" />
          <h3 className="text-xl font-bold text-gray-900">
            No listings yet
          </h3>
          <p className="text-gray-500 mt-1 mb-6">
            Start by adding your first pet
          </p>

          <Link
            href="/dashboard/add-pet"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
          >
            Add Your First Pet
          </Link>
        </div>
      ) : (
       
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white border border-green-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />

                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                    pet.status === "adopted"
                      ? "bg-gray-800 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {pet.status === "adopted" ? "Adopted" : "Available"}
                </span>
              </div>

            
              <div className="p-5">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {pet.name}
                  </h3>
                  <span className="text-green-600 font-bold text-sm">
                    ${pet.adoptionFee}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-5">
                  {pet.species} • {pet.breed}
                </p>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2">

                  <button
                    onClick={() => setReqPet(pet)}
                    className="bg-green-50 text-green-700 text-xs font-semibold py-2 rounded-xl hover:bg-green-100 transition flex items-center justify-center gap-1"
                  >
                    <HiCollection /> Requests
                  </button>

                  <button
                    onClick={() => setEditPet(pet)}
                    className="bg-blue-50 text-blue-700 text-xs font-semibold py-2 rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-1"
                  >
                    <HiPencil /> Edit
                  </button>

                  <Link
                    href={`/pets/${pet._id}`}
                    className="bg-gray-50 text-gray-700 text-xs font-semibold py-2 rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-1"
                  >
                    <HiEye /> View
                  </Link>

                  <button
                    onClick={() => handleDelete(pet)}
                    className="bg-red-50 text-red-600 text-xs font-semibold py-2 rounded-xl hover:bg-red-100 transition flex items-center justify-center gap-1"
                  >
                    <HiTrash /> Delete
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {reqPet && (
        <RequestsModal pet={reqPet} onClose={() => setReqPet(null)} />
      )}

      {editPet && (
        <EditPetModal pet={editPet} onClose={() => setEditPet(null)} />
      )}
    </div>
  );
}