# Email Verification Setup

This application uses email verification for login. Follow these steps to configure email sending:

## 1. Database Setup

First, create the verification codes table in your database:

```bash
psql -d your_database_name -f sql/create_verification_codes.sql
```

Or if using a connection string:
```bash
psql $DATABASE_URL -f sql/create_verification_codes.sql
```

## 2. Email Configuration

Add the following environment variables to your `.env` file:

### For Gmail (Recommended for Development)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
```

**Important:** For Gmail, you need to:
1. Enable 2-Step Verification
2. Generate an "App Password" from your Google Account settings
3. Use the app password (not your regular password) in `SMTP_PASSWORD`

### For Other SMTP Providers

```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@domain.com
```

### For Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@outlook.com
```

### For Production (SendGrid, Mailgun, etc.)

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

## 3. How It Works

1. User logs in with email and password
2. System generates a 6-digit verification code
3. Code is stored in the database with a 10-minute expiration
4. Verification email is sent to the user
5. User enters the code on the verification page
6. If valid, user receives JWT token and can access the app

## 4. Testing

To test email functionality:

1. Make sure your SMTP credentials are correctly set in `.env`
2. Start the API server: `npm run dev`
3. Try logging in through the frontend
4. Check your email for the verification code
5. Enter the code to complete login

## Troubleshooting

- **Email not sending**: Check SMTP credentials and ensure your email provider allows SMTP access
- **"Failed to send verification email"**: Check console logs for detailed error messages
- **Gmail issues**: Make sure you're using an App Password, not your regular password
- **Port issues**: Some providers use port 465 with `SMTP_SECURE=true` instead of 587

