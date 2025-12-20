import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-linear-to-r from-blue-200 to-purple-300  py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <span className="text-2xl font-extrabold tracking-tight select-none">
              <span className="font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                FinBot
              </span>
            </span>
          </div>

          <p className="text-sm text-gray-500 font-medium">
            © 2025 FinBot. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex items-center gap-5">
            {/* GitHub */}
            <a
              href="https://github.com/Ketangathibandhe"
              target="_blank"
              className="text-gray-400 hover:text-gray-900 transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/ketangathibandhe/"
              target="_blank"
              className="text-gray-400 hover:text-blue-700 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>

            {/* Gmail */}
            <a
              href="mailto:ketangathibandhe04@gmail.com"
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
