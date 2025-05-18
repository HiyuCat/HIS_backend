import React from 'react';

const Unauthorized = ({ navigate }) => {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto bg-white p-10 rounded-xl shadow-lg">
        <div>
          <svg className="mx-auto h-16 w-16 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            ไม่มีสิทธิ์เข้าถึง
          </h2>
          <p className="mt-2 text-gray-600">
            คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบหากต้องการสิทธิ์เพิ่มเติม
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              กลับสู่หน้าหลัก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;