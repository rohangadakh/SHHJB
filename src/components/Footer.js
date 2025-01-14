import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6">
      {/* Divider above the footer */}
      <div className="border-t border-zinc-700 mb-4"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} SHHJB Polytechnic
        </p>
        <div className="mt-2 flex justify-center items-center space-x-2">
          <p className="text-sm">Made by</p>
          <a
            href="https://github.com/rohangadakh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg hover:text-zinc-400 transition-colors flex items-center"
          >
            <img 
              src="https://img.icons8.com/3d-fluency/750/github.png" 
              alt="GitHub Icon" 
              className="w-6 h-6"
            />
            <span className="ml-2">@rohangadakh</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
