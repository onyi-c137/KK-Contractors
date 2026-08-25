import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Wallet,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  Menu,
  X,
  Tractor,
  Clock3,
  CheckCircle2,
  UserPlus,
  MapPin,
  Phone,
  Save,
  Plus,
  CalendarDays,
  Search,
  LogOut,
  User,
  ChevronUp,
  ChevronDown,
  Trash2,
  Eye,
  Pencil,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import Login from "./Login";
import { getCurrentProfile } from "./lib/profile";

// IMPORTANT:
// If your existing Supabase client is in a different location,
// change ONLY this import path.
import { supabase } from "./lib/supabase";


/* =========================================
   CONSTANTS
========================================= */

const serviceOptions = [
  "Land preparation",
  "Ploughing",
  "Harrowing",
  "Planting",
  "Transport",
  "Other",
];

const requestStatuses = [
  "Pending",
  "In Progress",
  "Completed",
  "Cancelled",
];

const tractorStatuses = [
  "Available",
  "Working",
  "Maintenance",
  "Inactive",
];

const paymentMethods = [
  "Cash",
  "M-Pesa",
  "Bank Transfer",
  "Other",
];

const expenseCategories = [
  "Fuel",
  "Repairs",
  "Maintenance",
  "Transport",
  "Labour",
  "Parts",
  "Other",
];

function formatMoney(amount) {
  const value = Number(amount);
  if (Number.isNaN(value)) return "KSh 0.00";
  return `KSh ${value.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}



/* =========================================
   ACCOUNT MENU
========================================= */

function getInitials(fullName) {
  if (!fullName) return "?";

  return fullName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function AccountMenu({
  profile,
  position = "top",
  onLogout,
  onNavigate,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    // Use pointerdown in capture phase only for outside closes.
    // Menu actions use onClick and stopPropagation so they still fire.
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const roleLabel =
    profile?.role === "owner" ? "Administrator" : "Staff";

  const initials = getInitials(profile?.full_name);

  const isBottom = position === "bottom";

  const handleItem = (event, page) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleSignOut = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);
    if (onLogout) {
      await onLogout();
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((current) => !current);
        }}
        className={
          isBottom
            ? "flex w-full items-center gap-3 rounded-xl bg-white/5 p-3 text-left transition hover:bg-white/10"
            : "flex items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-slate-100"
        }
        title="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div
          className={
            isBottom
              ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950"
              : "flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white"
          }
        >
          {initials}
        </div>

        <div
          className={
            isBottom
              ? "min-w-0 flex-1"
              : "hidden text-right sm:block"
          }
        >
          <p
            className={
              isBottom
                ? "truncate text-sm font-semibold text-white"
                : "text-sm font-semibold text-slate-900"
            }
          >
            {profile?.full_name || "User"}
          </p>

          <p
            className={
              isBottom
                ? "truncate text-xs capitalize text-slate-400"
                : "text-xs capitalize text-slate-500"
            }
          >
            {roleLabel}
          </p>
        </div>

        {isBottom ? (
          open ? (
            <ChevronDown size={16} className="text-slate-400" />
          ) : (
            <ChevronUp size={16} className="text-slate-400" />
          )
        ) : null}
      </button>

      {open && (
        <div
          role="menu"
          className={
            isBottom
              ? "absolute bottom-full left-0 right-0 z-[60] mb-2 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl"
              : "absolute right-0 top-full z-[60] mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
          }
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div
            className={
              isBottom
                ? "border-b border-white/10 px-4 py-3"
                : "border-b border-slate-100 px-4 py-3"
            }
          >
            <div className="flex items-center gap-3">
              <div
                className={
                  isBottom
                    ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950"
                    : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white"
                }
              >
                {initials}
              </div>

              <div className="min-w-0">
                <p
                  className={
                    isBottom
                      ? "truncate text-sm font-semibold text-white"
                      : "truncate text-sm font-semibold text-slate-900"
                  }
                >
                  {profile?.full_name || "User"}
                </p>
                <p
                  className={
                    isBottom
                      ? "truncate text-xs capitalize text-slate-400"
                      : "truncate text-xs capitalize text-slate-500"
                  }
                >
                  {roleLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <button
              type="button"
              role="menuitem"
              onClick={(event) => handleItem(event, "Settings")}
              className={
                isBottom
                  ? "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-200 transition hover:bg-white/10"
                  : "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
              }
            >
              <User size={17} />
              My profile
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={(event) => handleItem(event, "Settings")}
              className={
                isBottom
                  ? "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-200 transition hover:bg-white/10"
                  : "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
              }
            >
              <Bell size={17} />
              Notifications
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={(event) => handleItem(event, "Settings")}
              className={
                isBottom
                  ? "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-200 transition hover:bg-white/10"
                  : "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
              }
            >
              <Settings size={17} />
              Settings
            </button>
          </div>

          <div
            className={
              isBottom
                ? "border-t border-white/10 py-1"
                : "border-t border-slate-100 py-1"
            }
          >
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className={
                isBottom
                  ? "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition hover:bg-white/10"
                  : "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
              }
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


/* =========================================
   APP
========================================= */

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("Dashboard");

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(session);

      if (session?.user) {
        try {
          const currentProfile = await getCurrentProfile();

          if (mounted) {
            setProfile(currentProfile);
          }
        } catch (error) {
          console.error("Unable to load profile:", error);
        }
      }

      setAuthLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      setSession(session);

      if (session?.user) {
        try {
          const currentProfile = await getCurrentProfile();

          if (mounted) {
            setProfile(currentProfile);
          }
        } catch (error) {
          console.error("Unable to load profile:", error);
        }
      } else {
        setProfile(null);
      }

      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    // Clear local auth state first so the UI switches to Login immediately.
    setSession(null);
    setProfile(null);
    setSidebarOpen(false);
    setCurrentPage("Dashboard");

    try {
      const { error } = await supabase.auth.signOut({
        scope: "local",
      });

      if (error) {
        console.error("Logout error:", error);
      }

      // Also clear any persisted session storage keys as a fallback.
      try {
        const keys = Object.keys(window.localStorage || {});
        keys.forEach((key) => {
          if (
            key.startsWith("sb-") ||
            key.includes("supabase")
          ) {
            window.localStorage.removeItem(key);
          }
        });
      } catch (storageError) {
        console.error("Storage clear error:", storageError);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-emerald-500" />

          <p className="mt-4 text-sm text-slate-400">
            Loading KK Contractors...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-xl font-bold text-slate-900">
            Profile not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Your account is authenticated, but no KK Contractors profile
            exists for this account.
          </p>

          <button
            onClick={handleLogout}
            className="mt-6 rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">

          <div>
            <h1 className="text-xl font-bold">
              KK Contractors
            </h1>

            <p className="text-xs text-slate-400">
              Operations Dashboard
            </p>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>

        </div>


        <nav className="flex-1 px-4 py-6">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Management
          </p>

          <div className="space-y-1">

            <NavItem
              icon={LayoutDashboard}
              label="Dashboard"
              active={currentPage === "Dashboard"}
              onClick={() => navigate("Dashboard")}
            />

            <NavItem
              icon={Users}
              label="Customers"
              active={currentPage === "Customers"}
              onClick={() => navigate("Customers")}
            />

            <NavItem
              icon={ClipboardList}
              label="Requests"
              active={currentPage === "Requests"}
              onClick={() => navigate("Requests")}
            />

            <NavItem
              icon={Tractor}
              label="Tractors"
              active={currentPage === "Tractors"}
              onClick={() => navigate("Tractors")}
            />

            <NavItem
              icon={Wallet}
              label="Expenses"
              active={currentPage === "Expenses"}
              onClick={() => navigate("Expenses")}
            />

            <NavItem
              icon={CreditCard}
              label="Payments"
              active={currentPage === "Payments"}
              onClick={() => navigate("Payments")}
            />

            <NavItem
              icon={BarChart3}
              label="Reports"
              active={currentPage === "Reports"}
              onClick={() => navigate("Reports")}
            />

          </div>


          <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            System
          </p>

          <NavItem
            icon={Users}
            label="Staff"
            active={currentPage === "Staff"}
            onClick={() => navigate("Staff")}
          />

          <NavItem
            icon={Settings}
            label="Settings"
            active={currentPage === "Settings"}
            onClick={() => navigate("Settings")}
          />

        </nav>


        <div className="border-t border-white/10 p-4">
          <AccountMenu
            profile={profile}
            position="bottom"
            onLogout={handleLogout}
            onNavigate={navigate}
          />
        </div>

      </aside>


      <div className="lg:pl-64">

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">

          <button
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>


          <div className="hidden lg:block">

            <p className="text-sm text-slate-500">
              {profile.role === "owner"
                ? "Administrator dashboard"
                : "Staff dashboard"}
            </p>

            <h2 className="text-lg font-semibold">
              {currentPage}
            </h2>

          </div>


          <div className="ml-auto flex items-center gap-4">

            <button className="relative rounded-full p-2 hover:bg-slate-100">
              <Bell size={21} />

              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
            </button>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            <AccountMenu
              profile={profile}
              position="top"
              onLogout={handleLogout}
              onNavigate={navigate}
            />

          </div>

        </header>


        <main className="p-4 sm:p-6 lg:p-8">

          {currentPage === "Dashboard" && (
            <DashboardPage currentUser={profile} />
          )}

          {currentPage === "Customers" && (
            <CustomersPage currentUser={profile} />
          )}

          {currentPage === "Requests" && (
            <RequestsPage currentUser={profile} />
          )}

          {currentPage === "Staff" && (
            <StaffPage />
          )}

          {currentPage === "Tractors" && (
            <TractorsPage currentUser={profile} />
          )}

          {currentPage === "Payments" && (
            <PaymentsPage currentUser={profile} />
          )}

          {currentPage === "Expenses" && (
            <ExpensesPage currentUser={profile} />
          )}

          {currentPage !== "Dashboard" &&
            currentPage !== "Customers" &&
            currentPage !== "Requests" &&
            currentPage !== "Staff" &&
            currentPage !== "Tractors" &&
            currentPage !== "Payments" &&
            currentPage !== "Expenses" && (
              <ComingSoonPage page={currentPage} />
            )}

        </main>

      </div>

    </div>
  );
}


/* =========================================
   DASHBOARD
========================================= */

function DashboardPage({ currentUser }) {

  const [requests, setRequests] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tractors, setTractors] = useState([]);
  const [profiles, setProfiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {

    setLoading(true);
    setError("");

    const [
      requestsResult,
      customersResult,
      tractorsResult,
      profilesResult,
    ] = await Promise.all([

      supabase
        .from("requests")
        .select(`
          id,
          service,
          location,
          acreage,
          requested_date,
          status,
          notes,
          created_at,
          created_by,
          customer:customers (
            id,
            name
          ),
          tractor:tractors (
            id,
            name
          ),
          creator:profiles!created_by (
            id,
            full_name
          )
        `)
        .order("created_at", {
          ascending: false,
        })
        .limit(5),

      supabase
        .from("customers")
        .select("id"),

      supabase
        .from("tractors")
        .select("id, name, status"),

      supabase
        .from("profiles")
        .select("id, full_name, role, active")
        .eq("active", true)
        .order("full_name"),
    ]);


    if (requestsResult.error) {
      console.error(
        "Dashboard requests error:",
        requestsResult.error
      );

      setError(requestsResult.error.message);
    }

    if (customersResult.error) {
      console.error(
        "Dashboard customers error:",
        customersResult.error
      );

      setError(customersResult.error.message);
    }

    if (tractorsResult.error) {
      console.error(
        "Dashboard tractors error:",
        tractorsResult.error
      );

      setError(tractorsResult.error.message);
    }

    if (profilesResult.error) {
      console.error(
        "Dashboard profiles error:",
        profilesResult.error
      );

      setError(profilesResult.error.message);
    }


    setRequests(
      requestsResult.data || []
    );

    setCustomers(
      customersResult.data || []
    );

    setTractors(
      tractorsResult.data || []
    );

    setProfiles(
      profilesResult.data || []
    );

    setLoading(false);
  };


  useEffect(() => {
    loadDashboard();
  }, []);


  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length;


  const completedCount = requests.filter(
    (request) => request.status === "Completed"
  ).length;


  return (
    <div>

      <div className="mb-8">

        <p className="text-sm font-medium text-slate-500">
          Live database dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Good evening ðŸ‘‹
        </h1>

        <p className="mt-2 text-slate-500">
          Here's what your team has been doing.
        </p>

      </div>


      {error && (
        <DatabaseError message={error} />
      )}


      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Customer Requests"
          value={loading ? "â€¦" : requests.length}
          description="Latest requests loaded"
          icon={<ClipboardList size={21} />}
        />

        <StatCard
          title="Pending"
          value={loading ? "â€¦" : pendingCount}
          description="Need attention"
          icon={<Clock3 size={21} />}
        />

        <StatCard
          title="Completed"
          value={loading ? "â€¦" : completedCount}
          description="Completed jobs"
          icon={<CheckCircle2 size={21} />}
        />

        <StatCard
          title="Active Staff"
          value={loading ? "â€¦" : profiles.length}
          description="Active database profiles"
          icon={<Users size={21} />}
        />

      </div>


      <div className="mt-6 grid gap-6 xl:grid-cols-3">

        <section className="rounded-2xl border border-slate-200 bg-white xl:col-span-2">

          <div className="flex items-center justify-between border-b border-slate-100 p-5">

            <div>

              <h2 className="font-semibold">
                Recent Customer Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest requests from PostgreSQL
              </p>

            </div>

          </div>


          <div className="divide-y divide-slate-100">

            {loading ? (

              <div className="p-8 text-center text-sm text-slate-500">
                Loading requests...
              </div>

            ) : requests.length > 0 ? (

              requests.map((request) => (

                <div
                  key={request.id}
                  className="p-5"
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                        <ClipboardList size={20} />
                      </div>

                      <div>

                        <p className="font-semibold">
                          {request.customer?.name ||
                            "Unknown customer"}
                        </p>

                        <p className="text-sm text-slate-500">
                          {request.service} ·{" "}
                          {request.location}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Created by{" "}
                          {request.creator?.full_name ||
                            "Unknown staff"}
                        </p>

                      </div>

                    </div>


                    <div className="text-sm sm:text-right">

                      <p className="text-slate-500">
                        Tractor
                      </p>

                      <p className="font-semibold">
                        {request.tractor?.name ||
                          "Unassigned"}
                      </p>

                    </div>


                    <RequestStatus
                      status={request.status}
                    />

                  </div>

                </div>

              ))

            ) : (

              <div className="p-10 text-center">

                <ClipboardList
                  size={32}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 font-medium">
                  No requests yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Requests entered by your team will appear here.
                </p>

              </div>

            )}

          </div>

        </section>


        <section className="rounded-2xl border border-slate-200 bg-white">

          <div className="border-b border-slate-100 p-5">

            <h2 className="font-semibold">
              Live Database
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current records
            </p>

          </div>


          <div className="space-y-3 p-5">

            <DatabaseRow
              label="Customers"
              value={customers.length}
              icon={<Users size={17} />}
            />

            <DatabaseRow
              label="Tractors"
              value={tractors.length}
              icon={<Tractor size={17} />}
            />

            <DatabaseRow
              label="Active staff"
              value={profiles.length}
              icon={<Users size={17} />}
            />

            <DatabaseRow
              label="Loaded requests"
              value={requests.length}
              icon={<ClipboardList size={17} />}
            />

          </div>

        </section>

      </div>


      <section className="mt-6 rounded-2xl border border-slate-200 bg-white">

        <div className="border-b border-slate-100 p-5">

          <h2 className="font-semibold">
            Your Team
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Staff profiles currently stored in Supabase
          </p>

        </div>


        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">

          {profiles.length > 0 ? (

            profiles.map((profile) => (

              <div
                key={profile.id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-4"
              >

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold">
                  {profile.full_name
                    ?.charAt(0)
                    ?.toUpperCase() || "?"}
                </div>

                <div className="flex-1">

                  <p className="font-medium">
                    {profile.full_name}
                  </p>

                  <p className="text-xs capitalize text-slate-500">
                    {profile.role}
                  </p>

                </div>

                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

              </div>

            ))

          ) : (

            <div className="col-span-full rounded-xl bg-slate-50 p-6 text-center">

              <p className="font-medium">
                No staff profiles yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                We will connect your six staff accounts next.
              </p>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}


/* =========================================
   CUSTOMERS
========================================= */

function CustomersPage({ currentUser }) {

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddCustomer, setShowAddCustomer] =
    useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState(null);
  const [deleting, setDeleting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const loadCustomers = async () => {

    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("customers")
      .select(`
        id,
        name,
        phone,
        location,
        notes,
        created_at,
        created_by,
        creator:profiles!created_by (
          id,
          full_name
        )
      `)
      .order("created_at", {
        ascending: false,
      });


    if (error) {

      console.error(
        "Error loading customers:",
        error
      );

      setError(error.message);
      setLoading(false);

      return;
    }


    const customerIds = (data || []).map(
      (customer) => customer.id
    );


    let requestCounts = {};

    if (customerIds.length > 0) {

      const {
        data: requestData,
        error: requestError,
      } = await supabase
        .from("requests")
        .select("customer_id")
        .in("customer_id", customerIds);


      if (requestError) {

        console.error(
          "Error loading customer request counts:",
          requestError
        );

      } else {

        (requestData || []).forEach(
          (request) => {

            requestCounts[request.customer_id] =
              (requestCounts[request.customer_id] || 0) +
              1;

          }
        );

      }

    }


    const formattedCustomers =
      (data || []).map((customer) => ({
        ...customer,
        requests:
          requestCounts[customer.id] || 0,
      }));


    setCustomers(formattedCustomers);
    setLoading(false);
  };


  useEffect(() => {
    loadCustomers();
  }, []);


  const filteredCustomers =
    customers.filter((customer) => {

      const searchText =
        search.toLowerCase();

      return (
        customer.name
          .toLowerCase()
          .includes(searchText) ||

        customer.phone
          .toLowerCase()
          .includes(searchText) ||

        customer.location
          .toLowerCase()
          .includes(searchText)
      );

    });


  const addCustomer = async (customer) => {

    setError("");


    if (!currentUser?.id) {
      setError(
        "You must be signed in to create a customer."
      );
      return;
    }

    const { data, error } = await supabase
      .from("customers")
      .insert({
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        location: customer.location.trim(),
        notes:
          customer.notes?.trim() || null,
        created_by: currentUser.id,
      })
      .select(`
        id,
        name,
        phone,
        location,
        notes,
        created_at,
        created_by,
        creator:profiles!created_by (
          id,
          full_name
        )
      `)
      .single();


    if (error) {

      console.error(
        "Error adding customer:",
        error
      );

      setError(error.message);

      return;
    }


    if (data) {

      setCustomers((current) => [
        data,
        ...current.map((item) => ({
          ...item,
          requests:
            item.requests || 0,
        })),
      ]);

    }


    setShowAddCustomer(false);

    await loadCustomers();
  };


  const deleteCustomer = async (customer) => {
    if (!customer?.id) return;

    setDeleting(true);
    setError("");

    try {
      // 1. Load related requests and enforce the same rule as SQL
      const {
        data: relatedRequests,
        error: requestsError,
      } = await supabase
        .from("requests")
        .select("id, status")
        .eq("customer_id", customer.id);

      if (requestsError) {
        console.error(
          "Error loading customer requests:",
          requestsError
        );
        setError(requestsError.message);
        return;
      }

      const requests = relatedRequests || [];
      const activeRequests = requests.filter(
        (request) => request.status !== "Cancelled"
      );
      const cancelledRequests = requests.filter(
        (request) => request.status === "Cancelled"
      );

      if (activeRequests.length > 0) {
        setError(
          `Cannot delete "${customer.name}": ${activeRequests.length} request(s) are not Cancelled. Cancel them first, then try again.`
        );
        return;
      }

      const confirmed = window.confirm(
        cancelledRequests.length > 0
          ? `Delete customer "${customer.name}"?\n\nThis will also permanently remove ${cancelledRequests.length} cancelled request(s).`
          : `Delete customer "${customer.name}"?\n\nThis cannot be undone.`
      );

      if (!confirmed) return;

      // 2. Remove cancelled requests first (app-side, matches trigger)
      if (cancelledRequests.length > 0) {
        const cancelledIds = cancelledRequests.map(
          (request) => request.id
        );

        const { error: cancelDeleteError } = await supabase
          .from("requests")
          .delete()
          .in("id", cancelledIds);

        if (cancelDeleteError) {
          console.error(
            "Error deleting cancelled requests:",
            cancelDeleteError
          );
          setError(cancelDeleteError.message);
          return;
        }
      }

      // 3. Delete the customer; .select() detects RLS silent failures
      const { data: deletedRows, error: deleteError } =
        await supabase
          .from("customers")
          .delete()
          .eq("id", customer.id)
          .select("id");

      if (deleteError) {
        console.error("Error deleting customer:", deleteError);
        setError(deleteError.message);
        return;
      }

      if (!deletedRows || deletedRows.length === 0) {
        setError(
          "Customer was not deleted. Check Supabase RLS policies allow DELETE on public.customers for your role."
        );
        return;
      }

      setSelectedCustomer(null);
      setCustomers((current) =>
        current.filter((item) => item.id !== customer.id)
      );
      await loadCustomers();
    } catch (err) {
      console.error("Unexpected delete error:", err);
      setError(
        err?.message || "Unable to delete customer."
      );
    } finally {
      setDeleting(false);
    }
  };


  return (
    <div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            Customer management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Customers
          </h1>

          <p className="mt-2 text-slate-500">
            Manage customers stored in Supabase.
          </p>

        </div>


        <button
          onClick={() =>
            setShowAddCustomer(true)
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >

          <UserPlus size={18} />

          Add Customer

        </button>

      </div>


      {error && (
        <DatabaseError message={error} />
      )}


      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search by customer name, phone or location..."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />

      </div>


      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

        <div className="border-b border-slate-100 p-5">

          <h2 className="font-semibold">
            Customer List
          </h2>

          <p className="mt-1 text-sm text-slate-500">

            {loading
              ? "Loading customers..."
              : `${filteredCustomers.length} customers`}

          </p>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[650px]">

            <thead className="bg-slate-50">

              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">

                <th className="px-5 py-4">
                  Customer
                </th>

                <th className="px-5 py-4">
                  Phone
                </th>

                <th className="px-5 py-4">
                  Location
                </th>

                <th className="px-5 py-4">
                  Requests
                </th>

                <th className="px-5 py-4">
                  Created by
                </th>

                <th className="px-5 py-4">
                  Action
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    Loading customers...
                  </td>

                </tr>

              ) : filteredCustomers.length > 0 ? (

                filteredCustomers.map(
                  (customer) => (

                    <tr
                      key={customer.id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold">

                            {customer.name
                              .charAt(0)
                              .toUpperCase()}

                          </div>


                          <div>

                            <p className="font-medium">
                              {customer.name}
                            </p>

                            {customer.notes && (
                              <p className="text-xs text-slate-400">
                                {customer.notes}
                              </p>
                            )}

                          </div>

                        </div>

                      </td>


                      <td className="px-5 py-4 text-sm text-slate-600">
                        {customer.phone}
                      </td>


                      <td className="px-5 py-4 text-sm text-slate-600">

                        <div className="flex items-center gap-1">

                          <MapPin size={14} />

                          {customer.location}

                        </div>

                      </td>


                      <td className="px-5 py-4">

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">

                          {customer.requests}

                        </span>

                      </td>


                      <td className="px-5 py-4 text-sm text-slate-600">
                        {customer.creator?.full_name ||
                          "—"}
                      </td>

                      <td className="px-5 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCustomer(customer)
                          }
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-950"
                        >
                          <Eye size={15} />
                          View
                        </button>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center"
                  >

                    <Users
                      size={30}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 font-medium">
                      No customers found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Your customers table is currently empty.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </section>


      {showAddCustomer && (
        <AddCustomerModal
          onClose={() =>
            setShowAddCustomer(false)
          }
          onSave={addCustomer}
        />
      )}

      {selectedCustomer && (
        <ViewCustomerModal
          customer={selectedCustomer}
          deleting={deleting}
          error={error}
          onClose={() => {
            setSelectedCustomer(null);
            setError("");
          }}
          onDelete={deleteCustomer}
        />
      )}

    </div>
  );
}


/* =========================================
   ADD CUSTOMER
========================================= */

function AddCustomerModal({
  onClose,
  onSave,
}) {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);


  const updateField = (
    field,
    value
  ) => {

    setForm((current) => ({
      ...current,
      [field]: value,
    }));

  };


  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");


    if (!form.name.trim()) {
      setError(
        "Please enter the customer's name."
      );
      return;
    }


    if (!form.phone.trim()) {
      setError(
        "Please enter the customer's phone number."
      );
      return;
    }


    if (!form.location.trim()) {
      setError(
        "Please enter the customer's location."
      );
      return;
    }


    setSaving(true);


    try {

      await onSave(form);

    } catch (error) {

      setError(
        error?.message ||
          "Unable to save customer."
      );

    } finally {

      setSaving(false);

    }

  };


  return (
    <Modal
      title="Add Customer"
      onClose={onClose}
    >

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}


        <FormInput
          label="Customer name"
          value={form.name}
          placeholder="e.g. John Ouma"
          icon={<UserPlus size={17} />}
          onChange={(value) =>
            updateField(
              "name",
              value
            )
          }
        />


        <FormInput
          label="Phone number"
          value={form.phone}
          placeholder="e.g. 0712 345 678"
          icon={<Phone size={17} />}
          onChange={(value) =>
            updateField(
              "phone",
              value
            )
          }
        />


        <FormInput
          label="Location"
          value={form.location}
          placeholder="e.g. Kisumu"
          icon={<MapPin size={17} />}
          onChange={(value) =>
            updateField(
              "location",
              value
            )
          }
        />


        <div>

          <label className="mb-2 block text-sm font-medium">
            Notes
          </label>

          <textarea
            rows="3"
            value={form.notes}
            onChange={(event) =>
              updateField(
                "notes",
                event.target.value
              )
            }
            placeholder="Optional notes..."
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />

        </div>


        <ModalButtons
          onClose={onClose}
          saving={saving}
        />

      </form>

    </Modal>
  );
}



/* =========================================
   VIEW CUSTOMER
========================================= */

function ViewCustomerModal({
  customer,
  onClose,
  onDelete,
  deleting = false,
  error = "",
}) {
  if (!customer) return null;

  const createdAt = customer.created_at
    ? new Date(customer.created_at).toLocaleString()
    : "—";

  return (
    <Modal title="Customer details" onClose={onClose}>
      <div className="space-y-5">
        {error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-700">
            {customer.name?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-slate-900">
              {customer.name}
            </p>
            <p className="text-sm text-slate-500">
              {customer.requests || 0} request
              {(customer.requests || 0) === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <DetailRow
            icon={<Phone size={16} />}
            label="Phone"
            value={customer.phone || "—"}
          />
          <DetailRow
            icon={<MapPin size={16} />}
            label="Location"
            value={customer.location || "—"}
          />
          <DetailRow
            icon={<User size={16} />}
            label="Created by"
            value={customer.creator?.full_name || "—"}
          />
          <DetailRow
            icon={<CalendarDays size={16} />}
            label="Created at"
            value={createdAt}
          />
        </div>

        {customer.notes ? (
          <div>
            <p className="mb-1 text-sm font-medium text-slate-700">
              Notes
            </p>
            <p className="rounded-xl border border-slate-100 bg-white p-3 text-sm text-slate-600">
              {customer.notes}
            </p>
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
          <button
            type="button"
            disabled={deleting}
            onClick={() => onDelete(customer)}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={17} />
            {deleting ? "Deleting..." : "Delete customer"}
          </button>

          <button
            type="button"
            disabled={deleting}
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}


function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}


/* =========================================
   REQUESTS
========================================= */


/* =========================================
   TRACTOR OPERATIONS HELPERS
========================================= */

async function syncTractorStatusFromRequest({
  tractorId,
  nextRequestStatus,
  previousRequestStatus = null,
}) {
  if (!tractorId) return { error: null };

  // Starting work → tractor is Working
  if (nextRequestStatus === "In Progress") {
    const { error } = await supabase
      .from("tractors")
      .update({
        status: "Working",
      })
      .eq("id", tractorId);

    return { error };
  }

  // Leaving active work → free tractor if no other In Progress jobs
  const releasingStatuses = ["Completed", "Cancelled", "Pending"];
  const wasActive =
    previousRequestStatus === "In Progress" ||
    previousRequestStatus === null;

  if (
    releasingStatuses.includes(nextRequestStatus) &&
    (previousRequestStatus === "In Progress" ||
      nextRequestStatus === "Completed" ||
      nextRequestStatus === "Cancelled")
  ) {
    const { data: activeJobs, error: activeError } = await supabase
      .from("requests")
      .select("id")
      .eq("tractor_id", tractorId)
      .eq("status", "In Progress");

    if (activeError) {
      return { error: activeError };
    }

    // If other In Progress jobs remain, keep Working
    if (activeJobs && activeJobs.length > 0) {
      return { error: null };
    }

    // Only auto-return to Available when currently Working
    // (do not override Maintenance set by an administrator)
    const { data: tractor, error: tractorError } = await supabase
      .from("tractors")
      .select("id, status")
      .eq("id", tractorId)
      .single();

    if (tractorError) {
      return { error: tractorError };
    }

    if (tractor?.status === "Working") {
      const { error } = await supabase
        .from("tractors")
        .update({
          status: "Available",

        })
        .eq("id", tractorId);

      return { error };
    }
  }

  return { error: null };
}

async function assertTractorAssignable(tractorId, { allowWorking = false } = {}) {
  if (!tractorId) {
    return { error: null, tractor: null };
  }

  const { data: tractor, error } = await supabase
    .from("tractors")
    .select("id, name, status")
    .eq("id", tractorId)
    .single();

  if (error) {
    return { error, tractor: null };
  }

  if (tractor.status === "Inactive") {
    return {
      error: {
        message: `"${tractor.name}" is Inactive and cannot be assigned.`,
      },
      tractor,
    };
  }

  if (tractor.status === "Maintenance") {
    return {
      error: {
        message: `"${tractor.name}" is in Maintenance and cannot be assigned.`,
      },
      tractor,
    };
  }

  if (tractor.status === "Working" && !allowWorking) {
    return {
      error: {
        message: `"${tractor.name}" is already Working on another job. Choose an Available tractor.`,
      },
      tractor,
    };
  }

  return { error: null, tractor };
}


function RequestsPage({ currentUser }) {

  const [requests, setRequests] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tractors, setTractors] = useState([]);

  const [search, setSearch] = useState("");
  const [showAddRequest, setShowAddRequest] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const loadRequests = async () => {

    setLoading(true);
    setError("");


    const [
      requestsResult,
      customersResult,
      tractorsResult,
    ] = await Promise.all([

      supabase
        .from("requests")
        .select(`
          id,
          customer_id,
          tractor_id,
          service,
          location,
          acreage,
          requested_date,
          status,
          notes,
          created_at,
          created_by,
          customer:customers (
            id,
            name
          ),
          tractor:tractors (
            id,
            name,
            status
          ),
          creator:profiles!created_by (
            id,
            full_name
          )
        `)
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("customers")
        .select(
          "id, name"
        )
        .order("name"),

      supabase
        .from("tractors")
        .select(
          "id, name, registration_number, model, status"
        )
        .order("name"),

    ]);


    if (requestsResult.error) {

      console.error(
        "Error loading requests:",
        requestsResult.error
      );

      setError(
        requestsResult.error.message
      );

      setLoading(false);

      return;
    }


    if (customersResult.error) {

      console.error(
        "Error loading customers:",
        customersResult.error
      );

      setError(
        customersResult.error.message
      );

      setLoading(false);

      return;
    }


    if (tractorsResult.error) {

      console.error(
        "Error loading tractors:",
        tractorsResult.error
      );

      setError(
        tractorsResult.error.message
      );

      setLoading(false);

      return;
    }


    setRequests(
      requestsResult.data || []
    );

    setCustomers(
      customersResult.data || []
    );

    setTractors(
      tractorsResult.data || []
    );

    setLoading(false);
  };


  useEffect(() => {
    loadRequests();
  }, []);


  const filteredRequests =
    requests.filter((request) => {

      const searchText =
        search.toLowerCase();

      const customerName =
        request.customer?.name ||
        "";

      const tractorName =
        request.tractor?.name ||
        "";

      return (
        customerName
          .toLowerCase()
          .includes(searchText) ||

        request.service
          .toLowerCase()
          .includes(searchText) ||

        request.location
          .toLowerCase()
          .includes(searchText) ||

        tractorName
          .toLowerCase()
          .includes(searchText) ||

        request.status
          .toLowerCase()
          .includes(searchText)
      );

    });


  const addRequest = async (
    request
  ) => {

    setError("");


    if (!currentUser?.id) {
      setError(
        "You must be signed in to create a request."
      );
      return;
    }

    const tractorId = request.tractorId || null;

    // Block conflicting tractor assignments
    const { error: assignError } =
      await assertTractorAssignable(tractorId, {
        allowWorking: false,
      });

    if (assignError) {
      setError(assignError.message);
      return;
    }

    const { error } = await supabase
      .from("requests")
      .insert({
        customer_id:
          request.customerId,

        tractor_id: tractorId,

        service:
          request.service,

        location:
          request.location.trim(),

        acreage:
          Number(request.acreage),

        requested_date:
          request.date,

        status:
          request.status,

        notes:
          request.notes?.trim() || null,

        created_by: currentUser.id,
      });


    if (error) {

      console.error(
        "Error adding request:",
        error
      );

      setError(error.message);

      return;

    }

    // If created already In Progress, mark tractor Working
    if (request.status === "In Progress" && tractorId) {
      const { error: syncError } =
        await syncTractorStatusFromRequest({
          tractorId,
          nextRequestStatus: "In Progress",
          previousRequestStatus: null,
        });

      if (syncError) {
        console.error(
          "Error syncing tractor status:",
          syncError
        );
        setError(
          `Request saved, but tractor status was not updated: ${syncError.message}`
        );
      }
    }

    setShowAddRequest(false);

    await loadRequests();
  };


  const updateRequestStatus =
    async (
      id,
      status
    ) => {

      setError("");

      const existing = requests.find(
        (request) => request.id === id
      );

      if (!existing) {
        setError("Request not found.");
        return;
      }

      const previousStatus = existing.status;
      const tractorId =
        existing.tractor_id ||
        existing.tractor?.id ||
        null;

      // Moving into In Progress: tractor must be assignable
      if (
        status === "In Progress" &&
        tractorId &&
        previousStatus !== "In Progress"
      ) {
        const { error: assignError } =
          await assertTractorAssignable(tractorId, {
            // Allow if this tractor is Working only because of THIS request
            allowWorking: false,
          });

        // If Working, check whether it's only this request or another job
        if (assignError) {
          const { data: otherJobs, error: otherError } =
            await supabase
              .from("requests")
              .select("id")
              .eq("tractor_id", tractorId)
              .eq("status", "In Progress")
              .neq("id", id);

          if (otherError) {
            setError(otherError.message);
            return;
          }

          if (otherJobs && otherJobs.length > 0) {
            setError(assignError.message);
            return;
          }

          // Tractor is Working but no other In Progress jobs — allow
        }
      }

      const { error } =
        await supabase
          .from("requests")
          .update({
            status,
          })
          .eq("id", id);


      if (error) {

        console.error(
          "Error updating request:",
          error
        );

        setError(error.message);

        return;
      }

      // Sync fleet status with operations
      if (tractorId && previousStatus !== status) {
        const { error: syncError } =
          await syncTractorStatusFromRequest({
            tractorId,
            nextRequestStatus: status,
            previousRequestStatus: previousStatus,
          });

        if (syncError) {
          console.error(
            "Error syncing tractor status:",
            syncError
          );
          setError(
            `Request updated, but tractor status was not synced: ${syncError.message}`
          );
        }
      }

      setRequests(
        (currentRequests) =>
          currentRequests.map(
            (request) =>
              request.id === id
                ? {
                    ...request,
                    status,
                  }
                : request
          )
      );

      // Refresh tractor list used by Add Request modal
      await loadRequests();
    };


  return (
    <div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            Operations
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Customer Requests
          </h1>

          <p className="mt-2 text-slate-500">
            Manage tractor service requests stored in Supabase.
          </p>

        </div>


        <button
          onClick={() =>
            setShowAddRequest(true)
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >

          <Plus size={18} />

          Add Request

        </button>

      </div>


      {error && (
        <DatabaseError message={error} />
      )}


      <div className="mb-6 grid gap-4 sm:grid-cols-3">

        <MiniStat
          title="Total"
          value={requests.length}
        />

        <MiniStat
          title="Pending"
          value={
            requests.filter(
              (request) =>
                request.status ===
                "Pending"
            ).length
          }
        />

        <MiniStat
          title="Completed"
          value={
            requests.filter(
              (request) =>
                request.status ===
                "Completed"
            ).length
          }
        />

      </div>


      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search requests..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />

        </div>

      </div>


      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

        <div className="border-b border-slate-100 p-5">

          <h2 className="font-semibold">
            Requests
          </h2>

          <p className="mt-1 text-sm text-slate-500">

            {loading
              ? "Loading requests..."
              : `${filteredRequests.length} matching requests`}

          </p>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px]">

            <thead className="bg-slate-50">

              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">

                <th className="px-5 py-4">
                  Customer
                </th>

                <th className="px-5 py-4">
                  Service
                </th>

                <th className="px-5 py-4">
                  Location
                </th>

                <th className="px-5 py-4">
                  Acres
                </th>

                <th className="px-5 py-4">
                  Tractor
                </th>

                <th className="px-5 py-4">
                  Date
                </th>

                <th className="px-5 py-4">
                  Created by
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {loading ? (

                <tr>

                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    Loading requests...
                  </td>

                </tr>

              ) : filteredRequests.length > 0 ? (

                filteredRequests.map(
                  (request) => (

                    <tr
                      key={request.id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">

                        <p className="font-medium">

                          {request.customer?.name ||
                            "Unknown customer"}

                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {request.creator?.full_name
                            ? `Logged by ${request.creator.full_name}`
                            : "Database record"}
                        </p>

                      </td>


                      <td className="px-5 py-4 text-sm text-slate-600">
                        {request.service}
                      </td>


                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1 text-sm text-slate-600">

                          <MapPin size={14} />

                          {request.location}

                        </div>

                      </td>


                      <td className="px-5 py-4 text-sm text-slate-600">
                        {request.acreage}
                      </td>


                      <td className="px-5 py-4 text-sm font-medium">

                        {request.tractor?.name ||
                          "Unassigned"}

                      </td>


                      <td className="px-5 py-4 text-sm text-slate-600">
                        {request.requested_date}
                      </td>


                      <td className="px-5 py-4 text-sm text-slate-600">
                        {request.creator?.full_name ||
                          "—"}
                      </td>


                      <td className="px-5 py-4">

                        <select
                          value={
                            request.status
                          }
                          onChange={(event) =>
                            updateRequestStatus(
                              request.id,
                              event.target.value
                            )
                          }
                          className="rounded-full border-0 bg-slate-50 px-3 py-2 text-xs font-semibold outline-none"
                        >

                          {requestStatuses.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}

                        </select>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center"
                  >

                    <ClipboardList
                      size={30}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 font-medium">
                      No requests found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Your requests table is currently empty.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </section>


      {showAddRequest && (
        <AddRequestModal
          onClose={() =>
            setShowAddRequest(false)
          }
          onSave={addRequest}
          customers={customers}
          tractors={tractors}
        />
      )}

    </div>
  );
}


/* =========================================
   ADD REQUEST
========================================= */

function AddRequestModal({
  onClose,
  onSave,
  customers,
  tractors,
}) {

  const [form, setForm] = useState({
    customerId: "",
    service: "",
    location: "",
    acreage: "",
    tractorId: "",
    date: "",
    status: "Pending",
    notes: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);


  const updateField = (
    field,
    value
  ) => {

    setForm((current) => ({
      ...current,
      [field]: value,
    }));

  };


  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");


    if (!form.customerId) {
      setError(
        "Please select a customer."
      );
      return;
    }


    if (!form.service) {
      setError(
        "Please select a service."
      );
      return;
    }


    if (!form.location.trim()) {
      setError(
        "Please enter the farm/location."
      );
      return;
    }


    if (!form.acreage) {
      setError(
        "Please enter the acreage."
      );
      return;
    }


    if (
      Number(form.acreage) <= 0
    ) {
      setError(
        "Acreage must be greater than zero."
      );
      return;
    }


    if (!form.tractorId) {
      setError(
        "Please select a tractor."
      );
      return;
    }


    if (!form.date) {
      setError(
        "Please select the requested date."
      );
      return;
    }


    setSaving(true);


    try {

      await onSave(form);

    } catch (error) {

      setError(
        error?.message ||
          "Unable to save request."
      );

    } finally {

      setSaving(false);

    }

  };


  return (
    <Modal
      title="Add Customer Request"
      onClose={onClose}
    >

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}


        <FormSelect
          label="Customer"
          value={form.customerId}
          onChange={(value) =>
            updateField(
              "customerId",
              value
            )
          }
          options={customers.map(
            (customer) => ({
              value: customer.id,
              label: customer.name,
            })
          )}
          placeholder="Select customer"
        />


        <FormSelect
          label="Service requested"
          value={form.service}
          onChange={(value) =>
            updateField(
              "service",
              value
            )
          }
          options={serviceOptions}
          placeholder="Select service"
        />


        <FormInput
          label="Farm / Location"
          value={form.location}
          placeholder="e.g. Kisumu"
          icon={<MapPin size={17} />}
          onChange={(value) =>
            updateField(
              "location",
              value
            )
          }
        />


        <FormInput
          label="Acreage"
          type="number"
          value={form.acreage}
          placeholder="e.g. 10"
          onChange={(value) =>
            updateField(
              "acreage",
              value
            )
          }
        />


        <FormSelect
          label="Tractor"
          value={form.tractorId}
          onChange={(value) =>
            updateField(
              "tractorId",
              value
            )
          }
                    options={tractors
            .filter(
              (tractor) =>
                tractor.status === "Available"
            )
            .map((tractor) => ({
              value: tractor.id,
              label: `${tractor.name} — ${tractor.registration_number || tractor.model || tractor.status}`,
            }))}
          placeholder="Select tractor"
        />


        <div>

          <label className="mb-2 block text-sm font-medium">
            Requested date
          </label>

          <div className="relative">

            <CalendarDays
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="date"
              value={form.date}
              onChange={(event) =>
                updateField(
                  "date",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />

          </div>

        </div>


        <FormSelect
          label="Status"
          value={form.status}
          onChange={(value) =>
            updateField(
              "status",
              value
            )
          }
          options={requestStatuses}
          placeholder="Select status"
        />


        <div>

          <label className="mb-2 block text-sm font-medium">

            Notes

            <span className="ml-1 font-normal text-slate-400">
              (optional)
            </span>

          </label>

          <textarea
            rows="3"
            value={form.notes}
            onChange={(event) =>
              updateField(
                "notes",
                event.target.value
              )
            }
            placeholder="Additional information about the job..."
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />

        </div>


        <ModalButtons
          onClose={onClose}
          saving={saving}
        />

      </form>

    </Modal>
  );
}


/* =========================================
   SHARED MODAL
========================================= */

function Modal({
  title,
  onClose,
  children,
}) {

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-slate-100 p-5">

          <div>

            <h2 className="text-lg font-semibold">
              {title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the information below.
            </p>

          </div>


          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>

        </div>


        <div className="p-5">
          {children}
        </div>

      </div>

    </div>
  );
}


/* =========================================
   FORM INPUT
========================================= */

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
}) {

  return (
    <div>

      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>


      <div className="relative">

        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}


        <input
          type={type}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          min={
            type === "number"
              ? "0.01"
              : undefined
          }
          step={
            type === "number"
              ? "0.01"
              : undefined
          }
          className={`w-full rounded-xl border border-slate-200 py-3 pr-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 ${
            icon
              ? "pl-10"
              : "px-4"
          }`}
        />

      </div>

    </div>
  );
}


/* =========================================
   FORM SELECT
========================================= */

function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
}) {

  return (
    <div>

      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>


      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      >

        <option value="">
          {placeholder}
        </option>


        {options.map((option) => {

          const objectOption =
            typeof option ===
            "object";

          const optionValue =
            objectOption
              ? option.value
              : option;

          const optionLabel =
            objectOption
              ? option.label
              : option;

          return (
            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>
          );

        })}

      </select>

    </div>
  );
}


/* =========================================
   MODAL BUTTONS
========================================= */

function ModalButtons({
  onClose,
  saving = false,
}) {

  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

      <button
        type="button"
        onClick={onClose}
        disabled={saving}
        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>


      <button
        type="submit"
        disabled={saving}
        className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >

        <Save size={17} />

        {saving
          ? "Saving..."
          : "Save"}

      </button>

    </div>
  );
}


/* =========================================
   MINI STAT
========================================= */

function MiniStat({
  title,
  value,
}) {

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}


/* =========================================
   STAT CARD
========================================= */

function StatCard({
  title,
  value,
  description,
  icon,
}) {

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="flex items-center justify-between">

        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div className="rounded-xl bg-slate-100 p-2.5">
          {icon}
        </div>

      </div>


      <p className="mt-4 text-2xl font-bold tracking-tight">
        {value}
      </p>


      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </div>
  );
}


/* =========================================
   DATABASE ROW
========================================= */

function DatabaseRow({
  label,
  value,
  icon,
}) {

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
          {icon}
        </div>

        <span className="text-sm font-medium">
          {label}
        </span>

      </div>


      <span className="font-bold">
        {value}
      </span>

    </div>
  );
}


/* =========================================
   DATABASE ERROR
========================================= */

function DatabaseError({
  message,
}) {

  return (
    <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4">

      <p className="font-semibold text-red-800">
        Database connection error
      </p>

      <p className="mt-1 text-sm text-red-700">
        {message}
      </p>

      <p className="mt-2 text-xs text-red-600">
        If this mentions authentication or RLS,
        the current browser session needs an authenticated
        Supabase user.
      </p>

    </div>
  );
}


/* =========================================
   STATUS
========================================= */

function RequestStatus({
  status,
}) {

  const styles = {

    Pending:
      "bg-amber-50 text-amber-700",

    "In Progress":
      "bg-blue-50 text-blue-700",

    Completed:
      "bg-emerald-50 text-emerald-700",

    Cancelled:
      "bg-red-50 text-red-700",

  };


  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}





/* =========================================
   PAYMENTS
========================================= */

function PaymentsPage({ currentUser }) {
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPayments = async () => {
    setLoading(true);
    setError("");

    const [paymentsResult, customersResult, requestsResult] =
      await Promise.all([
        supabase
          .from("payments")
          .select(`
            id,
            customer_id,
            request_id,
            amount,
            payment_date,
            payment_method,
            reference,
            notes,
            created_at,
            created_by,
            customer:customers (
              id,
              name,
              phone
            ),
            request:requests (
              id,
              service,
              location,
              status
            ),
            creator:profiles!created_by (
              id,
              full_name
            )
          `)
          .order("payment_date", { ascending: false })
          .order("created_at", { ascending: false }),
        supabase
          .from("customers")
          .select("id, name")
          .order("name"),
        supabase
          .from("requests")
          .select(`
            id,
            customer_id,
            service,
            location,
            status,
            requested_date
          `)
          .order("created_at", { ascending: false }),
      ]);

    if (paymentsResult.error) {
      console.error("Error loading payments:", paymentsResult.error);
      setError(paymentsResult.error.message);
      setLoading(false);
      return;
    }

    if (customersResult.error) {
      setError(customersResult.error.message);
      setLoading(false);
      return;
    }

    if (requestsResult.error) {
      setError(requestsResult.error.message);
      setLoading(false);
      return;
    }

    setPayments(paymentsResult.data || []);
    setCustomers(customersResult.data || []);
    setRequests(requestsResult.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const filtered = payments.filter((payment) => {
    const q = search.toLowerCase();
    const customerName = payment.customer?.name || "";
    const method = payment.payment_method || "";
    const reference = payment.reference || "";
    const creator = payment.creator?.full_name || "";
    return (
      customerName.toLowerCase().includes(q) ||
      method.toLowerCase().includes(q) ||
      reference.toLowerCase().includes(q) ||
      creator.toLowerCase().includes(q) ||
      String(payment.amount).includes(q)
    );
  });

  const totalAmount = filtered.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  const addPayment = async (form) => {
    setError("");

    if (!currentUser?.id) {
      setError("You must be signed in to record a payment.");
      return;
    }

    const { error: insertError } = await supabase.from("payments").insert({
      customer_id: form.customerId,
      request_id: form.requestId || null,
      amount: Number(form.amount),
      payment_date: form.paymentDate,
      payment_method: form.paymentMethod,
      reference: form.reference?.trim() || null,
      notes: form.notes?.trim() || null,
      created_by: currentUser.id,
    });

    if (insertError) {
      console.error("Error adding payment:", insertError);
      setError(insertError.message);
      return;
    }

    setShowAdd(false);
    await loadPayments();
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Money in
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Payments
          </h1>
          <p className="mt-2 text-slate-500">
            Record customer payments linked to jobs where possible.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Record Payment
        </button>
      </div>

      {error && <DatabaseError message={error} />}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MiniStat
          title="Payments"
          value={loading ? "…" : filtered.length}
        />
        <MiniStat
          title="Total received"
          value={loading ? "…" : formatMoney(totalAmount)}
        />
        <MiniStat
          title="Customers"
          value={loading ? "…" : customers.length}
        />
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, method, reference, staff..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-semibold">Payment list</h2>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Loading payments..."
              : `${filtered.length} payment${filtered.length === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Method</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Request</th>
                <th className="px-5 py-4">Recorded by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    Loading payments...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-medium">
                        {payment.customer?.name || "Unknown"}
                      </p>
                      {payment.reference ? (
                        <p className="text-xs text-slate-400">
                          Ref: {payment.reference}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-emerald-700">
                      {formatMoney(payment.amount)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {payment.payment_method}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {payment.payment_date}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {payment.request
                        ? `${payment.request.service} · ${payment.request.location}`
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {payment.creator?.full_name || "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <CreditCard
                      size={30}
                      className="mx-auto text-slate-300"
                    />
                    <p className="mt-3 font-medium">No payments yet</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Record the first customer payment to start tracking revenue.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showAdd && (
        <AddPaymentModal
          customers={customers}
          requests={requests}
          onClose={() => setShowAdd(false)}
          onSave={addPayment}
        />
      )}
    </div>
  );
}


function AddPaymentModal({ customers, requests, onClose, onSave }) {
  const [form, setForm] = useState({
    customerId: "",
    requestId: "",
    amount: "",
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMethod: "M-Pesa",
    reference: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const customerRequests = requests.filter(
    (request) =>
      !form.customerId || request.customer_id === form.customerId
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.customerId) {
      setError("Please select a customer.");
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    if (!form.paymentDate) {
      setError("Please select the payment date.");
      return;
    }
    if (!form.paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err?.message || "Unable to save payment.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Record payment" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <FormSelect
          label="Customer"
          value={form.customerId}
          onChange={(value) => {
            updateField("customerId", value);
            updateField("requestId", "");
          }}
          options={customers.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
          placeholder="Select customer"
        />

        <FormSelect
          label="Related request (optional)"
          value={form.requestId}
          onChange={(value) => updateField("requestId", value)}
          options={customerRequests.map((r) => ({
            value: r.id,
            label: `${r.service} · ${r.location} · ${r.status}`,
          }))}
          placeholder="No specific request"
        />

        <FormInput
          label="Amount (KSh)"
          type="number"
          value={form.amount}
          placeholder="e.g. 15000"
          onChange={(value) => updateField("amount", value)}
        />

        <FormSelect
          label="Payment method"
          value={form.paymentMethod}
          onChange={(value) => updateField("paymentMethod", value)}
          options={paymentMethods}
          placeholder="Select method"
        />

        <div>
          <label className="mb-2 block text-sm font-medium">
            Payment date
          </label>
          <div className="relative">
            <CalendarDays
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="date"
              value={form.paymentDate}
              onChange={(e) => updateField("paymentDate", e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>

        <FormInput
          label="Reference"
          value={form.reference}
          placeholder="e.g. M-Pesa code"
          onChange={(value) => updateField("reference", value)}
        />

        <div>
          <label className="mb-2 block text-sm font-medium">
            Notes
            <span className="ml-1 font-normal text-slate-400">
              (optional)
            </span>
          </label>
          <textarea
            rows="3"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Any extra details..."
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        <ModalButtons onClose={onClose} saving={saving} />
      </form>
    </Modal>
  );
}


/* =========================================
   EXPENSES
========================================= */

function ExpensesPage({ currentUser }) {
  const [expenses, setExpenses] = useState([]);
  const [tractors, setTractors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExpenses = async () => {
    setLoading(true);
    setError("");

    const [expensesResult, tractorsResult, requestsResult] =
      await Promise.all([
        supabase
          .from("expenses")
          .select(`
            id,
            category,
            description,
            amount,
            expense_date,
            tractor_id,
            request_id,
            reference,
            notes,
            created_at,
            created_by,
            tractor:tractors (
              id,
              name,
              registration_number
            ),
            request:requests (
              id,
              service,
              location,
              status
            ),
            creator:profiles!created_by (
              id,
              full_name
            )
          `)
          .order("expense_date", { ascending: false })
          .order("created_at", { ascending: false }),
        supabase
          .from("tractors")
          .select("id, name, registration_number, status")
          .order("name"),
        supabase
          .from("requests")
          .select("id, service, location, status")
          .order("created_at", { ascending: false }),
      ]);

    if (expensesResult.error) {
      console.error("Error loading expenses:", expensesResult.error);
      setError(expensesResult.error.message);
      setLoading(false);
      return;
    }
    if (tractorsResult.error) {
      setError(tractorsResult.error.message);
      setLoading(false);
      return;
    }
    if (requestsResult.error) {
      setError(requestsResult.error.message);
      setLoading(false);
      return;
    }

    setExpenses(expensesResult.data || []);
    setTractors(tractorsResult.data || []);
    setRequests(requestsResult.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const filtered = expenses.filter((expense) => {
    const q = search.toLowerCase();
    return (
      (expense.category || "").toLowerCase().includes(q) ||
      (expense.description || "").toLowerCase().includes(q) ||
      (expense.tractor?.name || "").toLowerCase().includes(q) ||
      (expense.creator?.full_name || "").toLowerCase().includes(q) ||
      (expense.reference || "").toLowerCase().includes(q) ||
      String(expense.amount).includes(q)
    );
  });

  const totalAmount = filtered.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  const addExpense = async (form) => {
    setError("");

    if (!currentUser?.id) {
      setError("You must be signed in to record an expense.");
      return;
    }

    const { error: insertError } = await supabase.from("expenses").insert({
      category: form.category,
      description: form.description.trim(),
      amount: Number(form.amount),
      expense_date: form.expenseDate,
      tractor_id: form.tractorId || null,
      request_id: form.requestId || null,
      reference: form.reference?.trim() || null,
      notes: form.notes?.trim() || null,
      created_by: currentUser.id,
    });

    if (insertError) {
      console.error("Error adding expense:", insertError);
      setError(insertError.message);
      return;
    }

    setShowAdd(false);
    await loadExpenses();
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Money out
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Expenses
          </h1>
          <p className="mt-2 text-slate-500">
            Track fuel, repairs, labour and other operating costs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Record Expense
        </button>
      </div>

      {error && <DatabaseError message={error} />}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MiniStat
          title="Expenses"
          value={loading ? "…" : filtered.length}
        />
        <MiniStat
          title="Total spent"
          value={loading ? "…" : formatMoney(totalAmount)}
        />
        <MiniStat
          title="Fuel entries"
          value={
            loading
              ? "…"
              : expenses.filter((e) => e.category === "Fuel").length
          }
        />
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by category, description, tractor, staff..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-semibold">Expense list</h2>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Loading expenses..."
              : `${filtered.length} expense${filtered.length === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Tractor</th>
                <th className="px-5 py-4">Recorded by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    Loading expenses...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{expense.description}</p>
                      {expense.reference ? (
                        <p className="text-xs text-slate-400">
                          Ref: {expense.reference}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-red-700">
                      {formatMoney(expense.amount)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {expense.expense_date}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {expense.tractor
                        ? `${expense.tractor.name}${
                            expense.tractor.registration_number
                              ? ` · ${expense.tractor.registration_number}`
                              : ""
                          }`
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {expense.creator?.full_name || "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <Wallet
                      size={30}
                      className="mx-auto text-slate-300"
                    />
                    <p className="mt-3 font-medium">No expenses yet</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Record fuel, repairs and other costs to track spend.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showAdd && (
        <AddExpenseModal
          tractors={tractors}
          requests={requests}
          onClose={() => setShowAdd(false)}
          onSave={addExpense}
        />
      )}
    </div>
  );
}


function AddExpenseModal({ tractors, requests, onClose, onSave }) {
  const [form, setForm] = useState({
    category: "Fuel",
    description: "",
    amount: "",
    expenseDate: new Date().toISOString().slice(0, 10),
    tractorId: "",
    requestId: "",
    reference: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.category) {
      setError("Please select a category.");
      return;
    }
    if (!form.description.trim()) {
      setError("Please enter a description.");
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    if (!form.expenseDate) {
      setError("Please select the expense date.");
      return;
    }

    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err?.message || "Unable to save expense.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Record expense" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <FormSelect
          label="Category"
          value={form.category}
          onChange={(value) => updateField("category", value)}
          options={expenseCategories}
          placeholder="Select category"
        />

        <FormInput
          label="Description"
          value={form.description}
          placeholder="e.g. Diesel for MF 375"
          onChange={(value) => updateField("description", value)}
        />

        <FormInput
          label="Amount (KSh)"
          type="number"
          value={form.amount}
          placeholder="e.g. 8500"
          onChange={(value) => updateField("amount", value)}
        />

        <div>
          <label className="mb-2 block text-sm font-medium">
            Expense date
          </label>
          <div className="relative">
            <CalendarDays
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="date"
              value={form.expenseDate}
              onChange={(e) => updateField("expenseDate", e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>

        <FormSelect
          label="Tractor (optional)"
          value={form.tractorId}
          onChange={(value) => updateField("tractorId", value)}
          options={tractors.map((t) => ({
            value: t.id,
            label: `${t.name}${
              t.registration_number ? ` · ${t.registration_number}` : ""
            }`,
          }))}
          placeholder="No specific tractor"
        />

        <FormSelect
          label="Related request (optional)"
          value={form.requestId}
          onChange={(value) => updateField("requestId", value)}
          options={requests.map((r) => ({
            value: r.id,
            label: `${r.service} · ${r.location} · ${r.status}`,
          }))}
          placeholder="No specific request"
        />

        <FormInput
          label="Reference"
          value={form.reference}
          placeholder="e.g. receipt number"
          onChange={(value) => updateField("reference", value)}
        />

        <div>
          <label className="mb-2 block text-sm font-medium">
            Notes
            <span className="ml-1 font-normal text-slate-400">
              (optional)
            </span>
          </label>
          <textarea
            rows="3"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Any extra details..."
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        <ModalButtons onClose={onClose} saving={saving} />
      </form>
    </Modal>
  );
}


/* =========================================
   TRACTORS
========================================= */

function TractorsPage({ currentUser }) {
  const [tractors, setTractors] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTractor, setEditingTractor] = useState(null);
  const [selectedTractor, setSelectedTractor] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = currentUser?.role === "owner";

  const loadTractors = async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("tractors")
      .select(`
        id,
        name,
        registration_number,
        model,
        status,
        notes,
        created_at
      `)
      .order("name", { ascending: true });

    if (queryError) {
      console.error("Error loading tractors:", queryError);
      setError(queryError.message);
      setLoading(false);
      return;
    }

    setTractors(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadTractors();
  }, []);

  const filteredTractors = tractors.filter((tractor) => {
    const searchText = search.toLowerCase();
    return (
      (tractor.name || "").toLowerCase().includes(searchText) ||
      (tractor.registration_number || "")
        .toLowerCase()
        .includes(searchText) ||
      (tractor.model || "").toLowerCase().includes(searchText) ||
      (tractor.status || "").toLowerCase().includes(searchText)
    );
  });

  const availableCount = tractors.filter(
    (t) => t.status === "Available"
  ).length;
  const workingCount = tractors.filter(
    (t) => t.status === "Working"
  ).length;
  const inactiveCount = tractors.filter(
    (t) => t.status === "Inactive"
  ).length;

  const openAdd = () => {
    setEditingTractor(null);
    setShowForm(true);
  };

  const openEdit = (tractor) => {
    setSelectedTractor(null);
    setEditingTractor(tractor);
    setShowForm(true);
  };

  const saveTractor = async (form) => {
    if (!isAdmin) {
      setError("Only administrators can manage tractors.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      registration_number: form.registration_number.trim(),
      model: form.model.trim() || null,
      status: form.status,
      notes: form.notes?.trim() || null,
    };

    let result;

    if (editingTractor?.id) {
      result = await supabase
        .from("tractors")
        .update({
          ...payload,
        })
        .eq("id", editingTractor.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from("tractors")
        .insert(payload)
        .select()
        .single();
    }

    setSaving(false);

    if (result.error) {
      console.error("Error saving tractor:", result.error);
      setError(result.error.message);
      return;
    }

    setShowForm(false);
    setEditingTractor(null);
    await loadTractors();
  };

  const setTractorStatus = async (tractor, status) => {
    if (!isAdmin) {
      setError("Only administrators can manage tractors.");
      return;
    }

    setError("");

    const { error: updateError } = await supabase
      .from("tractors")
      .update({
        status
      })
      .eq("id", tractor.id);

    if (updateError) {
      console.error("Error updating tractor status:", updateError);
      setError(updateError.message);
      return;
    }

    setSelectedTractor(null);
    await loadTractors();
  };

  const deactivateTractor = async (tractor) => {
    const confirmed = window.confirm(
      `Deactivate "${tractor.name}"?\n\nIt will no longer appear in the Add Request tractor list.`
    );
    if (!confirmed) return;
    await setTractorStatus(tractor, "Inactive");
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Fleet management
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Tractors
          </h1>
          <p className="mt-2 text-slate-500">
            Manage tractors stored in Supabase. Active units appear in
            the request form automatically.
          </p>
        </div>

        {isAdmin ? (
          <button
            type="button"
            onClick={openAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={18} />
            Add Tractor
          </button>
        ) : null}
      </div>

      {error && <DatabaseError message={error} />}

      {!isAdmin ? (
        <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
          You can view the fleet. Only administrators can add, edit, or
          deactivate tractors.
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MiniStat
          title="Available"
          value={loading ? "…" : availableCount}
        />
        <MiniStat
          title="Working"
          value={loading ? "…" : workingCount}
        />
        <MiniStat
          title="Inactive"
          value={loading ? "…" : inactiveCount}
        />
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, registration, model or status..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-semibold">Tractor list</h2>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Loading tractors..."
              : `${filteredTractors.length} tractor${
                  filteredTractors.length === 1 ? "" : "s"
                }`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Registration</th>
                <th className="px-5 py-4">Model</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    Loading tractors...
                  </td>
                </tr>
              ) : filteredTractors.length > 0 ? (
                filteredTractors.map((tractor) => (
                  <tr key={tractor.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                          <Tractor size={18} />
                        </div>
                        <div>
                          <p className="font-medium">{tractor.name}</p>
                          {tractor.notes ? (
                            <p className="text-xs text-slate-400 line-clamp-1">
                              {tractor.notes}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {tractor.registration_number || "—"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {tractor.model || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <TractorStatusBadge status={tractor.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedTractor(tractor)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-950"
                        >
                          <Eye size={15} />
                          View
                        </button>

                        {isAdmin ? (
                          <button
                            type="button"
                            onClick={() => openEdit(tractor)}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-950"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center">
                    <Tractor
                      size={30}
                      className="mx-auto text-slate-300"
                    />
                    <p className="mt-3 font-medium">No tractors found</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {isAdmin
                        ? "Add your first tractor to start assigning jobs."
                        : "The tractors table is currently empty."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showForm && (
        <TractorFormModal
          tractor={editingTractor}
          saving={saving}
          onClose={() => {
            setShowForm(false);
            setEditingTractor(null);
          }}
          onSave={saveTractor}
        />
      )}

      {selectedTractor && (
        <ViewTractorModal
          tractor={selectedTractor}
          isAdmin={isAdmin}
          onClose={() => setSelectedTractor(null)}
          onEdit={() => openEdit(selectedTractor)}
          onDeactivate={() => deactivateTractor(selectedTractor)}
          onActivate={() =>
            setTractorStatus(selectedTractor, "Available")
          }
        />
      )}
    </div>
  );
}


function TractorStatusBadge({ status }) {
  const styles = {
    Available: "bg-emerald-50 text-emerald-700",
    Working: "bg-blue-50 text-blue-700",
    Maintenance: "bg-amber-50 text-amber-700",
    Inactive: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}


function TractorFormModal({ tractor, onClose, onSave, saving = false }) {
  const isEdit = Boolean(tractor?.id);

  const [form, setForm] = useState({
    name: tractor?.name || "",
    registration_number: tractor?.registration_number || "",
    model: tractor?.model || "",
    status: tractor?.status || "Available",
    notes: tractor?.notes || "",
  });
  const [formError, setFormError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Please enter the tractor name.");
      return;
    }

    if (!form.registration_number.trim()) {
      setFormError("Please enter the registration number.");
      return;
    }

    if (!form.status) {
      setFormError("Please select a status.");
      return;
    }

    try {
      await onSave(form);
    } catch (err) {
      setFormError(err?.message || "Unable to save tractor.");
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit tractor" : "Add tractor"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {formError ? (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {formError}
          </div>
        ) : null}

        <FormInput
          label="Tractor name"
          value={form.name}
          placeholder="e.g. Massey Ferguson"
          icon={<Tractor size={17} />}
          onChange={(value) => updateField("name", value)}
        />

        <FormInput
          label="Registration number"
          value={form.registration_number}
          placeholder="e.g. KDA 123A"
          onChange={(value) =>
            updateField("registration_number", value)
          }
        />

        <FormInput
          label="Model"
          value={form.model}
          placeholder="e.g. MF 375"
          onChange={(value) => updateField("model", value)}
        />

        <FormSelect
          label="Status"
          value={form.status}
          onChange={(value) => updateField("status", value)}
          options={tractorStatuses}
          placeholder="Select status"
        />

        <div>
          <label className="mb-2 block text-sm font-medium">
            Notes
            <span className="ml-1 font-normal text-slate-400">
              (optional)
            </span>
          </label>
          <textarea
            rows="3"
            value={form.notes}
            onChange={(event) =>
              updateField("notes", event.target.value)
            }
            placeholder="Service notes, attachments, location..."
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        <ModalButtons onClose={onClose} saving={saving} />
      </form>
    </Modal>
  );
}


function ViewTractorModal({
  tractor,
  isAdmin,
  onClose,
  onEdit,
  onDeactivate,
  onActivate,
}) {
  if (!tractor) return null;

  return (
    <Modal title="Tractor details" onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <Tractor size={24} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">
              {tractor.name}
            </p>
            <div className="mt-1">
              <TractorStatusBadge status={tractor.status} />
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <DetailRow
            icon={<Tractor size={16} />}
            label="Registration"
            value={tractor.registration_number || "—"}
          />
          <DetailRow
            icon={<ClipboardList size={16} />}
            label="Model"
            value={tractor.model || "—"}
          />
          <DetailRow
            icon={<CalendarDays size={16} />}
            label="Created"
            value={
              tractor.created_at
                ? new Date(tractor.created_at).toLocaleString()
                : "—"
            }
          />
        </div>

        {tractor.notes ? (
          <div>
            <p className="mb-1 text-sm font-medium text-slate-700">
              Notes
            </p>
            <p className="rounded-xl border border-slate-100 bg-white p-3 text-sm text-slate-600">
              {tractor.notes}
            </p>
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
          {isAdmin ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              {tractor.status === "Inactive" ? (
                <button
                  type="button"
                  onClick={onActivate}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  Set Available
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onDeactivate}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
                >
                  <Trash2 size={17} />
                  Deactivate
                </button>
              )}

              <button
                type="button"
                onClick={onEdit}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Pencil size={17} />
                Edit
              </button>
            </div>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}


/* =========================================
   STAFF
========================================= */

function StaffPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfiles = async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("profiles")
      .select("id, full_name, role, active, created_at")
      .order("full_name", { ascending: true });

    if (queryError) {
      console.error("Error loading staff profiles:", queryError);
      setError(queryError.message);
      setLoading(false);
      return;
    }

    setProfiles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProfiles();

    const channel = supabase
      .channel("staff-profiles")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        () => {
          loadProfiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const activeProfiles = profiles.filter((p) => p.active);
  const inactiveProfiles = profiles.filter((p) => !p.active);
  const adminCount = profiles.filter((p) => p.role === "owner").length;

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">
          Team management
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Staff
        </h1>

        <p className="mt-2 text-slate-500">
          Profiles stored in Supabase. Staff accounts are managed through
          authentication, not hard-coded names.
        </p>
      </div>

      {error && <DatabaseError message={error} />}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MiniStat title="Total profiles" value={loading ? "…" : profiles.length} />
        <MiniStat title="Active staff" value={loading ? "…" : activeProfiles.length} />
        <MiniStat title="Administrators" value={loading ? "…" : adminCount} />
      </div>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-semibold">Active staff</h2>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Loading profiles..."
              : `${activeProfiles.length} active profile${activeProfiles.length === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full py-8 text-center text-sm text-slate-500">
              Loading staff...
            </div>
          ) : activeProfiles.length > 0 ? (
            activeProfiles.map((person) => (
              <div
                key={person.id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-sm font-bold">
                  {getInitials(person.full_name)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {person.full_name}
                  </p>
                  <p className="text-xs capitalize text-slate-500">
                    {person.role === "owner" ? "Administrator" : "Staff"}
                  </p>
                </div>

                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-xl bg-slate-50 p-6 text-center">
              <Users size={28} className="mx-auto text-slate-300" />
              <p className="mt-3 font-medium">No active staff</p>
              <p className="mt-1 text-sm text-slate-500">
                Active profiles from public.profiles will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      {inactiveProfiles.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-semibold">Inactive profiles</h2>
            <p className="mt-1 text-sm text-slate-500">
              {inactiveProfiles.length} inactive profile
              {inactiveProfiles.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {inactiveProfiles.map((person) => (
              <div
                key={person.id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 opacity-70"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-500">
                  {getInitials(person.full_name)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-600">
                    {person.full_name}
                  </p>
                  <p className="text-xs capitalize text-slate-400">
                    {person.role === "owner" ? "Administrator" : "Staff"}
                  </p>
                </div>

                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


/* =========================================
   NAVIGATION
========================================= */

function NavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}) {

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
        active
          ? "bg-white text-slate-950"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >

      <Icon size={19} />

      {label}

    </button>
  );
}


/* =========================================
   COMING SOON
========================================= */

function ComingSoonPage({
  page,
}) {

  return (
    <div className="flex min-h-[60vh] items-center justify-center">

      <div className="text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <ClipboardList size={28} />
        </div>


        <h1 className="mt-5 text-2xl font-bold">
          {page}
        </h1>


        <p className="mt-2 max-w-md text-slate-500">
          This section is part of the application architecture
          and we'll build it next.
        </p>

      </div>

    </div>
  );
}


export default App;