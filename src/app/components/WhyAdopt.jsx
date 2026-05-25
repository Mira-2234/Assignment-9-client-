import { FaHandsHelping, FaHeart, FaShieldAlt, FaSmile } from "react-icons/fa";


export default function WhyAdopt() {

const cards = [
  {
    icon: FaHeart,
    title: "Save a Life",
    text: "Every adoption saves a pet's life and creates space for another animal in need.",
    bg: "bg-pink-50",
    color: "text-pink-500",
  },
  {
    icon: FaShieldAlt,
    title: "Health Checked",
    text: "All pets are vaccinated and given a clean bill of health before listing.",
    bg: "bg-blue-50",
    color: "text-blue-500",
  },
  {
    icon: FaSmile,
    title: "Unconditional Love",
    text: "Adopted pets bond deeply and become incredibly loyal and loving companions.",
    bg: "bg-amber-50",
    color: "text-amber-500",
  },
  {
    icon: FaHandsHelping,
    title: "Ongoing Support",
    text: "Our team is always available to help you through the adjustment period and beyond.",
    bg: "bg-green-50",
    color: "text-green-500",
  },
];
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-gray-400 text-md font-semibold tracking-wider">Make a Difference</span>
          <h2 className="section-title mt-2 text-green-700 mb-3 font-bold text-5xl">Why Adopt a Pet?</h2>
             <p className="text-gray-500 max-w-xl mx-auto text-sm">Adoption is one of the most rewarding things you can do — for the animal and yourself.</p>
           </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
  {   cards.map((c) => {
       const Icon = c.icon;
   
       return (
         <div
           key={c.title}
           className={`${c.bg} rounded-2xl p-6 border border-white hover:shadow-md transition-shadow`}
         >
           <Icon className={`text-3xl mb-4 ${c.color}`} />
   
           <h3 className="font-bold text-gray-900 mb-2">{c.title}</h3>
   
           <p className="text-sm text-gray-600 leading-relaxed">
             {c.text}
           </p>
         </div>
       );
          })}
     </div>
      </div>
    </section>
  );
}
