import { o as __toESM } from "../_runtime.mjs";
import { D as require_react, E as require_jsx_runtime, a as Overlay2, c as Title2, i as Description2, l as Trigger2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as cn, i as buttonVariants, n as Input, r as api, t as Button } from "./api-CC38_k8-.mjs";
import { P as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { D as ChevronRight, H as PanelLeftOpen, I as Building2, L as Bell, M as CalendarDays, P as CalendarClock, U as PanelLeftClose, b as LogOut, d as Search, n as Users, p as Plus, s as Stethoscope, u as Settings, x as LayoutGrid } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-BJX_0vmy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fetchMe = async () => {
	const { data } = await api.get("/auth/me");
	return data;
};
function useUser() {
	const queryClient = useQueryClient();
	const { data: user, isLoading, isError } = useQuery({
		queryKey: ["user"],
		queryFn: fetchMe,
		retry: false,
		staleTime: Infinity,
		gcTime: 1e3 * 60 * 60
	});
	const logout = async () => {
		await api.get("/auth/logout");
		queryClient.setQueryData(["user"], null);
	};
	return {
		user,
		isLoading,
		isAuthenticated: !!user,
		logout
	};
}
var DoctorService = class {
	static async getDoctors() {
		return (await api.get("/doctor")).data;
	}
	static async getDoctorById(userId) {
		return (await api.get(`/doctor/${userId}`)).data;
	}
	static async createDoctor(data) {
		return (await api.post("/doctor/create", data)).data;
	}
	static async updateDoctor(userId, data) {
		return (await api.patch(`/doctor/update/${userId}`, data)).data;
	}
	static async updateSchedule(userId, schedule) {
		return (await api.patch(`/doctor/${userId}/schedule`, { schedule })).data;
	}
};
var UserService = class {
	static async createUser(data) {
		return (await api.post("/user/add", data)).data;
	}
	static async deleteUser(userId) {
		return (await api.delete(`/user/delete/${userId}`)).data;
	}
};
var doctorsQueryKey = ["doctors"];
var doctorQueryKey = (userId) => ["doctor", userId];
function replaceDoctor(doctors, updatedDoctor) {
	return (doctors ?? []).map((doctor) => doctor._id === updatedDoctor._id ? updatedDoctor : doctor);
}
function useDoctors() {
	return useQuery({
		queryKey: doctorsQueryKey,
		queryFn: async () => {
			const response = await DoctorService.getDoctors();
			return Array.isArray(response?.doctors) ? response.doctors : [];
		}
	});
}
function useDoctorProfile(userId) {
	return useQuery({
		queryKey: userId ? doctorQueryKey(userId) : ["doctor", "me"],
		queryFn: async () => {
			if (!userId) return null;
			return (await DoctorService.getDoctorById(userId)).doctor;
		},
		enabled: Boolean(userId)
	});
}
function useCreateDoctor() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ user, doctor }) => {
			let createdUserId = "";
			try {
				createdUserId = (await UserService.createUser(user)).user?._id;
				if (!createdUserId) throw new Error("User created, but no user id was returned.");
				await DoctorService.createDoctor({
					userId: createdUserId,
					...doctor
				});
				return (await DoctorService.getDoctorById(createdUserId)).doctor;
			} catch (error) {
				if (createdUserId) await UserService.deleteUser(createdUserId);
				throw error;
			}
		},
		onSuccess: (doctor) => {
			queryClient.setQueryData(doctorsQueryKey, (current = []) => [doctor, ...current]);
			queryClient.setQueryData(doctorQueryKey(getDoctorUserId(doctor)), doctor);
		}
	});
}
function useUpdateDoctor() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ userId, data, schedule }) => {
			await DoctorService.updateDoctor(userId, data);
			if (schedule) await DoctorService.updateSchedule(userId, schedule);
			return (await DoctorService.getDoctorById(userId)).doctor;
		},
		onSuccess: (doctor) => {
			queryClient.setQueryData(doctorsQueryKey, (current) => replaceDoctor(current, doctor));
			queryClient.setQueryData(doctorQueryKey(getDoctorUserId(doctor)), doctor);
		}
	});
}
function getDoctorUserId(doctor) {
	return typeof doctor.userId === "object" ? doctor.userId._id : doctor.userId;
}
var AlertDialog = Root2;
var AlertDialogTrigger = Trigger2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
var adminNav = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutGrid
	},
	{
		to: "/appointments",
		label: "Appointments",
		icon: CalendarDays
	},
	{
		to: "/follow-ups",
		label: "Follow-ups",
		icon: CalendarClock
	},
	{
		to: "/patients",
		label: "Patients",
		icon: Users
	},
	{
		to: "/doctors",
		label: "Doctors",
		icon: Stethoscope
	},
	{
		to: "/notifications",
		label: "Notifications",
		icon: Bell
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	}
];
var doctorNav = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutGrid
	},
	{
		to: "/appointments",
		label: "My Appointments",
		icon: CalendarDays
	},
	{
		to: "/follow-ups",
		label: "My Follow-ups",
		icon: CalendarClock
	},
	{
		to: "/patients",
		label: "My Patients",
		icon: Users
	},
	{
		to: "/doctors",
		label: "My Schedule",
		icon: CalendarClock
	}
];
function Logo({ collapsed }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/dashboard",
		className: "flex items-center gap-2 px-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
				className: "h-5 w-5",
				strokeWidth: 3
			})
		}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-lg font-semibold tracking-tight text-foreground",
			children: "MediFlow"
		})]
	});
}
function Breadcrumbs({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex items-center gap-1.5 text-sm text-muted-foreground",
		children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5",
			children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" }), item.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: item.to,
				className: "hover:text-foreground transition-colors",
				children: item.label
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-foreground font-medium",
				children: item.label
			})]
		}, i))
	});
}
function AppShell({ children, breadcrumbs }) {
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { user } = useUser();
	const userId = user?._id;
	const { data: doctorProfile } = useDoctorProfile(user?.role === "doctor" ? userId : void 0);
	const staffName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Staff";
	const staffInitials = staffName.split(" ").map((name) => name[0]).join("").slice(0, 2).toUpperCase();
	const staffRole = user?.role ? user.role.replace(/^\w/, (letter) => letter.toUpperCase()) : "Staff";
	const staffSubtitle = user?.role === "doctor" ? doctorProfile?.speciality ?? "Doctor" : staffRole;
	const nav = user?.role === "doctor" ? doctorNav : adminNav;
	const portalLabel = user?.role === "doctor" ? "DOCTOR PORTAL" : "RECEPTION PORTAL";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300", collapsed ? "w-[72px]" : "w-[260px]", mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { collapsed }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCollapsed((c) => !c),
							className: "hidden lg:grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted",
							children: collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "h-4 w-4" })
						})]
					}),
					!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-3 mb-3 flex items-center gap-2.5 rounded-xl border border-sidebar-border bg-muted/40 px-3 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm font-medium text-foreground",
								children: "Greenway Clinic"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-xs text-muted-foreground",
								children: "775 Rolling Green Rd."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 px-3 py-2 space-y-1",
						children: nav.map((item) => {
							const active = pathname === item.to || pathname.startsWith(item.to + "/");
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								onClick: () => setMobileOpen(false),
								className: cn("group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-muted/60 hover:text-sidebar-foreground", collapsed && "justify-center px-0"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-[18px] w-[18px] shrink-0", active && "text-primary") }), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-sidebar-border p-3",
						children: [
							!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 px-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground",
								children: portalLabel
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("flex items-center gap-3 rounded-lg p-2 hover:bg-muted/60", collapsed && "justify-center"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-sky-400 text-xs font-bold text-primary-foreground",
									children: staffInitials
								}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm font-semibold text-foreground",
										children: staffName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-xs text-muted-foreground",
										children: staffSubtitle
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoutConfirmButton, { collapsed })
						]
					})
				]
			}),
			mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-30 bg-black/40 lg:hidden",
				onClick: () => setMobileOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex min-h-screen flex-1 flex-col transition-all duration-300", collapsed ? "lg:pl-[72px]" : "lg:pl-[260px]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMobileOpen(true),
							className: "grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-muted lg:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-0 flex-1",
							children: breadcrumbs && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: breadcrumbs })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative hidden sm:block w-72 max-w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search patient, ID, or doctor...",
								className: "pl-9 h-9 bg-muted/50 border-transparent focus-visible:bg-background"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoutConfirmButton, { iconOnly: true })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-4 py-6 lg:px-8 lg:py-8 animate-in fade-in duration-300",
					children
				})]
			})
		]
	});
}
function LogoutConfirmButton({ collapsed, iconOnly }) {
	const navigate = useNavigate();
	const { logout } = useUser();
	const [isLoggingOut, setIsLoggingOut] = (0, import_react.useState)(false);
	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await logout();
			navigate({ to: "/login" });
		} finally {
			setIsLoggingOut(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
		asChild: true,
		children: iconOnly || collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			size: "icon",
			className: cn("rounded-full text-muted-foreground hover:text-destructive", collapsed && "mt-2"),
			"aria-label": "Log out",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			className: "mt-2 w-full justify-start gap-3 text-muted-foreground hover:text-destructive",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), "Log out"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Log out?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Your current session will end and you will need to sign in again to access the portal." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
		disabled: isLoggingOut,
		children: "Cancel"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
		onClick: handleLogout,
		disabled: isLoggingOut,
		className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
		children: isLoggingOut ? "Logging out..." : "Log out"
	})] })] })] });
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", {
			Confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
			Scheduled: "bg-sky-50 text-sky-700 ring-sky-200",
			Booked: "bg-sky-50 text-sky-700 ring-sky-200",
			Pending: "bg-amber-50 text-amber-700 ring-amber-200",
			"In Progress": "bg-violet-50 text-violet-700 ring-violet-200",
			Completed: "bg-slate-100 text-slate-700 ring-slate-200",
			Delayed: "bg-orange-50 text-orange-700 ring-orange-200",
			Cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
			"No-show": "bg-rose-50 text-rose-700 ring-rose-200",
			Available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
			Busy: "bg-amber-50 text-amber-700 ring-amber-200",
			"Off Today": "bg-slate-100 text-slate-600 ring-slate-200",
			Sent: "bg-emerald-50 text-emerald-700 ring-emerald-200",
			Failed: "bg-rose-50 text-rose-700 ring-rose-200",
			Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
			Inactive: "bg-slate-100 text-slate-600 ring-slate-200"
		}[status] ?? "bg-slate-100 text-slate-700 ring-slate-200"),
		children: status
	});
}
function Avatar({ initials, tone = "sky" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold", {
			sky: "bg-sky-100 text-sky-700",
			rose: "bg-rose-100 text-rose-700",
			amber: "bg-amber-100 text-amber-700",
			emerald: "bg-emerald-100 text-emerald-700",
			violet: "bg-violet-100 text-violet-700"
		}[tone]),
		children: initials
	});
}
//#endregion
export { LogoutConfirmButton as a, useDoctorProfile as c, useUser as d, Logo as i, useDoctors as l, Avatar as n, StatusBadge as o, Breadcrumbs as r, useCreateDoctor as s, AppShell as t, useUpdateDoctor as u };
