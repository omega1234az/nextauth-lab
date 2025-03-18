"use client"

import React, { useState } from 'react';
import { Mail, Lock, Loader, LogIn } from 'lucide-react';



/**
 * คอมโพเนนท์สำหรับหน้าล็อกอินพร้อมการตรวจสอบแบบฟอร์มและการจัดการสถานะ
 */
const Login = () => {
  // การจัดการสถานะแบบฟอร์ม
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // การจัดการสถานะ UI
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * อัปเดตสถานะแบบฟอร์มเมื่อมีการเปลี่ยนแปลงค่าในอินพุต
   */
  const handleChange = () => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * จัดการการส่งแบบฟอร์มและการตรวจสอบสิทธิ์
   */
  const handleSubmit = async () => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // ตรวจสอบแบบฟอร์ม
    if (!formData.email || !formData.password) {
      setError('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
      setIsSubmitting(false);
      return;
    }

    try {
      // คำขอยืนยันตัวตน API
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }

      // จัดการเมื่อล็อกอินสำเร็จ
      const data = await response.json();
      console.log('เข้าสู่ระบบสำเร็จ', data);
      
      // เปลี่ยนเส้นทางหรืออัปเดตสถานะแอปพลิเคชัน
      window.location.href = '/dashboard';
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'การเข้าสู่ระบบล้มเหลว โปรดลองอีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * จัดการการล็อกอินผ่าน Google
   */
  const handleGoogleLogin = () => {
    // โค้ดสำหรับการล็อกอินผ่าน Google
    window.location.href = '/api/auth/google';
  };

  /**
   * จัดการการล็อกอินผ่าน Facebook
   */
  const handleFacebookLogin = () => {
    // โค้ดสำหรับการล็อกอินผ่าน Facebook
    window.location.href = '/api/auth/facebook';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">เข้าสู่ระบบ</h2>
          <p className="mt-2 text-sm text-gray-600">กรอกข้อมูลเพื่อเข้าถึงบัญชีของคุณ</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                อีเมล
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  className="w-full py-2 pl-10 pr-3 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                รหัสผ่าน
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full py-2 pl-10 pr-3 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">
                จดจำฉัน
              </label>
            </div>

            <div className="text-sm">
              <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                ลืมรหัสผ่าน?
              </a>
            </div>
          </div>
          
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader size={18} className="w-5 h-5 mr-2 animate-spin" />
                กำลังดำเนินการ...
              </>
            ) : (
              <>
                <LogIn size={18} className="w-5 h-5 mr-2" />
                เข้าสู่ระบบ
              </>
            )}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white">หรือเข้าสู่ระบบด้วย</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.0003 4.93896C13.650 4.93896 15.0637 5.47696 16.1857 6.48496L19.8053 3.00996C17.8153 1.14496 15.1037 0 12.0003 0C7.31229 0 3.25229 2.69096 1.28229 6.60996L5.27029 9.70496C6.2283 6.86896 8.87929 4.93896 12.0003 4.93896Z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.2639C23.49 11.4439 23.415 10.6439 23.2725 9.86395H12V14.6359H18.4725C18.2175 16.0759 17.37 17.2939 16.0725 18.0839L19.8975 21.0969C22.125 19.0089 23.49 15.9239 23.49 12.2639Z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.2969C5.02 13.5769 4.89 12.8039 4.89 12.0009C4.89 11.1979 5.02 10.4249 5.27 9.70486L1.282 6.60986C0.47 8.22986 0 10.0639 0 12.0009C0 13.9379 0.47 15.7719 1.282 17.3919L5.27 14.2969Z"
              />
              <path
                fill="#34A853"
                d="M12.0004 24.0008C15.1037 24.0008 17.8137 22.9568 19.8974 21.0968L16.0724 18.0838C15.0024 18.8048 13.6284 19.2478 12.0004 19.2478C8.87939 19.2478 6.2284 17.3178 5.2704 14.4818L1.2824 17.5768C3.2524 21.4958 7.31239 24.0008 12.0004 24.0008Z"
              />
            </svg>
            Google
          </button>
          
          <button
            onClick={handleFacebookLogin}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-800 border border-transparent rounded-md shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
            Facebook
          </button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ยังไม่มีบัญชี?{' '}
            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              สมัครสมาชิก
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;