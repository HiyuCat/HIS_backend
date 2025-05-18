import React, { useState, useEffect } from 'react';
import axios from 'axios';  // เพิ่ม axios
import Login from './Login';
import MainLayout from './MainLayout';
import Dashboard from './Dashboard';
import PatientList from './PatientList';
import PatientForm from './PatientForm';
import Unauthorized from './Unauthorized';

const HospitalSystem = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const users = [
    { username: 'doctor1', password: 'doctor123', role: 'doctor' },
    { username: 'admin1', password: 'admin123', role: 'admin' }
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('his_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setCurrentPage('dashboard');
      fetchPatients();
    }
  }, []);

  // ฟังก์ชันดึงข้อมูลคนไข้จาก API
  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      const response = await axios.get('http://localhost:5000/api/patients'); // เปลี่ยนตรงนี้ให้ตรง port backend
      setPatients(response.data);
      setLoadingPatients(false);
    } catch (error) {
      console.error('โหลดข้อมูลคนไข้ล้มเหลว:', error);
      setLoadingPatients(false);
    }
  };


  const handleLogin = (username, password) => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      const userInfo = { username: foundUser.username, role: foundUser.role };
      setUser(userInfo);
      localStorage.setItem('his_user', JSON.stringify(userInfo));
      setCurrentPage('dashboard');
      fetchPatients();
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('his_user');
    setCurrentPage('login');
    setPatients([]);
  };

  // เพิ่มคนไข้ - ส่งข้อมูลไป backend แล้วโหลดข้อมูลใหม่
  const handleAddPatient = async (patientData) => {
    try {
      await axios.post('http://localhost:5000/api/patients', patientData);
      fetchPatients();
      setCurrentPage('patients');
    } catch (error) {
      alert('เพิ่มข้อมูลคนไข้ล้มเหลว');
      console.error(error);
    }
  };

  // แก้ไขคนไข้ - ส่งข้อมูลไป backend แล้วโหลดข้อมูลใหม่
  const handleUpdatePatient = async (patientData) => {
    if (!selectedPatient) return;
    try {
      await axios.put(`http://localhost:5000/api/patients/${selectedPatient.id}`, patientData);
      setSelectedPatient(null);
      fetchPatients();
      setCurrentPage('patients');
    } catch (error) {
      alert('แก้ไขข้อมูลคนไข้ล้มเหลว');
      console.error(error);
    }
  };

  // ลบคนไข้ - ส่งคำขอลบ backend แล้วโหลดข้อมูลใหม่
  const handleDeletePatient = async (id) => {
    if (window.confirm('คุณต้องการลบข้อมูลคนไข้รายนี้หรือไม่?')) {
      try {
        await axios.delete(`http://localhost:5000/api/patients/${id}`);
        fetchPatients();
      } catch (error) {
        alert('ลบข้อมูลคนไข้ล้มเหลว');
        console.error(error);
      }
    }
  };

  const navigate = (page, data = null) => {
    setCurrentPage(page);
    if (page === 'edit-patient' && data) {
      setSelectedPatient(data);
    } else {
      setSelectedPatient(null);
    }
  };

  const renderPage = () => {
    if (!user && currentPage !== 'login') {
      return <Login onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'dashboard':
        return (
          <MainLayout user={user} onLogout={handleLogout} navigate={navigate}>
            <Dashboard patients={patients} loading={loadingPatients} />
          </MainLayout>
        );
      case 'patients':
        return (
          <MainLayout user={user} onLogout={handleLogout} navigate={navigate}>
            <PatientList
              patients={patients}
              userRole={user?.role}
              onEdit={(patient) => navigate('edit-patient', patient)}
              onDelete={handleDeletePatient}
              onAdd={() => navigate('add-patient')}
              loading={loadingPatients}
            />
          </MainLayout>
        );
      case 'add-patient':
        if (user?.role !== 'admin') {
          return (
            <MainLayout user={user} onLogout={handleLogout} navigate={navigate}>
              <Unauthorized navigate={navigate} />
            </MainLayout>
          );
        }
        return (
          <MainLayout user={user} onLogout={handleLogout} navigate={navigate}>
            <PatientForm
              isNew={true}
              onSubmit={handleAddPatient}
              onCancel={() => navigate('patients')}
            />
          </MainLayout>
        );
      case 'edit-patient':
        return (
          <MainLayout user={user} onLogout={handleLogout} navigate={navigate}>
            <PatientForm
              isNew={false}
              patient={selectedPatient}
              onSubmit={handleUpdatePatient}
              onCancel={() => navigate('patients')}
            />
          </MainLayout>
        );
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return <div className="bg-gray-50 min-h-screen">{renderPage()}</div>;
};

export default HospitalSystem;
