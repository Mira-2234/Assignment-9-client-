export default function SuccessStories() {
  const stories = [
    { name:"Ahmed Family", pet:"Max",    quote:"Max completely transformed our home. Our kids absolutely love him and the adoption was incredibly smooth.", color:"#c93050", date:"3 months ago" },
    { name:"Sarah K.",     pet:"Luna",   quote:"Luna curls up on my lap every evening. PawHome made everything so easy. Can't imagine life without her.",   color:"#7c3aed", date:"1 month ago"  },
    { name:"Khan Family",  pet:"Tweety", quote:"Our little Tweety sings every morning. The kids learned so much about responsibility. Highly recommend!",    color:"#d97706", date:"2 weeks ago"  },
  ];
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-gray-400 text-xs font-semibold  tracking-wider">Happy Tails</span>
          <h2 className="section-title mt-2 text-5xl text-green-700 font-bold mb-3">Success Stories</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">Hear from families who found their perfect pet through PawHome.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {stories.map(s=>(
            <div key={s.name} className="card p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{background:s.color}}>
                  {s.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.date}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed italic flex-1">{s.quote}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="badge bg-primary-50 text-primary-600 text-xs font-semibold">Adopted {s.pet}</span>
                <span className="text-amber-400 text-sm tracking-widest">★★★★★</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
