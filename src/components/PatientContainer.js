import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientList from "./PatientList";
import PatientForm from "./PatientForm";

const PatientContainer = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);

    // โหลดข้อมูลคนไข้จาก backend
    const fetchPatients = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:5000/api/patients");
            // map data ให้เรียบร้อย
            const data = res.data.map((p) => ({
                id: p.patient_id,
                patient_name: p.patient_name,
                age: p.age,
                gender: p.gender || "",
                diagnosis: p.diagnosis || "ยังไม่มีข้อมูล",
            }));
            setPatients(data);
            setLoading(false);
        } catch (err) {
            setError("โหลดข้อมูลผู้ป่วยไม่สำเร็จ");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // เปิดฟอร์มเพื่อเพิ่มคนไข้ใหม่
    const handleAdd = () => {
        setEditingPatient(null);
        setShowForm(true);
    };

    // เปิดฟอร์มแก้ไขคนไข้
    const handleEdit = (patient) => {
        setEditingPatient(patient);
        setShowForm(true);
    };

    // ลบคนไข้
    const handleDelete = async (id) => {
        if (window.confirm("คุณแน่ใจจะลบคนไข้นี้ไหม?")) {
            try {
                await axios.delete(`http://localhost:5000/api/patients/${id}`);
                setPatients(patients.filter((p) => p.id !== id));
            } catch (err) {
                alert("ลบข้อมูลไม่สำเร็จ");
            }
        }
    };

    // บันทึกข้อมูลเพิ่ม/แก้ไขคนไข้
    const handleSubmit = async (data) => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/patients/${editingPatientId}`, data);
            } else {
                await axios.post("http://localhost:5000/api/patients", data);
            }
            fetchPatients(); // โหลดข้อมูลใหม่
            setShowForm(false);
        } catch (error) {
            alert("เพิ่มข้อมูลล้มเหลว");
            console.error(error);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    if (loading) return <p>กำลังโหลดข้อมูล...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            {showForm ? (
                <PatientForm
                    isNew={!editingPatient}
                    patient={editingPatient}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            ) : (
                <PatientList
                    patients={patients}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
};

export default PatientContainer;
