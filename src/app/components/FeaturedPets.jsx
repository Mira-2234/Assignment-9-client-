import React from 'react'
import PetCard from './PetCard'

export default async function FeaturedPets() {

   const res = await fetch(`https://assignment-9-server-1-cxv0.onrender.com/pets`, {
    cache: "no-store"
});

if (!res.ok) {
    console.error("Fetch failed:", res.status);
    return <div>Failed to load pets</div>;
}

const data = await res.json();
const pets = Array.isArray(data) ? data : [];

    const pets = await res.json();

    console.log(pets);

    return (
        <div className='py-10'>

            <div className="text-center mb-12">
                <span className="text-primary-600 text-xl font-semibold text-gray-400">
                    Ready for Adoption
                </span>

                <h2 className="section-title mt-2 text-6xl text-green-500 font-bold mb-3">
                    Featured Pets
                </h2>

                <p className="text-gray-500 max-w-xl mx-auto text-sm">
                    Meet adorable friends looking for their forever home.
                </p>
            </div>

            <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>

                {
                    Array.isArray(pets) &&
                    pets.slice(0, 6).map((pet, ind) => (
                        <PetCard
                            pet={pet}
                            key={pet._id || ind}
                        />
                    ))
                }

            </div>

        </div>
    )
}