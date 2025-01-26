import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  BetweenHorizontalStart,
  BetweenHorizontalEnd,
  Library,
  BookDown,
  Activity,
  Clock,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Students",
      menus: [
        {
          href: "/check-in-student",
          label: "Check In Student",
          icon: BetweenHorizontalStart,
        },
        {
          href: "/check-out-student",
          label: "Check Out Student",
          icon: BetweenHorizontalEnd,
        },
      ],
    },
    {
      groupLabel: "Books",
      menus: [
        {
          href: "/view-all-books",
          label: "View All Books",
          icon: Library,
        },
        {
          href: "/borrow-books",
          label: "Borrow Books",
          icon: BookDown,
        },
      ],
    },
    {
      groupLabel: "Analytics",
      menus: [
        {
          href: "/student-attendance",
          label: "Student Attendance",
          icon: Activity,
        },
        {
          href: "/book-read-hours",
          label: "Not Read Books",
          icon: Clock,
        },
        {
          href: "/borrow-frequency",
          label: "Borrow Frequency",
          icon: Activity,
        },
      ],
    },
    {
      groupLabel: "Accounts",
      menus: [
        {
          href: "/staff-accounts",
          label: "Staff Accounts",
          icon: Users,
        },
      ],
    },
  ];
}
