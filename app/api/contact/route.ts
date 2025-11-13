import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import ContactEmail from "@/emails/ContactEmail";
import { sanityClient } from "@/lib/sanity/client";

const resendApiKey = process.env.RESEND_API_KEY,
  contactEmail = process.env.CONTACT_EMAIL,
  fromEmail = process.env.FROM_EMAIL,
  sanityApiToken = process.env.SANITY_API_TOKEN;

if (!resendApiKey) {
  console.error("RESEND_API_KEY is not defined in environment variables");
}
if (!contactEmail) {
  console.error("CONTACT_EMAIL is not defined in environment variables");
}
if (!fromEmail) {
  console.error("FROM_EMAIL is not defined in environment variables");
}
if (!sanityApiToken) {
  console.error("SANITY_API_TOKEN is not defined in environment variables");
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    // Validate required fields
    if (!name || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const results = {
      sanity: { success: false, id: null as string | null, error: null as any },
      email: { success: false, id: null as string | null, error: null as any },
    };

    // Send email using Resend
    if (resend && contactEmail && fromEmail) {
      try {
        const { data, error } = await resend.emails.send({
          from: `Contact Form <${fromEmail}>`,
          to: contactEmail,
          subject: `New Contact Form Submission from ${name}`,
          react: ContactEmail({
            name,
            email,
            phone,
            message,
          }),
        });

        if (error) {
          results.email = { success: false, id: null, error };
          console.error("Resend error:", error);
        } else {
          results.email = { success: true, id: data?.id, error: null };
          console.log("Email sent successfully");
        }
      } catch (emailError) {
        results.email = { success: false, id: null, error: emailError };
        console.error("Failed to send email:", emailError);
      }
    }

    // Save data to Sanity CMS
    if (sanityApiToken) {
      try {
        const submissionData = {
          _type: "formSubmissions",
          fullname: name.trim(),
          email: email?.trim() || "",
          phone: phone.trim(),
          message: message?.trim() || "",
          submissionDate: new Date().toISOString(),
          status: "new",
          notes: "",
        };

        const sanityResult = await sanityClient.create(submissionData);
        results.sanity = { success: true, id: sanityResult._id, error: null };
        console.log("Form submission saved to Sanity:", sanityResult._id);
      } catch (sanityError) {
        results.sanity = { success: false, id: null, error: sanityError };
        console.error("Sanity CMS error:", sanityError);
      }
    }

    if (results.sanity.success || results.email.success) {
      return NextResponse.json(
        {
          message: "Form submitted successfully",
          results,
          success: true,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          error: "Failed to send your request, please try again",
          success: false,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 },
    );
  }
}
