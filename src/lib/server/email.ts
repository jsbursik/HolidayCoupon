import type { CouponInput } from "$lib";

interface EmailConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  fromEmail: string;
  recipientEmail1: string;
  recipientEmail2: string;
}

interface GraphTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface EmailMessage {
  message: {
    subject: string;
    body: {
      contentType: "Text" | "HTML";
      content: string;
    };
    toRecipients: Array<{
      emailAddress: {
        address: string;
      };
    }>;
  };
}

async function getAccessToken(config: EmailConfig): Promise<string> {
  const url = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`;

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get access token: ${response.status} ${errorText}`);
  }

  const tokenData: GraphTokenResponse = await response.json();
  return tokenData.access_token;
}

async function sendEmail(accessToken: string, fromEmail: string, toEmail: string, subject: string, body: string): Promise<void> {
  const url = `https://graph.microsoft.com/v1.0/users/${fromEmail}/sendMail`;

  const emailMessage: EmailMessage = {
    message: {
      subject,
      body: {
        contentType: "HTML",
        content: body,
      },
      toRecipients: [
        {
          emailAddress: {
            address: toEmail,
          },
        },
      ],
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailMessage),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email: ${response.status} ${errorText}`);
  }
}

function generateEmailBody(couponData: CouponInput & { code: string }): string {
  return `
    <h2>New Coupon Generated</h2>
    <p>A new coupon has been generated with the following details:</p>
    <table style="border-collapse: collapse; width: 100%;">
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Coupon Code:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${couponData.code}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Name:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${couponData.first_name} ${couponData.last_name}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Email:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${couponData.email}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Phone:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${couponData.phone}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Generated:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${new Date().toLocaleString()}</td>
      </tr>
    </table>
    <p><em>This is an automated notification from the Holiday Coupon system.</em></p>
  `;
}

export async function sendCouponNotifications(couponData: CouponInput & { code: string }, env: Record<string, string>): Promise<void> {
  console.log('sendCouponNotifications called for coupon:', couponData.code);
  
  const config: EmailConfig = {
    clientId: env.GRAPH_CLIENT_ID,
    clientSecret: env.GRAPH_CLIENT_SECRET,
    tenantId: env.GRAPH_TENANT_ID,
    fromEmail: env.FROM_EMAIL,
    recipientEmail1: env.RECIPIENT_EMAIL_1,
    recipientEmail2: env.RECIPIENT_EMAIL_2,
  };

  console.log('Email config:', {
    clientId: config.clientId ? 'SET' : 'MISSING',
    clientSecret: config.clientSecret ? 'SET' : 'MISSING',
    tenantId: config.tenantId ? 'SET' : 'MISSING',
    fromEmail: config.fromEmail,
    recipientEmail1: config.recipientEmail1,
    recipientEmail2: config.recipientEmail2
  });

  // Validate required environment variables
  if (!config.clientId || !config.clientSecret || !config.tenantId || !config.fromEmail) {
    throw new Error("Missing required Microsoft Graph configuration");
  }

  if (!config.recipientEmail1 && !config.recipientEmail2) {
    throw new Error("At least one recipient email must be configured");
  }

  try {
    const accessToken = await getAccessToken(config);
    const subject = `New Holiday Coupon Generated - ${couponData.first_name} ${couponData.last_name}`;
    const emailBody = generateEmailBody(couponData);

    const emailPromises: Promise<void>[] = [];

    if (config.recipientEmail1) {
      emailPromises.push(sendEmail(accessToken, config.fromEmail, config.recipientEmail1, subject, emailBody));
    }

    if (config.recipientEmail2) {
      emailPromises.push(sendEmail(accessToken, config.fromEmail, config.recipientEmail2, subject, emailBody));
    }

    await Promise.all(emailPromises);
  } catch (error) {
    console.error("Failed to send coupon notifications:", error);
    // Don't throw the error to prevent it from breaking the coupon creation process
    // You might want to log this to a monitoring service instead
  }
}
