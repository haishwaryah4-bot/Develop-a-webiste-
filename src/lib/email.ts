export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<{ success: boolean; id?: string }> {
  // If RESEND_API_KEY is present, send via Resend
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Hackathon Platform <notifications@hackathon.dev>",
          to,
          subject,
          html,
        }),
      });
      const data = await res.json();
      return { success: res.ok, id: data.id };
    } catch (e) {
      console.error("Failed to send email via Resend:", e);
    }
  }

  // Fallback: Mock email delivery logger in development/test
  console.log(`[EMAIL DISPATCH] To: ${to} | Subject: "${subject}"`);
  return { success: true, id: `mock-${Date.now()}` };
}

export function getWelcomeEmailHtml(name: string): string {
  return `
    <div style="font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px; border-radius: 12px;">
      <h1 style="color: #6366f1; font-size: 24px;">Welcome to Hackathon Platform, ${name}!</h1>
      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
        You're all set to build, collaborate, and innovate with the world's most talented creators.
      </p>
      <div style="margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/hackathons" style="background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Explore Hackathons
        </a>
      </div>
    </div>
  `;
}

export function getRegistrationEmailHtml(userName: string, hackathonTitle: string): string {
  return `
    <div style="font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px; border-radius: 12px;">
      <h1 style="color: #10b981; font-size: 24px;">Registration Confirmed!</h1>
      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
        Hi ${userName}, you have successfully registered for <strong>${hackathonTitle}</strong>.
      </p>
      <p style="color: #94a3b8; font-size: 14px;">
        You can now form or join a team, join the community discussions, and start preparing your project.
      </p>
    </div>
  `;
}

export function getSubmissionEmailHtml(teamName: string, projectTitle: string, hackathonTitle: string): string {
  return `
    <div style="font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px; border-radius: 12px;">
      <h1 style="color: #6366f1; font-size: 24px;">Submission Received! 🚀</h1>
      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
        Team <strong>${teamName}</strong> has submitted <strong>${projectTitle}</strong> for <strong>${hackathonTitle}</strong>.
      </p>
      <p style="color: #94a3b8; font-size: 14px;">
        Our panel of judges will review your project once the submission window closes.
      </p>
    </div>
  `;
}
