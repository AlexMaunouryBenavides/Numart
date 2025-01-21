import React from "react";
import { socials } from "../Data/socialsData.js";

function Footer() {
  return (
    <div className="flex justify-between gap-5 py-5 max-w-7xl m-auto">
      <div className="flex gap-3">
        {socials.map((social) => (
          <img className="h-5" key={social.id} src={social.img} alt={social.alt} />
        ))}
      </div>
      <p className=" text-sm">Coder par Alex &copy; 2025 </p>
    </div>
  );
}

export default Footer;
