'use client';
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h1>School Attendance System</h1>
      <button 
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: 'black', color: 'white', borderRadius: '5px' }}
      >
        Teacher Login with Google
      </button>
    </div>
  );
}
