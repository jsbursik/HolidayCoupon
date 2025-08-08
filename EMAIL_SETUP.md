# Email Notification Setup Guide

This guide explains how to configure email notifications for the Holiday Coupon system using Microsoft Graph API with Exchange Online.

## Overview

When a coupon is successfully validated, the system will send email notifications to two configured recipients with the form information.

## Prerequisites

1. Microsoft 365 subscription with Exchange Online
2. Azure AD tenant access (admin permissions required)
3. Cloudflare Pages deployment

## Step 1: Create Microsoft App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Configure:
   - Name: "Holiday Coupon Email Service"
   - Supported account types: "Accounts in this organizational directory only"
   - Redirect URI: Leave blank
5. Click **Register**

## Step 2: Configure API Permissions

1. In your app registration, go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Choose **Application permissions**
5. Add the following permission:
   - `Mail.Send` (Send mail as any user)
6. Click **Grant admin consent**

## Step 3: Create Client Secret

1. In your app registration, go to **Certificates & secrets**
2. Click **New client secret**
3. Add description: "Holiday Coupon Email Secret"
4. Choose expiration (recommend 24 months)
5. Click **Add**
6. **Copy the secret value immediately** - you won't be able to see it again

## Step 4: Gather Required Information

Collect the following values:

- **Tenant ID**: From app registration Overview page
- **Client ID**: From app registration Overview page  
- **Client Secret**: From the previous step
- **From Email**: The email address that will send notifications (must be a valid Exchange Online mailbox)
- **Recipient Emails**: The two email addresses that should receive notifications

## Step 5: Configure Cloudflare Pages Environment Variables

### Option A: Cloudflare Dashboard (Recommended for Production)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account and Pages project
3. Go to **Settings** > **Environment variables**
4. Add the following variables:
   - `GRAPH_CLIENT_ID`: Your app registration Client ID
   - `GRAPH_CLIENT_SECRET`: Your app registration Client Secret
   - `GRAPH_TENANT_ID`: Your Azure AD Tenant ID
   - `FROM_EMAIL`: Email address for sending notifications
   - `RECIPIENT_EMAIL_1`: First recipient email address
   - `RECIPIENT_EMAIL_2`: Second recipient email address (optional)

### Option B: Local Development (wrangler.toml)

For local testing, you can uncomment and fill in the variables in `wrangler.toml`:

```toml
[vars]
GRAPH_CLIENT_ID = "your-client-id"
GRAPH_CLIENT_SECRET = "your-client-secret"  
GRAPH_TENANT_ID = "your-tenant-id"
FROM_EMAIL = "notifications@yourdomain.com"
RECIPIENT_EMAIL_1 = "recipient1@yourdomain.com"
RECIPIENT_EMAIL_2 = "recipient2@yourdomain.com"
```

**⚠️ Warning**: Never commit secrets to version control. Keep the wrangler.toml variables commented in production.

## Step 6: Test the Integration

1. Deploy your changes to Cloudflare Pages
2. Submit a test form on your coupon page
3. Check that:
   - The coupon is created successfully
   - Both recipients receive email notifications
   - No errors appear in Cloudflare Pages logs

## Troubleshooting

### Common Issues

1. **"Insufficient privileges" error**
   - Ensure admin consent was granted for Mail.Send permission
   - Verify the service account has necessary Exchange permissions

2. **"Authentication failed" error**
   - Double-check Client ID, Client Secret, and Tenant ID
   - Ensure the client secret hasn't expired

3. **"Mail.Send permission denied"**
   - Verify the FROM_EMAIL address exists in your Exchange Online
   - Ensure the app registration has Mail.Send application permission

4. **Emails not being received**
   - Check spam/junk folders
   - Verify recipient email addresses are correct
   - Check Cloudflare Pages function logs for errors

### Logging and Monitoring

Email sending errors are logged to the console and won't break the coupon creation process. Check Cloudflare Pages function logs for debugging information.

## Security Considerations

- Store all secrets as environment variables, never in code
- Use the principle of least privilege for API permissions
- Regularly rotate client secrets
- Monitor email sending for unusual activity
- Consider implementing rate limiting if needed

## Alternative Solutions

If Microsoft Graph API doesn't work for your setup, consider:

1. **Cloudflare Email Workers**: Use Cloudflare's MailChannels integration
2. **Third-party services**: Resend, SendGrid, or similar services
3. **SMTP (if still supported)**: Direct SMTP integration with Exchange Online

## Support

For issues with this setup, check:
- Cloudflare Pages documentation
- Microsoft Graph API documentation
- Azure AD app registration troubleshooting guides