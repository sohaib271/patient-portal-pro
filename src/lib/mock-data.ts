export type Status = "Confirmed" | "Scheduled" | "Pending" | "Completed" | "Cancelled" | "No-show";

export const statusStyles: Record<Status, string> = {
  Confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Scheduled: "bg-sky-50 text-sky-700 ring-sky-200",
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Completed: "bg-slate-100 text-slate-700 ring-slate-200",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  "No-show": "bg-rose-50 text-rose-700 ring-rose-200",
};

export const appointments = [
  { id: "APT-5001", patient: "Arlene McCoy", pid: "P-10077", doctor: "Savannah Nguyen", specialty: "Family Medicine", date: "Jun 10, 2026", time: "9:00 AM", status: "Confirmed" as Status },
  { id: "APT-5002", patient: "Kristin Watson", pid: "P-10077", doctor: "Robert Fox", specialty: "Dentistry", date: "Jun 10, 2026", time: "9:30 AM", status: "Confirmed" as Status },
  { id: "APT-5003", patient: "Cameron Williamson", pid: "P-10077", doctor: "Devon Lane", specialty: "Psychiatry", date: "Jun 10, 2026", time: "10:00 AM", status: "Scheduled" as Status },
  { id: "APT-5004", patient: "Wade Warren", pid: "P-10077", doctor: "Darlene Robertson", specialty: "Nephrology", date: "Jun 10, 2026", time: "10:30 AM", status: "Scheduled" as Status },
  { id: "APT-5005", patient: "Guy Hawkins", pid: "P-10077", doctor: "Jane Cooper", specialty: "Internal Medicine", date: "Jun 10, 2026", time: "11:00 AM", status: "Confirmed" as Status },
  { id: "APT-5006", patient: "Floyd Miles", pid: "P-10077", doctor: "Jenny Wilson", specialty: "Urgent Care", date: "Jun 10, 2026", time: "11:30 AM", status: "Confirmed" as Status },
  { id: "APT-5007", patient: "Marvin McKinney", pid: "P-10077", doctor: "Eleanor Pena", specialty: "Pathology", date: "Jun 10, 2026", time: "12:00 PM", status: "No-show" as Status },
  { id: "APT-5008", patient: "Kathryn Murphy", pid: "P-10077", doctor: "Brooklyn Simmons", specialty: "Emergency Medicine", date: "Jun 10, 2026", time: "1:00 PM", status: "Confirmed" as Status },
  { id: "APT-5009", patient: "Albert Flores", pid: "P-10077", doctor: "Darrell Steward", specialty: "Urology", date: "Jun 10, 2026", time: "1:30 PM", status: "Confirmed" as Status },
  { id: "APT-5010", patient: "Cody Fisher", pid: "P-10077", doctor: "Jerome Bell", specialty: "Pharmacy", date: "Jun 10, 2026", time: "2:00 PM", status: "Cancelled" as Status },
  { id: "APT-5011", patient: "Dianne Russell", pid: "P-10077", doctor: "Leslie Alexander", specialty: "Nursing", date: "Jun 10, 2026", time: "2:30 PM", status: "Pending" as Status },
];

export const patients = [
  { id: "P-10402", name: "Alice Logan", email: "alice.l@example.com", age: 38, gender: "Male", phone: "+1 (623) 273-4241", lastVisit: "2026-06-15" },
  { id: "P-10294", name: "Brian Ross", email: "brian.r@example.com", age: 24, gender: "Male", phone: "+1 (772) 893-2810", lastVisit: "2026-07-01" },
  { id: "P-10159", name: "Cindy Smith", email: "cindy.s@example.com", age: 37, gender: "Female", phone: "+1 (533) 741-3346", lastVisit: "2026-08-22" },
  { id: "P-10239", name: "David Turner", email: "david.t@example.com", age: 43, gender: "Male", phone: "+1 (872) 219-1208", lastVisit: "2026-09-10" },
  { id: "P-10223", name: "Eva Vance", email: "eva.v@example.com", age: 44, gender: "Female", phone: "+1 (227) 969-6524", lastVisit: "2026-10-05" },
  { id: "P-10171", name: "Frank White", email: "frank.w@example.com", age: 22, gender: "Male", phone: "+1 (909) 515-4997", lastVisit: "2026-11-12" },
  { id: "P-10394", name: "Grace Lee", email: "grace.l@example.com", age: 26, gender: "Female", phone: "+1 (841) 555-6859", lastVisit: "2026-12-20" },
  { id: "P-10440", name: "Hannah Moore", email: "hannah.m@example.com", age: 28, gender: "Female", phone: "+1 (960) 894-1449", lastVisit: "2026-01-30" },
  { id: "P-10437", name: "Ian Rogers", email: "ian.r@example.com", age: 45, gender: "Male", phone: "+1 (562) 226-9081", lastVisit: "2026-02-14" },
  { id: "P-10204", name: "Julia Stone", email: "julia.s@example.com", age: 33, gender: "Female", phone: "+1 (833) 437-9808", lastVisit: "2026-03-25" },
  { id: "P-10578", name: "Kevin Thomas", email: "kevin.t@example.com", age: 32, gender: "Male", phone: "+1 (362) 544-4847", lastVisit: "2026-04-18" },
  { id: "P-10453", name: "Laura Brown", email: "laura.b@example.com", age: 34, gender: "Female", phone: "+1 (328) 627-3962", lastVisit: "2026-05-09" },
];

export const doctors = [
  { id: "JB", name: "Dr. James Brown", specialty: "Dermatology", next: "Jun 10, 11:00 AM", todays: 4, status: "Available" as const },
  { id: "DR", name: "Dr. Daniel Ross", specialty: "Pediatrics", next: "Jun 15, 10:00 AM", todays: 0, status: "Available" as const },
  { id: "EL", name: "Dr. Emily Lopez", specialty: "Endocrinology", next: "Jun 10, 2:00 PM", todays: 2, status: "Busy" as const },
  { id: "AJ", name: "Dr. Amanda John", specialty: "Cardiology", next: "Jun 10, 1:30 PM", todays: 3, status: "Available" as const },
  { id: "SM", name: "Dr. Sarah Mitchell", specialty: "Neurology", next: "Jun 10, 3:00 PM", todays: 5, status: "Off Today" as const },
];

export const specialties = ["General Consultation", "Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Neurology"];

export const notifications = [
  { id: 1, patient: "Michael Thompson", doctor: "Dr. James Walker", date: "2026-06-10 at 9:00 AM", timing: "1 Day Before", status: "Sent", body: "Reminder: Your appointment with Dr. James Walker (Cardiology) is tomorrow, June 10 at 9:00 AM.", ts: "2026-06-09 08:00 AM" },
  { id: 2, patient: "Sarah Mitchell", doctor: "Dr. Emma Roberts", date: "2026-06-10 at 10:00 AM", timing: "30 Minutes Before", status: "Sent", body: "Reminder: Your appointment with Dr. Emma Roberts (Dermatology) is in 30 minutes — today at 10:00 AM.", ts: "2026-06-10 09:30 AM" },
  { id: 3, patient: "John Anderson", doctor: "Dr. Daniel Cooper", date: "2026-06-10 at 11:00 AM", timing: "1 Hour Before", status: "Pending", body: "Reminder: Your appointment with Dr. Daniel Cooper (General Practice) is today at 11:00 AM.", ts: "2026-06-10 10:00 AM" },
  { id: 4, patient: "Robert Hayes", doctor: "Dr. Daniel Cooper", date: "2026-06-02 at 9:30 AM", timing: "1 Day Before", status: "Failed", body: "Phone number unreachable — carrier error code 421", ts: "2026-06-01 09:30 AM" },
  { id: 5, patient: "Olivia Wilson", doctor: "Dr. Daniel Cooper", date: "2026-06-03 at 3:00 PM", timing: "1 Hour Before", status: "Sent", body: "Reminder: Your appointment with Dr. Daniel Cooper is in 1 hour — today at 3:00 PM.", ts: "2026-06-03 02:00 PM" },
];