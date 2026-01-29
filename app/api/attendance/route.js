import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebaseAdmin';
import * as admin from 'firebase-admin';

export async function POST(req) {
  const body = await req.json();
  const { rfidTag, method } = body;
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    // 1. Find Student
    const studentsRef = db.collection('students');
    const snapshot = await studentsRef.where('rfidTag', '==', rfidTag).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const studentDoc = snapshot.docs[0];
    const studentData = studentDoc.data();

    // 2. Check Duplicate
    const attendanceRef = db.collection('attendance');
    const existingCheck = await attendanceRef
      .where('studentId', '==', studentDoc.id)
      .where('date', '==', todayStr)
      .get();

    if (!existingCheck.empty) {
      return NextResponse.json({ error: "Already marked present today" }, { status: 400 });
    }

    // 3. Mark Attendance
    await attendanceRef.add({
      studentId: studentDoc.id,
      studentName: studentData.name,
      date: todayStr,
      status: 'Present',
      method: method,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return NextResponse.json({ success: true, student: studentData });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
