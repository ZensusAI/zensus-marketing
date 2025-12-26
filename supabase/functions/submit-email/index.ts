import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubmitEmailRequest {
  email: string;
  consent: boolean;
}

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour window

function getRateLimitKey(req: Request): string {
  // Get client IP from various headers
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfIp = req.headers.get("cf-connecting-ip");
  return forwarded?.split(",")[0]?.trim() || realIp || cfIp || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count++;
  return false;
}

// Email validation
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  
  // Trim and check length (max 254 characters per RFC 5321)
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  
  // Basic email regex validation
  const emailRegex = /^[^\s@<>()[\]\\,;:]+@[^\s@<>()[\]\\,;:]+\.[^\s@<>()[\]\\,;:]+$/;
  return emailRegex.test(trimmed);
}

// Sanitize email input
function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 254);
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIp = getRateLimitKey(req);
    if (isRateLimited(clientIp)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const NOTION_API_KEY = Deno.env.get("NOTION_API_KEY");
    const NOTION_DATABASE_ID = Deno.env.get("NOTION_DATABASE_ID");

    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
      console.error("Missing Notion API key or database ID");
      return new Response(
        JSON.stringify({ error: "Unable to process request. Please try again later." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    let body: SubmitEmailRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { email, consent } = body;

    // Validate email format
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email);

    console.log(`Processing email submission from IP: ${clientIp}`);

    // Create a new page in Notion database
    const notionResponse = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          Email: {
            title: [
              {
                text: {
                  content: sanitizedEmail,
                },
              },
            ],
          },
          Consent: {
            checkbox: Boolean(consent),
          },
          "Signed Up": {
            date: {
              start: new Date().toISOString(),
            },
          },
        },
      }),
    });

    if (!notionResponse.ok) {
      const errorData = await notionResponse.text();
      console.error("Notion API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Unable to process request. Please try again later." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const notionData = await notionResponse.json();
    console.log("Successfully added to Notion:", notionData.id);

    return new Response(
      JSON.stringify({ success: true, message: "Email submitted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in submit-email function:", error);
    return new Response(
      JSON.stringify({ error: "Unable to process request. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
