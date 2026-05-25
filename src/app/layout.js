import Navbar from "./components/Navbar";
import "./globals.css";
import Providers from "./Providers";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <Providers>

          <Navbar />

          {children}

          {/* Toast */}
          <Toaster
            position="top-right"
            reverseOrder={false}
          />

        </Providers>
      </body>
    </html>
  );
}