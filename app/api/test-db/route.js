import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all records from your new profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: "Successfully connected to Supabase cloud!", 
      profilesCount: data.length,
      data: data 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
