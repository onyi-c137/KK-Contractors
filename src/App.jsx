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
} from "lucide-react";

import { useEffect, useState } from "react";
import Login from "./Login";
import { getCurrentProfile } from "./lib/profile";

// IMPORTANT:
// If your existing Supabase client is in a different location,
// change ONLY this import path.
import { supabase } from "./lib/supabase";


/* =========================================
   CONSTANTS
========================================= */

const staffNames = [
  "Oscar",
  "Collins",
  "Brian",
  "William",
  "Elizabeth",
  "Purity",
];

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
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
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
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl bg-white/5 p-3 text-left transition hover:bg-white/10"
            title="Sign out"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
              {profile.full_name
                ?.split(" ")
                .map((name) => name[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {profile.full_name}
              </p>

              <p className="truncate text-xs capitalize text-slate-400">
                {profile.role === "owner" ? "Administrator" : "Staff"}
              </p>
            </div>

            <span className="text-xs text-slate-400">
              Logout
            </span>
          </button>
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

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-slate-100"
              title="Sign out"
            >
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">
                  {profile.full_name}
                </p>

                <p className="text-xs capitalize text-slate-500">
                  {profile.role === "owner"
                    ? "Administrator"
                    : "Staff"}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                {profile.full_name
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </button>

          </div>

        </header>


        <main className="p-4 sm:p-6 lg:p-8">

          {currentPage === "Dashboard" && (
            <DashboardPage />
          )}

          {currentPage === "Customers" && (
            <CustomersPage />
          )}

          {currentPage === "Requests" && (
            <RequestsPage />
          )}

          {currentPage !== "Dashboard" &&
            currentPage !== "Customers" &&
            currentPage !== "Requests" && (
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

function DashboardPage() {

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
          customer:customers (
            id,
            name
          ),
          tractor:tractors (
            id,
            name
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
                          {request.service} Â·{" "}
                          {request.location}
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

function CustomersPage() {

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddCustomer, setShowAddCustomer] =
    useState(false);

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
        created_at
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


    const { data, error } = await supabase
      .from("customers")
      .insert({
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        location: customer.location.trim(),
        notes:
          customer.notes?.trim() || null,
      })
      .select()
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
                  Action
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {loading ? (

                <tr>

                  <td
                    colSpan="5"
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


                      <td className="px-5 py-4">

                        <button
                          onClick={() =>
                            alert(
                              `Customer ID: ${customer.id}`
                            )
                          }
                          className="text-sm font-semibold text-slate-700 hover:text-slate-950"
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="5"
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
   REQUESTS
========================================= */

function RequestsPage() {

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
          updated_at,
          customer:customers (
            id,
            name
          ),
          tractor:tractors (
            id,
            name,
            status
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


    const { error } = await supabase
      .from("requests")
      .insert({
        customer_id:
          request.customerId,

        tractor_id:
          request.tractorId || null,

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

        // created_by deliberately left null
        // until staff authentication/profiles
        // are connected.
      });


    if (error) {

      console.error(
        "Error adding request:",
        error
      );

      setError(error.message);

      return;

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
                  Status
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {loading ? (

                <tr>

                  <td
                    colSpan="7"
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
                          Database record
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
                    colSpan="7"
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
                tractor.status !==
                "Inactive"
            )
            .map((tractor) => ({
              value: tractor.id,
              label: `${tractor.name} â€” ${tractor.status}`,
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