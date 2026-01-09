import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: Unsubscribe from push notifications
 * Removes push subscription from database
 */
export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();

    // TODO: Remove subscription from database
    // Example with Supabase:
    // const { error } = await supabase
    //   .from('push_subscriptions')
    //   .delete()
    //   .eq('endpoint', subscription.endpoint);

    console.log('Push unsubscription received:', subscription);

    return NextResponse.json(
      { success: true, message: 'Unsubscribed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to unsubscribe:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}