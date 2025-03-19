import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();

// ตรวจสอบข้อมูลด้วย Zod
const registerSchema = z.object({
  name: z.string().min(2, "ชื่อสั้นเกินไป"),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
});

// สมัครสมาชิก
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    // ตรวจสอบว่ามีอีเมลนี้อยู่แล้วหรือไม่
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "อีเมลนี้ถูกใช้ไปแล้ว" }, { status: 400 });
    }

    // แฮชรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // บันทึกผู้ใช้ใหม่
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json({ message: "สมัครสมาชิกสำเร็จ", user: newUser }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
