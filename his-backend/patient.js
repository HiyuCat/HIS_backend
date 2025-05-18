// routes/patient.js
const express = require("express");
const router = express.Router();
const db = require("./db");

// GET All Patients (with Diagnoses)
router.get("/patients", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.patient_id, p.patient_name, p.age, p.gender, 
                   IFNULL(d.diagnosis, 'ยังไม่มีข้อมูล') AS diagnosis
            FROM patients p
            LEFT JOIN diagnoses d ON p.patient_id = d.patient_id
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ error: "Error fetching patients" });
    }
});

// Add New Patient
router.post("/patients", async (req, res) => {
    try {
        const { patient_name, age, gender, diagnosis } = req.body;

        // Insert into patients
        const [result] = await db.query(
            "INSERT INTO patients (patient_name, age, gender) VALUES (?, ?, ?)",
            [patient_name, age, gender]
        );

        // Insert into diagnoses
        if (diagnosis) {
            await db.query(
                "INSERT INTO diagnoses (diagnosis, patient_id) VALUES (?, ?)",
                [diagnosis, result.insertId]
            );
        }

        res.status(201).json({ message: "Patient added", patient_id: result.insertId });
    } catch (error) {
        console.error("Error adding patient:", error);
        res.status(500).json({ error: "Error adding patient" });
    }
});

// Update Patient
router.put("/patients/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { patient_name, age, gender, diagnosis } = req.body;

        // Update patient
        await db.query(
            "UPDATE patients SET patient_name = ?, age = ?, gender = ? WHERE patient_id = ?",
            [patient_name, age, gender, id]
        );

        // Update or Insert diagnosis
        const [existingDiagnosis] = await db.query(
            "SELECT * FROM diagnoses WHERE patient_id = ?",
            [id]
        );

        if (existingDiagnosis.length > 0) {
            // Update existing diagnosis
            await db.query(
                "UPDATE diagnoses SET diagnosis = ? WHERE patient_id = ?",
                [diagnosis, id]
            );
        } else {
            // Insert new diagnosis
            await db.query(
                "INSERT INTO diagnoses (diagnosis, patient_id) VALUES (?, ?)",
                [diagnosis, id]
            );
        }

        res.json({ message: "Patient updated" });
    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ error: "Error updating patient" });
    }
});

// Delete Patient
router.delete("/patients/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Delete diagnosis first (due to foreign key constraint)
        await db.query("DELETE FROM diagnoses WHERE patient_id = ?", [id]);

        // Delete patient
        await db.query("DELETE FROM patients WHERE patient_id = ?", [id]);

        res.json({ message: "Patient deleted" });
    } catch (error) {
        console.error("Error deleting patient:", error);
        res.status(500).json({ error: "Error deleting patient" });
    }
});

module.exports = router;
