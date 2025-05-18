import React, { useState, useEffect } from "react";

const PatientForm = ({ isNew, patient, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patient_name: "",
    age: "",
    gender: "",
    diagnosis: "",
  });

  useEffect(() => {
    if (!isNew && patient) {
      setFormData({
        patient_name: patient.patient_name || "",
        age: patient.age || "",
        gender: patient.gender || "",
        diagnosis: patient.diagnosis || "",
      });
    }
  }, [isNew, patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value === "" ? "" : parseInt(value, 10)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      <div>
        <label>ชื่อคนไข้:</label>
        <input
          name="patient_name"
          value={formData.patient_name}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2"
        />
      </div>
      <div>
        <label>อายุ:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
          min="0"
          max="120"
          className="w-full border rounded-md p-2"
        />
      </div>
      <div>
        <label>เพศ:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2"
        >
          <option value="">-- กรุณาเลือกเพศ --</option>
          <option value="Male">ชาย</option>
          <option value="Female">หญิง</option>
        </select>
      </div>
      <div>
        <label>การวินิจฉัย:</label>
        <input
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          บันทึก
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
};

export default PatientForm;
