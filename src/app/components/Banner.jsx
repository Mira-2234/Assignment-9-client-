import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";

const Banner = () => {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden mt-15 group">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&q=80')`,
        }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 w-full">
        <div className="max-w-xl">

          {/* Tag pill */}
          <span className="inline-block border border-green-400 text-white text-[10px] font-semibold tracking-widest uppercase px-3 py-2 rounded-full mb-6 backdrop-blur-sm">
            Over 500 pets need a home
          </span>

          {/* Heading */}
          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-md">
            Give a Pet a <br />
            <span className="text-green-400">Loving Home</span>
          </h1>

          {/* Description */}
          <p className="text-base lg:text-lg text-gray-200 leading-relaxed mb-10 max-w-md">
            Browse hundreds of dogs, cats, birds, and more waiting for their
            forever family. Every adoption changes two lives — yours and theirs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/pets"
              className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-800 text-white font-semibold rounded-md text-sm transition-all duration-200 shadow-lg"
            >
              Adopt Now
              <HiArrowRight className="text-base" />
            </Link>
            <Link
              href="/dashboard/add-pet"
              className="px-5 py-3 border-2 border-white/70 hover:border-white text-white font-semibold rounded-md text-sm transition-all duration-200 backdrop-blur-sm hover:bg-white/10"
            >
              List a Pet
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-14">
            {[
              { num: "2,400+", label: "Happy Adoptions" },
              { num: "150+",   label: "Partner Shelters" },
              { num: "98%",    label: "Satisfaction Rate" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white drop-shadow">
                  {stat.num}
                </div>
                <div className="text-xs text-gray-300 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    
    </section>
  );
};

export default Banner;