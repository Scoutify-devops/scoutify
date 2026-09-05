import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request) {
  try {
    const supabase = await createClient();

    const { email, password, full_name, role, primary_position, province } = await request.json();

    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { success: false, error: 'Missing required registration fields' },
        { status: 400 }
      );
    }

    // 2. Register the user inside Supabase Auth (handles background hashing)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role
        }
      }
    });

    if (authError) throw authError;

    const user = authData?.user;

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User registration failed' },
        { status: 500 }
      );
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id, 
          full_name,
          role,
          primary_position: role === 'player' ? primary_position : null,
          province
        }
      ])
      .select();

    if (profileError) {
      throw profileError;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! Verification email sent if enabled.',
        user: {
          id: user.id,
          email: user.email,
          profile: profileData[0]
        }
      },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
