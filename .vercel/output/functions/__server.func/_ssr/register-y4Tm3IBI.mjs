import { o as __toESM } from "../_runtime.mjs";
import { D as require_react, E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as cn, n as Input, t as Button } from "./api-CC38_k8-.mjs";
import { P as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { B as UserRound, K as CircleCheck, R as ArrowRight, T as EyeOff, _ as MessageCircle, m as Phone, p as Plus, w as Eye, y as Mail, z as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-BuKBvabm.mjs";
import { t as Patient } from "./patient.service-CCdChYiv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-y4Tm3IBI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RegisterPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [step, setStep] = (0, import_react.useState)("contact");
	const [show, setShow] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [contactId, setContactId] = (0, import_react.useState)("");
	const [matchedPatients, setMatchedPatients] = (0, import_react.useState)([]);
	const [contactHasPassword, setContactHasPassword] = (0, import_react.useState)(false);
	const [selectedPatientId, setSelectedPatientId] = (0, import_react.useState)("");
	const [claimPassword, setClaimPassword] = (0, import_react.useState)("");
	const [contact, setContact] = (0, import_react.useState)({
		phone: "",
		whatsapp: "",
		email: ""
	});
	const [profile, setProfile] = (0, import_react.useState)({
		first: "",
		last: "",
		age: "",
		city: "",
		gender: "M",
		password: ""
	});
	const selectedPatient = matchedPatients.find((patient) => patient._id === selectedPatientId);
	const displayName = selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : profile.first || "patient";
	const finishRegistration = (patient) => {
		queryClient.setQueryData(["user"], patient);
		setDone(true);
	};
	const getErrorMessage = (err) => {
		if (typeof err === "object" && err && "response" in err) {
			const message = err.response?.data?.message;
			return Array.isArray(message) ? message.join(", ") : message;
		}
	};
	const handleContactSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setIsSubmitting(true);
		try {
			const response = await Patient.addOrSearchContact({
				phone: contact.phone.trim(),
				whatsappNo: contact.whatsapp.trim(),
				email: contact.email.trim()
			});
			const patients = response.patients ?? [];
			const hasExistingPassword = Boolean(response.contactHasPassword) || patients.some((patient) => patient.hasPassword);
			const nextContactId = response.contact?._id ?? response.newContact?._id ?? response.contactId ?? patients[0]?.contactId ?? "";
			if (!nextContactId) throw new Error("Contact saved, but no contact id was returned.");
			setContactId(nextContactId);
			setMatchedPatients(patients);
			setContactHasPassword(hasExistingPassword);
			setSelectedPatientId(patients[0]?._id ?? "");
			setStep(patients.length > 0 ? "existing" : "profile");
		} catch (err) {
			setError(getErrorMessage(err) ?? (err instanceof Error ? err.message : "Unable to check contact information."));
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleProfileSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setIsSubmitting(true);
		try {
			finishRegistration((await Patient.selfRegister({
				contactId,
				firstName: profile.first.trim(),
				lastName: profile.last.trim(),
				age: Number(profile.age),
				city: profile.city.trim(),
				gender: profile.gender,
				relation: "self",
				password: profile.password
			})).patient);
		} catch (err) {
			setError(getErrorMessage(err) ?? "Unable to create your account.");
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleExistingPatientSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setIsSubmitting(true);
		try {
			finishRegistration((await Patient.setPassword(selectedPatientId, contactId, claimPassword)).patient);
		} catch (err) {
			setError(getErrorMessage(err) ?? "Unable to create a password for this patient.");
		} finally {
			setIsSubmitting(false);
		}
	};
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center animate-in zoom-in-95 duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 animate-in zoom-in-50 duration-500",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-8 w-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold",
				children: "Account Created!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					"Welcome to MediFlow, ",
					displayName,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-5",
				onClick: () => navigate({ to: "/patient/dashboard" }),
				children: "Continue to Portal"
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						className: "h-7 w-7",
						strokeWidth: 3
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Create your account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: step === "contact" ? "Contact information" : step === "existing" ? "Select your patient record" : "Personal details"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold ring-4 ring-primary/15",
						children: "1"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium",
						children: "Contact"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-px flex-1 transition-colors", step !== "contact" ? "bg-primary" : "bg-border") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 items-center gap-2 justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("text-xs font-medium", step !== "contact" ? "text-foreground" : "text-muted-foreground"),
						children: step === "existing" ? "Patient" : "Profile"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("grid h-7 w-7 place-items-center rounded-full text-xs font-semibold transition-all", step !== "contact" ? "bg-primary text-primary-foreground ring-4 ring-primary/15" : "bg-muted text-muted-foreground"),
						children: "2"
					})]
				})
			]
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
			children: error
		}),
		step === "contact" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleContactSubmit,
			className: "space-y-4 animate-in fade-in slide-in-from-right-3 duration-300",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldWithIcon, {
					icon: Phone,
					label: "Phone number",
					type: "tel",
					placeholder: "+1 (555) 123-4567",
					value: contact.phone,
					onChange: (v) => setContact({
						...contact,
						phone: v
					}),
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldWithIcon, {
					icon: MessageCircle,
					label: "WhatsApp number",
					type: "tel",
					placeholder: "+1 (555) 123-4567",
					value: contact.whatsapp,
					onChange: (v) => setContact({
						...contact,
						whatsapp: v
					}),
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldWithIcon, {
					icon: Mail,
					label: "Email address",
					type: "email",
					placeholder: "you@example.com",
					value: contact.email,
					onChange: (v) => setContact({
						...contact,
						email: v
					}),
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "w-full h-11",
					disabled: isSubmitting,
					children: [
						isSubmitting ? "Checking..." : "Continue",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-center text-sm text-muted-foreground",
					children: ["Already have an account? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "font-semibold text-primary hover:underline",
						children: "Sign in"
					})]
				})
			]
		}) : step === "existing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleExistingPatientSubmit,
			className: "space-y-4 animate-in fade-in slide-in-from-right-3 duration-300",
			children: [
				contactHasPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900",
					children: "This contact already has a portal account. Please sign in instead of creating another profile."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground",
					children: "Choose one of the existing patient records to create a password, or create a new profile for this contact."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: matchedPatients.map((patient) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setSelectedPatientId(patient._id),
						className: cn("flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all", selectedPatientId === patient._id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate text-sm font-semibold",
									children: [
										patient.firstName,
										" ",
										patient.lastName
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										patient.patientId,
										" - ",
										patient.age,
										" years - ",
										patient.gender === "F" ? "Female" : "Male"
									]
								})]
							}),
							patient.hasPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700",
								children: "Account active"
							})
						]
					}, patient._id))
				}),
				!contactHasPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordField, {
					show,
					setShow,
					value: claimPassword,
					onChange: setClaimPassword
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => setStep("contact"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back"]
					}), !contactHasPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						className: "flex-1 h-11",
						onClick: () => setStep("profile"),
						children: "New profile"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "flex-1 h-11",
						disabled: isSubmitting || !selectedPatientId,
						children: isSubmitting ? "Creating..." : "Create password"
					})] })]
				}),
				contactHasPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "w-full h-11",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						children: "Go to sign in"
					})
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleProfileSubmit,
			className: "space-y-4 animate-in fade-in slide-in-from-right-3 duration-300",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "First name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1.5",
						value: profile.first,
						onChange: (e) => setProfile({
							...profile,
							first: e.target.value
						}),
						required: true
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Last name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1.5",
						value: profile.last,
						onChange: (e) => setProfile({
							...profile,
							last: e.target.value
						}),
						required: true
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Age" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1.5",
						type: "number",
						min: "0",
						max: "120",
						value: profile.age,
						onChange: (e) => setProfile({
							...profile,
							age: e.target.value
						}),
						required: true
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "City" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1.5",
						value: profile.city,
						onChange: (e) => setProfile({
							...profile,
							city: e.target.value
						}),
						required: true
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Gender" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1.5 grid grid-cols-2 gap-2",
					children: [["M", "Male"], ["F", "Female"]].map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setProfile({
							...profile,
							gender: value
						}),
						className: cn("rounded-lg border px-3 py-2 text-sm font-medium transition-all", profile.gender === value ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/40"),
						children: label
					}, value))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordField, {
					show,
					setShow,
					value: profile.password,
					onChange: (password) => setProfile({
						...profile,
						password
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => setStep("contact"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "flex-1 h-11",
						disabled: isSubmitting,
						children: isSubmitting ? "Creating..." : "Create account"
					})]
				})
			]
		})
	] });
}
function FieldWithIcon({ icon: Icon, label, ...props }) {
	const { onChange, value, ...rest } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mt-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "pl-9",
			value,
			onChange: (e) => onChange(e.target.value),
			...rest
		})]
	})] });
}
function PasswordField({ show, setShow, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mt-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: show ? "text" : "password",
			value,
			onChange: (e) => onChange(e.target.value),
			required: true,
			minLength: 6
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setShow((s) => !s),
			className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
			children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
		})]
	})] });
}
function Shell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-sky-100 px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-white/60 bg-white/85 p-8 shadow-[0_30px_80px_-20px_rgba(14,165,233,0.25)] backdrop-blur-xl",
				children
			})
		})
	});
}
//#endregion
export { RegisterPage as component };
