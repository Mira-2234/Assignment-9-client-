"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiPhotograph } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuth } from "@/context/AuthContext";
import useAxios from "@/hooks/useAxios";
import imageUpload from "@/utils/imageUpload";

const SPECIES = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Hamster", "Other"];
const VACC = ["Vaccinated", "Not Vaccinated", "Partially Vaccinated"];

export default function AddPetPage() {
  const { user } = useAuth();
  const axios = useAxios();
  const router = useRouter();

  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);

  // ✅ FIXED useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // ✅ API mutation
  const mutation = useMutation({
    mutationFn: async (data) => {
      return await axios.post("/pets", data);
    },

    onSuccess: () => {
      toast.success("Pet listed successfully 🐾");
      reset();
      setPreview("");
      setFile(null);
      router.push("/dashboard/my-listings");
    },

    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to add pet");
    },
  });

  // ✅ Submit handler
  const onSubmit = async (data) => {
    let image = data.imageUrl;

    if (file) {
      try {
        image = await imageUpload(file);
      } catch (err) {
        toast.error("Image upload failed");
        return;
      }
    }

    if (!image) {
      toast.error("Please provide an image");
      return;
    }

    mutation.mutate({
      ...data,
      image,
      age: Number(data.age),
      adoptionFee: Number(data.adoptionFee),
      ownerName: user?.displayName || "Owner",
      ownerEmail: user?.email,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 py-10 px-4 ">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-green-700">
            Add a Pet 
          </h1>
          <p className="text-gray-500 mt-2">
            Fill in details to list a pet for adoption.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-2xl border border-green-100 rounded-3xl p-8 space-y-6"
        >

          {/* Image Upload */}
          <div>
            <label className="block font-semibold text-gray-700 mb-3">
              Pet Image
            </label>

            <div className="flex flex-col md:flex-row gap-5 items-start">

              <label className="w-32 h-32 border-2 border-dashed border-green-300 rounded-2xl flex items-center justify-center cursor-pointer bg-green-50 overflow-hidden">

                {preview ? (
                  <img
                    src={preview}
                    className="w-full h-full object-cover"
                    alt="preview"
                  />
                ) : (
                  <div className="text-green-500 flex flex-col items-center">
                    <HiPhotograph size={32} />
                    <span className="text-xs">Upload</span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      setFile(f);
                      setPreview(URL.createObjectURL(f));
                    }
                  }}
                />
              </label>

              <input
                type="url"
                placeholder="Image URL"
                {...register("imageUrl")}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input placeholder="Pet Name" {...register("name", { required: true })} className="input" />
            <input placeholder="Breed" {...register("breed", { required: true })} className="input" />
            <input type="number" placeholder="Age" {...register("age", { required: true })} className="input" />
            <input type="number" placeholder="Adoption Fee" {...register("adoptionFee", { required: true })} className="input" />
            <input placeholder="Health Status" {...register("healthStatus", { required: true })} className="input" />
            <input placeholder="Location" {...register("location", { required: true })} className="input" />

            {/* Species */}
            <select {...register("species", { required: true })} className="input">
              <option value="">Select Species</option>
              {SPECIES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            {/* Gender */}
            <select {...register("gender", { required: true })} className="input">
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            {/* Vaccination */}
            <select {...register("vaccinationStatus", { required: true })} className="input md:col-span-2">
              <option value="">Vaccination Status</option>
              {VACC.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <textarea
            rows={5}
            placeholder="Description..."
            {...register("description", { required: true, minLength: 30 })}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400"
          />

          {/* Email */}
          <input
            value={user?.email || ""}
            readOnly
            className="w-full bg-gray-100 border rounded-xl px-4 py-3"
          />

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
            >
              {mutation.isPending ? "Saving..." : "List Pet"}
            </button>

            <button
              type="button"
              onClick={() => {
                reset();
                setPreview("");
                setFile(null);
              }}
              className="px-6 border rounded-xl"
            >
              Reset
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}