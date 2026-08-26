// Supabase Edge Function: create-staff
// Deploy: supabase functions deploy create-staff
// Secrets: uses SUPABASE_SERVICE_ROLE_KEY (auto in Edge Functions)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Caller must be authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user: caller },
      error: callerError,
    } = await callerClient.auth.getUser();

    if (callerError || !caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);

    // Only active owners may create staff
    const { data: callerProfile, error: profileError } = await admin
      .from("profiles")
      .select("id, role, active")
      .eq("id", caller.id)
      .single();

    if (
      profileError ||
      !callerProfile ||
      callerProfile.role !== "owner" ||
      !callerProfile.active
    ) {
      return new Response(
        JSON.stringify({ error: "Only administrators can create staff" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.json();
    const full_name = String(body.full_name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!full_name || !email || password.length < 8) {
      return new Response(
        JSON.stringify({
          error: "full_name, email, and password (min 8 chars) are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 1) Create Auth user (service role)
    const { data: created, error: createError } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name },
      });

    if (createError || !created.user) {
      return new Response(
        JSON.stringify({
          error: createError?.message || "Failed to create auth user",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const userId = created.user.id;

    // 2) Upsert profile — always staff, never owner
    const { error: upsertError } = await admin.from("profiles").upsert(
      {
        id: userId,
        full_name,
        role: "staff",
        active: true,
      },
      { onConflict: "id" }
    );

    if (upsertError) {
      // Roll back auth user if profile fails
      await admin.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: upsertError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        user_id: userId,
        message: `Staff account created for ${full_name}. They can log in with ${email}.`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message || "Unexpected error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
