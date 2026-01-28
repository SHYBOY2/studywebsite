
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, examName } = body;

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // -------------------------------------------------------------------------
        // REAL WORLD IMPLEMENTATION:
        // This is where you would save the email to your database (e.g., Supabase, Postgre)
        // or send it to an email marketing service (e.g., Resend, SendGrid, Mailchimp).
        //
        // Example with Resend:
        // await resend.emails.send({
        //   from: 'updates@yourdomain.com',
        //   to: email,
        //   subject: `Subscription Confirmed: ${examName}`,
        //   html: `<p>You are now subscribed to updates for <strong>${examName}</strong>.</p>`
        // });
        // -------------------------------------------------------------------------

        // For now, we simulate a successful subscription
        console.log(`[New Subscription] Email: ${email}, Exam: ${examName}`);

        return NextResponse.json(
            { message: 'Subscription successful', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
