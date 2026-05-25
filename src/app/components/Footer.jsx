
import Link from "next/link";
import { FaPaw, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <FaPaw className="text-primary-400 text-2xl" />
              <span className="font-heading text-xl text-white font-bold">
                Paw<span className="text-primary-400">Home</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Connecting loving homes with pets who need them. Every adoption
              makes a difference.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: <FaFacebook />, href: "#" },
                { icon: <FaInstagram />, href: "#" },
                { icon: <FaTwitter />, href: "#" },
                { icon: <FaYoutube />, href: "#" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-white font-semibold mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/pets", label: "All Pets" },
                { to: "/dashboard/add-pet", label: "List a Pet" },
                { to: "/dashboard/my-requests", label: "My Requests" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    href={link.to}
                    className="text-sm text-gray-400 hover:text-primary-400 transition flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary-500 inline-block" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pet Categories */}
          <div>
            <h4 className="font-heading text-white font-semibold mb-5">
              Browse Pets
            </h4>
            <ul className="space-y-3">
              {["Dogs", "Cats", "Birds", "Rabbits"].map(
                (pet) => (
                  <li key={pet}>
                    <Link
                      href={`/pets?species=${pet.slice(0, -1)}`}
                      className="text-sm text-gray-400 hover:text-primary-400 transition flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary-500 inline-block" />
                      {pet}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-white font-semibold mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <HiLocationMarker className="text-primary-400 text-lg mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">
                  123 Paw Street, Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <HiPhone className="text-primary-400 text-lg shrink-0" />
                <span className="text-sm text-gray-400">+880 1234 567890</span>
              </li>
              <li className="flex items-center gap-3">
                <HiMail className="text-primary-400 text-lg shrink-0" />
                <span className="text-sm text-gray-400">
                  hello@pawhome.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} PawHome. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300 transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
