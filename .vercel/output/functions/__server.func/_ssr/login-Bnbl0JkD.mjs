import { o as __toESM } from "../_runtime.mjs";
import { D as require_react, E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Input, r as api, t as Button } from "./api-CC38_k8-.mjs";
import { P as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { T as EyeOff, p as Plus, w as Eye } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-BuKBvabm.mjs";
import { t as Checkbox } from "./checkbox-BejW3u6J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Bnbl0JkD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthService = class {
	static async login(email, password) {
		return (await api.post("/auth/login", {
			email,
			password
		})).data;
	}
};
function LoginPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [show, setShow] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const getErrorMessage = (err) => {
		if (typeof err === "object" && err && "response" in err) {
			const message = err.response?.data?.message;
			return Array.isArray(message) ? message.join(", ") : message;
		}
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setIsSubmitting(true);
		try {
			const user = await AuthService.login(email.trim(), password);
			queryClient.setQueryData(["user"], user);
			navigate({ to: user?.role === "patient" ? "/patient/dashboard" : "/dashboard" });
		} catch (err) {
			setError(getErrorMessage(err) ?? "Unable to sign in. Please check your email and password.");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-sky-100 px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-0 opacity-60",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				className: "absolute inset-0 h-full w-full",
				viewBox: "0 0 1200 800",
				fill: "none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
						id: "g1",
						cx: "50%",
						cy: "50%",
						r: "50%",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "rgb(14 165 233 / 0.18)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "rgb(14 165 233 / 0)"
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "200",
						cy: "200",
						r: "220",
						fill: "url(#g1)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "1000",
						cy: "600",
						r: "280",
						fill: "url(#g1)"
					}),
					Array.from({ length: 14 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: 80 + i * 80,
						cy: 400 + Math.sin(i) * 80,
						r: "4",
						fill: "rgb(14 165 233 / 0.3)"
					}, i))
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-white/60 bg-white/80 p-8 shadow-[0_30px_80px_-20px_rgba(14,165,233,0.25)] backdrop-blur-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex flex-col items-center text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
									className: "h-8 w-8",
									strokeWidth: 3
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl font-bold tracking-tight",
								children: "MediFlow"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Sign in to your account"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "space-y-4",
						children: [
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Email address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									placeholder: "you@clinic.com",
									value: email,
									onChange: (event) => setEmail(event.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "pwd",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pwd",
										type: show ? "text" : "password",
										value: password,
										onChange: (event) => setPassword(event.target.value),
										required: true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShow((s) => !s),
										className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
										children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {}), " Remember me"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "text-sm font-medium text-primary hover:underline",
									href: "#",
									children: "Forgot password?"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full h-11 text-base font-semibold",
								disabled: isSubmitting,
								children: isSubmitting ? "Signing in..." : "Sign in"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 text-center text-sm text-muted-foreground",
						children: [
							"New patient?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/register",
								className: "font-semibold text-primary hover:underline",
								children: "Create an account"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-center text-xs text-muted-foreground",
				children: "MediFlow © 2026 — All rights reserved"
			})]
		})]
	});
}
//#endregion
export { LoginPage as component };
