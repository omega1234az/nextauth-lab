"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, Loader, CheckCircle } from 'lucide-react';



const Signup = () => {
  // สถานะของฟอร์ม
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // สถานะสำหรับ UI
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  /**
   * จัดการการเปลี่ยนแปลงค่าในฟอร์ม
   */
  const handleChange = () => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * ตรวจสอบความซับซ้อนของรหัสผ่าน
   */
  const checkPasswordStrength = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    const isStrong = hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    
    if (!hasMinLength) return { isStrong: false, message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' };
    if (!hasUpperCase) return { isStrong: false, message: 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว' };
    if (!hasLowerCase) return { isStrong: false, message: 'รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว' };
    if (!hasNumbers) return { isStrong: false, message: 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว' };
    if (!hasSpecialChar) return { isStrong: false, message: 'รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว' };
    
    return { isStrong: true, message: 'รหัสผ่านมีความปลอดภัย' };
  };

  /**
   * ตรวจสอบความถูกต้องของฟอร์ม
   */
  const validateForm = () => {
    if (!formData.name.trim()) {
      return { isValid: false, message: 'กรุณากรอกชื่อ' };
    }
    
    if (!formData.email.trim()) {
      return { isValid: false, message: 'กรุณากรอกอีเมล' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return { isValid: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' };
    }
    
    if (!formData.password) {
      return { isValid: false, message: 'กรุณากรอกรหัสผ่าน' };
    }
    
    const passwordCheck = checkPasswordStrength(formData.password);
    if (!passwordCheck.isStrong) {
      return { isValid: false, message: passwordCheck.message };
    }
    
    if (formData.password !== formData.confirmPassword) {
      return { isValid: false, message: 'รหัสผ่านไม่ตรงกัน' };
    }
    
    return { isValid: true, message: '' };
  };

  /**
   * จัดการการส่งฟอร์ม
   */
  const handleSubmit = async () => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // ตรวจสอบความถูกต้องของฟอร์ม
    const validation = validateForm();
    if (!validation.isValid) {
      setError(validation.message);
      setIsSubmitting(false);
      return;
    }

    try {
      // จำลองการส่งข้อมูลไปยัง API
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'การลงทะเบียนล้มเหลว');
      }

      // เมื่อลงทะเบียนสำเร็จ
      console.log('ลงทะเบียนสำเร็จ');
      
      // เปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบหรือแดชบอร์ด
      window.location.href = '/signin?registered=true';
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด โปรดลองอีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * เปลี่ยนการแสดงรหัสผ่าน
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * เปลี่ยนการแสดงยืนยันรหัสผ่าน
   */
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">สมัครสมาชิก</h2>
          <p className="mt-2 text-sm text-gray-600">สร้างบัญชีใหม่เพื่อเข้าใช้งานระบบ</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* ชื่อ */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                ชื่อ
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-3 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ชื่อของคุณ"
                />
              </div>
            </div>

            {/* อีเมล */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                อีเมล
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-3 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* รหัสผ่าน */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                รหัสผ่าน
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-12 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ
              </p>
            </div>

            {/* ยืนยันรหัสผ่าน */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                ยืนยันรหัสผ่าน
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full py-2 pl-10 pr-12 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader size={18} className="mr-2 h-5 w-5 animate-spin" />
                  กำลังดำเนินการ...
                </>
              ) : (
                <>
                  <CheckCircle size={18} className="mr-2 h-5 w-5" />
                  สมัครสมาชิก
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;