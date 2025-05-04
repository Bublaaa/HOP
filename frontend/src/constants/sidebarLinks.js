const sidebarLinks = {
  security: [
    { label: "Menu", icon: "Utensils", href: "/menu" },
    { label: "Profile", icon: "Home", href: "/profile" },
  ],
  outpost: [
    { label: "Dashboard", icon: "LayoutDashboard", href: "/dashboard" },
    { label: "Orders", icon: "ClipboardList", href: "/orders" },
    { label: "Profile", icon: "User", href: "/profile" },
  ],
  admin: [
    { label: "Overview", icon: "BarChart", href: "/admin/overview" },
    { label: "Users", icon: "Users", href: "/admin/users" },
    { label: "Outpost", icon: "House", href: "/admin/outposts" },
    { label: "Shift", icon: "Clock", href: "/admin/shifts" },
    { label: "Schedule", icon: "CalendarSync", href: "/admin/schedule" },
    { label: "Attendance", icon: "BookUser", href: "/admin/schedule" },
  ],
};

export default sidebarLinks;
