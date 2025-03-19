"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, Loader, CheckCircle } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = schema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = {};
      result.error.errors.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 text-center">สมัครสมาชิก</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {Object.keys(formData).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">{field}</label>
              <input
                type={field.includes("password") && !field.includes("confirm") ? (showPassword ? "text" : "password") : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full py-2 px-3 border rounded-md"
              />
              {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
            </div>
          ))}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
            {isSubmitting ? "กำลังดำเนินการ..." : "สมัครสมาชิก"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          มีบัญชีอยู่แล้ว? <Link href="/signin" className="text-blue-600">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;