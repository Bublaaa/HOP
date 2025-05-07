const sidebarLinks = {
  security: [
    { label: "Overview", icon: "Blocks", href: "/security/overview" },
    { label: "Clock In", icon: "FileDown", href: "/security/clock-in" },
    { label: "Clock Out", icon: "FileUp", href: "/security/clock-out" },
    { label: "Schedules", icon: "ClipboardList", href: "/security/schedules" },
  ],
  outpost: [
    { label: "Dashboard", icon: "QrCode", href: "/outpost/qr-code" },
    { label: "Schedules", icon: "ClipboardList", href: "/outpost/schedules" },
  ],
  admin: [
    { label: "Schedule", icon: "CalendarSync", href: "/admin/schedules" },
    { label: "Attendance", icon: "BookUser", href: "/admin/attendances" },
    { label: "Users", icon: "Users", href: "/admin/users" },
    { label: "Outpost", icon: "House", href: "/admin/outposts" },
    { label: "Shift", icon: "Clock", href: "/admin/shifts" },
  ],
};

export default sidebarLinks;
