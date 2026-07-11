import { o as __toESM } from "../_runtime.mjs";
import { D as require_react, E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as cn, n as Input, t as Button } from "./api-CC38_k8-.mjs";
import { I as Building2, L as Bell, n as Users } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-BJX_0vmy.mjs";
import { t as Card } from "./card-z5dfXztG.mjs";
import { t as Label } from "./label-BuKBvabm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-DZe3D_mZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const [section, setSection] = (0, import_react.useState)("clinic");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		breadcrumbs: [
			{
				label: "Dashboard",
				to: "/dashboard"
			},
			{ label: "Settings" },
			{ label: section === "clinic" ? "Clinic Information" : section === "reminders" ? "Reminder Config" : "User Management" }
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Manage clinic settings, notifications, and team access"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-2 h-fit",
				children: [
					{
						k: "clinic",
						l: "Clinic Information",
						i: Building2
					},
					{
						k: "reminders",
						l: "Reminder Config",
						i: Bell
					},
					{
						k: "users",
						l: "User Management",
						i: Users
					}
				].map((s) => {
					const Icon = s.i;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setSection(s.k),
						className: cn("flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors", section === s.k ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }),
							" ",
							s.l
						]
					}, s.k);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6 animate-in fade-in duration-200",
				children: [
					section === "clinic" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClinicInfo, {}),
					section === "reminders" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReminderConfig, {}),
					section === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserManagement, {})
				]
			})]
		})]
	});
}
function ClinicInfo() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: "Clinic Information"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Update your clinic's details and contact information."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 text-sm font-semibold",
				children: "Basic Information"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Clinic Name",
						defaultValue: "Greenway Medical Clinic"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tax ID / NPI",
						defaultValue: "1234567890"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Founded Year",
						defaultValue: "2014"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Timezone",
						defaultValue: "America/Chicago (CST)"
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 text-sm font-semibold",
				children: "Contact & Location"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Phone Number",
						defaultValue: "+1 (555) 800-1000"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email Address",
						defaultValue: "contact@carepoint.clinic"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Website",
						defaultValue: "www.carepoint.clinic"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Fax Number",
						defaultValue: "+1 (555) 800-1001"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Street Address",
							defaultValue: "500 Medical Plaza Drive, Suite 200, Springfield, IL 62701"
						})
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Save Changes" })]
			})
		]
	});
}
function ReminderConfig() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: "Reminder Configuration"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Choose default reminder timings and channels."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Default Timing",
				defaultValue: "1 Hour Before"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Default Channel",
				defaultValue: "Email"
			})
		]
	});
}
function UserManagement() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-semibold",
			children: "User Management"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Manage team members and access."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "+ Add User" })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "text-left text-xs font-medium uppercase tracking-wide text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-3 pr-4",
						children: "User"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-3 pr-4",
						children: "Email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-3 pr-4",
						children: "Role"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-3 pr-4",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-3 pr-4",
						children: "Last Active"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "divide-y divide-border",
				children: [
					{
						i: "JJ",
						n: "Jacob Jones",
						e: "andreas@gmail.com",
						r: "Doctor",
						s: "Active",
						t: "Jun 11, 7:50 AM"
					},
					{
						i: "JW",
						n: "Jenny Wilson",
						e: "steven@gmail.com",
						r: "Doctor",
						s: "Inactive",
						t: "Jun 10, 10:35 AM"
					},
					{
						i: "CW",
						n: "Cameron Will",
						e: "gerad@gmail.com",
						r: "Nurse",
						s: "Active",
						t: "Jun 12, 1:15 PM"
					}
				].map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-muted/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary",
									children: u.i
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: u.n
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4 text-muted-foreground",
							children: u.e
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4",
							children: u.r
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", u.s === "Active" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-100 text-slate-600 ring-slate-200"),
								children: u.s
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-4 text-muted-foreground",
							children: u.t
						})
					]
				}, u.n))
			})]
		})
	})] });
}
function Field({ label, defaultValue }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		className: "text-xs text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		className: "mt-1",
		defaultValue
	})] });
}
//#endregion
export { SettingsPage as component };
