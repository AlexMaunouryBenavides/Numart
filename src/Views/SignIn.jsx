import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../Context/AuthContext";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const { session, signInUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInUser(email, password);
      if (result.success) {
        navigate("/");
      }
    } catch (error) {
      setError("an error occured", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSignIn} className="max-w-md m-auto text-slate-400">
        <div className="flex flex-col gap-1 py-6">
          <h2 className="text-2xl">Sign in Today !</h2>
          <p className="text-[14px]">
            Don't have an account ?
            <Link to="/signup">
              <span className="text-blue-400">Sign up</span>
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <input onChange={(e) => setEmail(e.target.value)} className="p-3" type="email" placeholder="E-mail..." />
          <input onChange={(e) => setPassword(e.target.value)} className="p-3" type="password" placeholder="Password..." />
          <button type="submit" disabled={loading} className="mt-6 w-full bg-slate-600 p-3 text-xl ">
            Sign in
          </button>
          {error && <p className="text-red-500 text-center p-3">{error} </p>}
        </div>
      </form>
    </div>
  );
}

export default SignIn;
