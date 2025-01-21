import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="py-5 max-w-7xl m-auto ">
      <Link to={"/"}>
        <h1 className=" text-4xl text-center font-limelight">Numart</h1>
      </Link>
      <div className="flex flex-row-reverse gap-5 ">
        <Link to={"/signin"}>
          <p className=" border p-3 w-fit  ">Connexion</p>
        </Link>
        <Link to={"/dashboard"}>
          <p className=" border p-3 w-fit  ">Dashboard</p>
        </Link>
      </div>
    </div>
  );
}

export default Header;
