"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiHeart } from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function PetCard({ pet }) {
    const { user } = useAuth();
    const router = useRouter();

    
    const petName  = pet?.name     || pet?.petName;
    const petImage = pet?.image    || pet?.imageUrl;
    const petAge   = pet?.age;
    const petBreed = pet?.breed;
    const petSpecies = pet?.species;

    const handleAdopt = () => {
        if (!user) {
            toast.error("Please login to adopt a pet");
            router.push(`/login?from=/pets/${pet?._id}`);
            return;
        }
        router.push(`/pets/${pet?._id}`);
    };

    return (
        <div className="flex justify-center max-w-96 w-full mx-auto items-center p-5 bg-green-50 rounded-2xl min-h-[480px]">
            <div className="w-full bg-white rounded-2xl overflow-hidden border border-green-200 shadow-[0_2px_16px_0_rgba(34,197,94,0.10)]">

                <figure className="m-0 overflow-hidden rounded-t-xl">
                    {petImage && (
                        <img
                            src={petImage}
                            alt={petName}
                            className="w-full h-[220px] object-cover hover:scale-105 transition-transform duration-300"
                        />
                    )}
                </figure>

                <div className="p-5">
                    <h2 className="text-[18px] font-bold text-green-900 mb-1">
                        {petName}
                    </h2>

                    {(petSpecies || petBreed || petAge) && (
                        <p className="text-sm text-gray-500 mb-2">
                            {petSpecies} · {petBreed} · {petAge} yrs
                        </p>
                    )}

                    <p className="text-sm leading-relaxed text-green-700 mb-5 line-clamp-2">
                        {pet?.description}
                    </p>

                    <div className="flex gap-2">
                        <Link
                            href={`/pets/${pet._id}`}
                            className="flex-1 text-center text-[13px] font-medium py-2 border border-green-200 rounded-md hover:bg-green-100 transition"
                        >
                            View Details
                        </Link>
                        <button
                            onClick={handleAdopt}
                            className="shadow-md flex-1 text-xs py-2 flex items-center justify-center gap-1.5 bg-green-500 text-white hover:bg-green-600 rounded-md"
                        >
                            <HiHeart />
                            Adopt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}