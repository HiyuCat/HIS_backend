import React, { useState } from "react";

const PatientList = ({ patients, userRole, onEdit, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(patient =>
    (patient.patient_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.diagnosis || "").toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            รายชื่อคนไข้
          </h1>
        </div>
      </header>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <div className="relative">
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="ค้นหาตามชื่อหรือการวินิจฉัย"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {userRole === "admin" && (
              <button
                onClick={onAdd}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                เพิ่มคนไข้ใหม่
              </button>
            )}
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                  <li key={patient.id}>
                    <div className="px-4 py-4 flex items-center sm:px-6">
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-blue-600 truncate">
                            {patient.patient_name || "ไม่ทราบชื่อ"}
                          </h3>
                          <div className="mt-2 flex">
                            <div className="flex items-center text-sm text-gray-500">
                              <p>อายุ: {patient.age || "ไม่ระบุ"} ปี</p>
                            </div>
                            <div className="ml-6 flex items-center text-sm text-gray-500">
                              <p>การวินิจฉัย: {patient.diagnosis || "ยังไม่มีข้อมูล"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-5 flex-shrink-0 flex space-x-2">
                        <button
                          onClick={() => onEdit(patient)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          แก้ไข
                        </button>
                        {userRole === "admin" && (
                          <button
                            onClick={() => onDelete(patient.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            ลบ
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-center text-gray-500">
                  ไม่พบข้อมูลคนไข้ที่ตรงกับการค้นหา
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientList;
