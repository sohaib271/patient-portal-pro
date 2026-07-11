import { o as __toESM } from "../_runtime.mjs";
import { D as require_react, E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Input, t as Button } from "./api-CC38_k8-.mjs";
import { f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Clock, P as CalendarClock, d as Search, h as Pencil, o as Trash2, p as Plus } from "../_libs/lucide-react.mjs";
import { c as useDoctorProfile, d as useUser, l as useDoctors, n as Avatar, o as StatusBadge, s as useCreateDoctor, t as AppShell, u as useUpdateDoctor } from "./app-shell-BJX_0vmy.mjs";
import { t as Card } from "./card-z5dfXztG.mjs";
import { t as Label } from "./label-BuKBvabm.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-n4sYgwkN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/doctors-B-6UQwF6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DoctorsLayout() {
	if (useRouterState({ select: (s) => s.location.pathname }) !== "/doctors") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoctorsList, {});
}
function DoctorsList() {
	const [query, setQuery] = (0, import_react.useState)("");
	const { user } = useUser();
	const { data: doctors = [], isLoading, isError } = useDoctors();
	if (user?.role === "doctor") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MySchedulePage, { userId: user._id });
	const filteredDoctors = doctors.filter((doctor) => {
		const user = getDoctorUser(doctor);
		return [
			doctor._id,
			doctor.speciality,
			user?.firstName,
			user?.lastName,
			user?.phone,
			user?.email
		].filter(Boolean).join(" ").toLowerCase().includes(query.trim().toLowerCase());
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		breadcrumbs: [{
			label: "Dashboard",
			to: "/dashboard"
		}, { label: "Doctors" }],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Doctors"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [doctors.length, " medical staff registered"]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddDoctorDialog, {})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search by name, ID, or phone...",
						className: "pl-9",
						value: query,
						onChange: (event) => setQuery(event.target.value)
					})]
				}),
				isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
					children: "Unable to load doctors."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-left text-xs font-medium uppercase tracking-wide text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 pr-4",
									children: "Doctor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 pr-4",
									children: "Specialty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 pr-4",
									children: "Phone"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 pr-4",
									children: "Checkup Time"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 pr-4",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-3 pr-4" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-8 text-center text-muted-foreground",
								colSpan: 6,
								children: "Loading doctors..."
							}) }) : filteredDoctors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-8 text-center text-muted-foreground",
								colSpan: 6,
								children: "No doctors found."
							}) }) : filteredDoctors.map((doctor) => {
								const user = getDoctorUser(doctor);
								const userId = getDoctorUserId(doctor);
								const name = getDoctorName(doctor);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-muted/40 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { initials: getInitials(name) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium",
													children: name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground",
													children: user?.email ?? "No email"
												})] })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4 text-muted-foreground",
											children: doctor.speciality
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4 text-muted-foreground",
											children: user?.phone ?? "-"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3 pr-4 text-muted-foreground",
											children: [doctor.averageCheckupTime, " min"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: doctor.isAvailable === false ? "Inactive" : "Available" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 pr-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditDoctorDialog, { doctor }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/doctors/$id",
													params: { id: userId },
													className: "text-sm font-medium text-primary hover:underline",
													children: "View Profile"
												})]
											})
										})
									]
								}, doctor._id);
							})
						})]
					})
				})
			]
		})]
	});
}
function MySchedulePage({ userId }) {
	const { data: doctor, isLoading, isError } = useDoctorProfile(userId);
	const updateDoctor = useUpdateDoctor();
	const [error, setError] = (0, import_react.useState)("");
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		speciality: "",
		averageCheckUpTime: "15",
		isAvailable: true
	});
	const [schedule, setSchedule] = (0, import_react.useState)([{
		day: "Monday",
		startTime: "09:00",
		endTime: "17:00"
	}]);
	(0, import_react.useEffect)(() => {
		if (!doctor) return;
		setForm({
			speciality: doctor.speciality,
			averageCheckUpTime: String(doctor.averageCheckupTime),
			isAvailable: doctor.isAvailable !== false
		});
		setSchedule(doctor.schedule?.length ? doctor.schedule : [{
			day: "Monday",
			startTime: "09:00",
			endTime: "17:00"
		}]);
		setError("");
		setSaved(false);
	}, [doctor]);
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!doctor) return;
		setError("");
		setSaved(false);
		try {
			await updateDoctor.mutateAsync({
				userId,
				data: {
					speciality: form.speciality.trim(),
					averageCheckUpTime: Number(form.averageCheckUpTime),
					isAvailable: form.isAvailable
				},
				schedule
			});
			setSaved(true);
		} catch (err) {
			setError(getErrorMessage(err) ?? "Unable to update schedule.");
		}
	};
	const updateSchedule = (index, patch) => {
		setSchedule((current) => current.map((slot, i) => i === index ? {
			...slot,
			...patch
		} : slot));
		setSaved(false);
	};
	const removeSchedule = (index) => {
		setSchedule((current) => current.filter((_, i) => i !== index));
		setSaved(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		breadcrumbs: [{
			label: "Dashboard",
			to: "/dashboard"
		}, { label: "My Schedule" }],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "My Schedule"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Review your doctor profile and update your appointment availability."
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-8 text-center text-muted-foreground",
			children: "Loading your schedule..."
		}) : isError || !doctor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-8 text-center text-destructive",
			children: "Unable to load your doctor profile."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { initials: getInitials(getDoctorName(doctor)) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-base font-semibold",
							children: getDoctorName(doctor)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-xs text-muted-foreground",
							children: getDoctorUser(doctor)?.email ?? "No email"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-5 space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Specialty",
							value: doctor.speciality
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Checkup Time",
							value: `${doctor.averageCheckupTime} min`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Status",
							value: doctor.isAvailable === false ? "Inactive" : "Available"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Phone",
							value: getDoctorUser(doctor)?.phone ?? "-"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5 flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold",
							children: "Schedule Details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Changes here control your bookable appointment slots."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: form.isAvailable ? "Available" : "Inactive" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Specialty",
							value: form.speciality,
							onChange: (speciality) => {
								setForm({
									...form,
									speciality
								});
								setSaved(false);
							},
							required: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Average checkup time (minutes)",
							type: "number",
							min: "1",
							value: form.averageCheckUpTime,
							onChange: (averageCheckUpTime) => {
								setForm({
									...form,
									averageCheckUpTime
								});
								setSaved(false);
							},
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 flex items-center gap-3 rounded-lg border border-border p-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.isAvailable,
							onChange: (event) => {
								setForm({
									...form,
									isAvailable: event.target.checked
								});
								setSaved(false);
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-medium",
							children: "Available for appointments"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Turn this off when patients should not be able to book you."
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Weekly Schedule" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [schedule.length, " active day(s)"]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => {
									setSchedule([...schedule, {
										day: getNextAvailableDay(schedule),
										startTime: "09:00",
										endTime: "17:00"
									}]);
									setSaved(false);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add day"]
							})]
						}), schedule.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
							children: "No schedule days selected."
						}) : schedule.map((slot, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_130px_130px_auto]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-3.5 w-3.5" }), " Day"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: slot.day,
									onChange: (event) => updateSchedule(index, { day: event.target.value }),
									className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
									children: days.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: day,
										children: day
									}, day))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }), " Start"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "time",
									value: slot.startTime,
									onChange: (event) => updateSchedule(index, { startTime: event.target.value }),
									required: true
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }), " End"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "time",
									value: slot.endTime,
									onChange: (event) => updateSchedule(index, { endTime: event.target.value }),
									required: true
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "icon",
										onClick: () => removeSchedule(index),
										"aria-label": `Remove ${slot.day}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})
								})
							]
						}, `${slot.day}-${index}`))]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
						children: error
					}),
					saved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700",
						children: "Schedule updated successfully."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: updateDoctor.isPending || schedule.length === 0,
							children: updateDoctor.isPending ? "Saving..." : "Save Schedule"
						})
					})
				]
			})]
		})]
	});
}
var days = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday"
];
function getDoctorUser(doctor) {
	return typeof doctor.userId === "object" ? doctor.userId : void 0;
}
function getDoctorUserId(doctor) {
	return typeof doctor.userId === "object" ? doctor.userId._id : doctor.userId;
}
function getDoctorName(doctor) {
	const user = getDoctorUser(doctor);
	return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unnamed Doctor";
}
function getInitials(name) {
	return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "DR";
}
function InfoRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "text-right font-medium",
			children: value
		})]
	});
}
function getNextAvailableDay(schedule) {
	return days.find((day) => !schedule.some((slot) => slot.day === day)) ?? "Monday";
}
function getErrorMessage(err) {
	if (typeof err === "object" && err && "response" in err) {
		const message = err.response?.data?.message;
		return Array.isArray(message) ? message.join(", ") : message;
	}
}
function AddDoctorDialog() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [step, setStep] = (0, import_react.useState)(1);
	const [error, setError] = (0, import_react.useState)("");
	const createDoctor = useCreateDoctor();
	const [userForm, setUserForm] = (0, import_react.useState)({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		password: "",
		city: "",
		address: "",
		gender: "M"
	});
	const [doctorForm, setDoctorForm] = (0, import_react.useState)({
		speciality: "",
		averageCheckUpTime: "15",
		isAvailable: true
	});
	const [schedule, setSchedule] = (0, import_react.useState)([{
		day: "Monday",
		startTime: "09:00",
		endTime: "17:00"
	}]);
	const reset = () => {
		setStep(1);
		setError("");
		setUserForm({
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			password: "",
			city: "",
			address: "",
			gender: "M"
		});
		setDoctorForm({
			speciality: "",
			averageCheckUpTime: "15",
			isAvailable: true
		});
		setSchedule([{
			day: "Monday",
			startTime: "09:00",
			endTime: "17:00"
		}]);
	};
	const getErrorMessage = (err) => {
		if (typeof err === "object" && err && "response" in err) {
			const message = err.response?.data?.message;
			return Array.isArray(message) ? message.join(", ") : message;
		}
	};
	const handleUserSubmit = (event) => {
		event.preventDefault();
		setError("");
		setStep(2);
	};
	const handleDoctorSubmit = async (event) => {
		event.preventDefault();
		setError("");
		try {
			await createDoctor.mutateAsync({
				user: {
					...userForm,
					firstName: userForm.firstName.trim(),
					lastName: userForm.lastName.trim(),
					email: userForm.email.trim(),
					phone: userForm.phone.trim(),
					city: userForm.city.trim(),
					address: userForm.address.trim()
				},
				doctor: {
					speciality: doctorForm.speciality.trim(),
					averageCheckUpTime: Number(doctorForm.averageCheckUpTime),
					isAvailable: doctorForm.isAvailable,
					schedule
				}
			});
			setOpen(false);
			reset();
		} catch (err) {
			setError(getErrorMessage(err) ?? "Unable to create doctor profile.");
		}
	};
	const updateSchedule = (index, patch) => {
		setSchedule((current) => current.map((slot, i) => i === index ? {
			...slot,
			...patch
		} : slot));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: (nextOpen) => {
			setOpen(nextOpen);
			if (!nextOpen) reset();
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Doctor"] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add Doctor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: step === 1 ? "Step 1 of 2: add personal details." : "Step 2 of 2: add doctor details and schedule." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 flex-1 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: step === 2 ? "h-2 flex-1 rounded-full bg-primary" : "h-2 flex-1 rounded-full bg-muted" })]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
					children: error
				}),
				step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleUserSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "First name",
								value: userForm.firstName,
								onChange: (firstName) => setUserForm({
									...userForm,
									firstName
								}),
								required: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Last name",
								value: userForm.lastName,
								onChange: (lastName) => setUserForm({
									...userForm,
									lastName
								}),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								type: "email",
								value: userForm.email,
								onChange: (email) => setUserForm({
									...userForm,
									email
								}),
								required: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Phone",
								type: "tel",
								value: userForm.phone,
								onChange: (phone) => setUserForm({
									...userForm,
									phone
								}),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Password",
								type: "password",
								value: userForm.password,
								onChange: (password) => setUserForm({
									...userForm,
									password
								}),
								required: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "City",
								value: userForm.city,
								onChange: (city) => setUserForm({
									...userForm,
									city
								}),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Address",
							value: userForm.address,
							onChange: (address) => setUserForm({
								...userForm,
								address
							}),
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Gender" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1.5 grid grid-cols-2 gap-2",
							children: [["M", "Male"], ["F", "Female"]].map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setUserForm({
									...userForm,
									gender: value
								}),
								className: userForm.gender === value ? "rounded-lg border border-primary bg-primary-soft px-3 py-2 text-sm font-medium text-primary" : "rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary/40",
								children: label
							}, value))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							children: "Continue"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleDoctorSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Specialty",
								value: doctorForm.speciality,
								onChange: (speciality) => setDoctorForm({
									...doctorForm,
									speciality
								}),
								required: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Average checkup time (minutes)",
								type: "number",
								min: "1",
								value: doctorForm.averageCheckUpTime,
								onChange: (averageCheckUpTime) => setDoctorForm({
									...doctorForm,
									averageCheckUpTime
								}),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: doctorForm.isAvailable,
								onChange: (event) => setDoctorForm({
									...doctorForm,
									isAvailable: event.target.checked
								})
							}), "Available for appointments"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Schedule" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => setSchedule([...schedule, {
										day: "Monday",
										startTime: "09:00",
										endTime: "17:00"
									}]),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add day"]
								})]
							}), schedule.map((slot, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_120px_120px_auto]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: slot.day,
										onChange: (event) => updateSchedule(index, { day: event.target.value }),
										className: "h-10 rounded-md border border-input bg-background px-3 text-sm",
										children: days.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: day,
											children: day
										}, day))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "time",
										value: slot.startTime,
										onChange: (event) => updateSchedule(index, { startTime: event.target.value }),
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "time",
										value: slot.endTime,
										onChange: (event) => updateSchedule(index, { endTime: event.target.value }),
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "icon",
										onClick: () => setSchedule(schedule.filter((_, i) => i !== index)),
										disabled: schedule.length === 1,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})
								]
							}, index))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setStep(1),
								children: "Back"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "flex-1",
								disabled: createDoctor.isPending,
								children: createDoctor.isPending ? "Creating doctor..." : "Create doctor"
							})]
						})
					]
				})
			]
		})]
	});
}
function EditDoctorDialog({ doctor }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const updateDoctor = useUpdateDoctor();
	const initialSchedule = doctor.schedule?.length ? doctor.schedule : [{
		day: "Monday",
		startTime: "09:00",
		endTime: "17:00"
	}];
	const [form, setForm] = (0, import_react.useState)({
		speciality: doctor.speciality,
		averageCheckUpTime: String(doctor.averageCheckupTime),
		isAvailable: doctor.isAvailable !== false
	});
	const [schedule, setSchedule] = (0, import_react.useState)(initialSchedule);
	(0, import_react.useEffect)(() => {
		if (!open) {
			setForm({
				speciality: doctor.speciality,
				averageCheckUpTime: String(doctor.averageCheckupTime),
				isAvailable: doctor.isAvailable !== false
			});
			setSchedule(doctor.schedule?.length ? doctor.schedule : [{
				day: "Monday",
				startTime: "09:00",
				endTime: "17:00"
			}]);
			setError("");
		}
	}, [doctor, open]);
	const getErrorMessage = (err) => {
		if (typeof err === "object" && err && "response" in err) {
			const message = err.response?.data?.message;
			return Array.isArray(message) ? message.join(", ") : message;
		}
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		try {
			await updateDoctor.mutateAsync({
				userId: getDoctorUserId(doctor),
				data: {
					speciality: form.speciality.trim(),
					averageCheckUpTime: Number(form.averageCheckUpTime),
					isAvailable: form.isAvailable
				},
				schedule
			});
			setOpen(false);
		} catch (err) {
			setError(getErrorMessage(err) ?? "Unable to update doctor.");
		}
	};
	const updateSchedule = (index, patch) => {
		setSchedule((current) => current.map((slot, i) => i === index ? {
			...slot,
			...patch
		} : slot));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				size: "icon",
				"aria-label": `Edit ${getDoctorName(doctor)}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Doctor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: getDoctorName(doctor) })] }),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Specialty",
							value: form.speciality,
							onChange: (speciality) => setForm({
								...form,
								speciality
							}),
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Average checkup time (minutes)",
							type: "number",
							min: "1",
							value: form.averageCheckUpTime,
							onChange: (averageCheckUpTime) => setForm({
								...form,
								averageCheckUpTime
							}),
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.isAvailable,
								onChange: (event) => setForm({
									...form,
									isAvailable: event.target.checked
								})
							}), "Available for appointments"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Schedule" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => setSchedule([...schedule, {
										day: "Monday",
										startTime: "09:00",
										endTime: "17:00"
									}]),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add day"]
								})]
							}), schedule.map((slot, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_120px_120px_auto]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: slot.day,
										onChange: (event) => updateSchedule(index, { day: event.target.value }),
										className: "h-10 rounded-md border border-input bg-background px-3 text-sm",
										children: days.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: day,
											children: day
										}, day))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "time",
										value: slot.startTime,
										onChange: (event) => updateSchedule(index, { startTime: event.target.value }),
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "time",
										value: slot.endTime,
										onChange: (event) => updateSchedule(index, { endTime: event.target.value }),
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "icon",
										onClick: () => setSchedule(schedule.filter((_, i) => i !== index)),
										disabled: schedule.length === 1,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})
								]
							}, index))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: updateDoctor.isPending,
							children: updateDoctor.isPending ? "Saving..." : "Save changes"
						})
					]
				})
			]
		})]
	});
}
function Field({ label, value, onChange, type = "text", required, min }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		className: "mt-1.5",
		type,
		min,
		value,
		onChange: (event) => onChange(event.target.value),
		required
	})] });
}
//#endregion
export { DoctorsLayout as component };
