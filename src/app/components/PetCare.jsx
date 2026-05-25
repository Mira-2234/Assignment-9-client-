export default function PetCareTips() {
  const tips = [
    { e:"🥗", title:"Balanced Nutrition",  cat:"Health",    text:"Feed species-appropriate food. Avoid table scraps and always provide fresh, clean water." },
    { e:"🏃", title:"Regular Exercise",    cat:"Wellness",  text:"Dogs need daily walks; cats love interactive toys. Exercise keeps pets fit and mentally stimulated." },
    { e:"🩺", title:"Vet Checkups",        cat:"Medical",   text:"Schedule annual visits, keep vaccinations current, and address health concerns early." },
    { e:"🛁", title:"Grooming Routine",    cat:"Grooming",  text:"Regular brushing, nail trims, and baths keep your pet comfortable and healthy." },
    { e:"🏠", title:"Safe Environment",    cat:"Safety",    text:"Pet-proof your home by securing toxic plants, chemicals, and small objects." },
    { e:"❤️", title:"Love & Socialisation",cat:"Behaviour", text:"Spend quality time daily and build a deep bond through patience and consistency." },
  ];
  return (
    <section className="py-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Expert Advice</span>
          <h2 className="section-title text-5xl text-green-700 font-bold mt-2 mb-3">Pet Care Tips</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">Give your new companion the best life with these expert-backed tips.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tips.map(t=>(
            <div key={t.title} className="bg-white rounded-2xl p-6 border shadow-md border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{t.e}</span>
                <div>
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{t.cat}</span>
                  <h3 className="font-bold text-gray-900 mt-2 mb-1 group-hover:text-primary-600 transition">{t.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
