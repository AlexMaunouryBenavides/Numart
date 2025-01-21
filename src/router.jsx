import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignIn from "./Views/SignIn";
import SignUp from "./Views/SignUp";
import Dashboard from "./Views/Dashboard";
import PrivateRoute from "./Views/PrivateRoute";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

const Root = ({ children }) => (
	<>
		<Header />
		{children}
		<Footer />
	</>
);

export const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Root>
				<App />
			</Root>
		),
	},
	{
		path: "/signup",
		element: (
			<Root>
				<SignUp />
			</Root>
		),
	},
	{
		path: "/signin",
		element: (
			<Root>
				<SignIn />
			</Root>
		),
	},
	{
		path: "/dashboard",
		element: (
			<PrivateRoute>
				<Root>
					<Dashboard />
				</Root>
			</PrivateRoute>
		),
	},
]);
