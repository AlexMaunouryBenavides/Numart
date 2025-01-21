import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../Context/AuthContext";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const { session, signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signUpNewUser(email, password);
      if (result.success) {
        navigate("/signin");
      }
    } catch (error) {
      setError("an error occured", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSignUp} className="max-w-md m-auto text-slate-400">
        <div className="flex flex-col gap-1 py-6">
          <h2 className="text-2xl">Sign up Today !</h2>
          <p className="text-[14px]">
            Already have an account ?
            <Link to="/signin">
              <span className="text-blue-400">Sign in</span>
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <input onChange={(e) => setEmail(e.target.value)} className="p-3" type="email" placeholder="E-mail..." />
          <input onChange={(e) => setPassword(e.target.value)} className="p-3" type="password" placeholder="Password..." />
          <button type="submit" disabled={loading} className="mt-6 w-full bg-slate-600 p-3 text-xl text-white">
            Sign up
          </button>
          {error && <p className="text-red-500 text-center p-3">{error} </p>}
        </div>
      </form>
    </div>
  );
}

export default SignUp;
