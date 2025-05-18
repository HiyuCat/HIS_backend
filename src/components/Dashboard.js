import React, { useState, useEffect } from 'react';

const Dashboard = ({ patients }) => {
  const [stats, setStats] = useState({
    total: 0,
    byAge: { children: 0, adults: 0, elderly: 0 },
    byDiagnosis: {}
  });
  
  useEffect(() => {
    // คำนวณข้อมูลสถิติ
    const calculatedStats = {
      total: patients.length,
      byAge: {
        children: patients.filter(p => p.age < 18).length,
        adults: patients.filter(p => p.age >= 18 && p.age < 60).length,
        elderly: patients.filter(p => p.age >= 60).length
      },
      byDiagnosis: {}
    };
    
    // นับตามการวินิจฉัย
    patients.forEach(patient => {
      if (calculatedStats.byDiagnosis[patient.diagnosis]) {
        calculatedStats.byDiagnosis[patient.diagnosis]++;
      } else {
        calculatedStats.byDiagnosis[patient.diagnosis] = 1;
      }
    });
    
    setStats(calculatedStats);
  }, [patients]);
  
  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">ข้อมูลสถิติคนไข้</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    จำนวนคนไข้ทั้งหมด
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-blue-600">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    คนไข้ผู้ใหญ่
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-blue-600">
                    {stats.byAge.adults}
                  </dd>
                </dl>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    คนไข้สูงอายุ
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-blue-600">
                    {stats.byAge.elderly}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">จำนวนคนไข้แยกตามการวินิจฉัย</h3>
              <div className="mt-5">
                <ul className="space-y-3">
                  {Object.entries(stats.byDiagnosis).map(([diagnosis, count]) => (
                    <li key={diagnosis} className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-blue-500 h-4 rounded-full"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm text-gray-600">{diagnosis}: {count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;