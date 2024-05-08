import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';



function PatientDetails() {
    const [patients, setPatients] = useState([]);
    const [title, setTitle] = useState('')

    async function handleCreateDeck(e: React.FormEvent) {
        e.preventDefault();
        await fetch('http://localhost:8000/create_patient', {
            method: 'POST',
            body: JSON.stringify(
                { 
                    title,
                }
            ),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setTitle('')
    }

    useEffect(() => {
        async function fetchPatients() {
            const patients = await fetch('http://localhost:8000/get_patients');
            setPatients(await patients.json());
        }
        fetchPatients();
    }, [])

    return <div className="App">
        <ul className="patients">
            {patients.map((patient: any) => {
                return <div>
                    <li key={`/patient/${patient._id}`}>{patient.title}</li>
                </div>
            })}
        </ul>
        <form onSubmit={handleCreateDeck}>
            <label htmlFor="patient-name">
                Patient Name:
            </label>
            <input id="patient-name"
            value = {title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    {
                        setTitle(e.target.value)
                    }
                }
            />
            <button>Submit</button>
        </form>
        <button class="button h-button is-primary">Primary Button</button>
        <button class="button h-button is-success">Success Button</button>
        <button class="button h-button is-info">Info Button</button>
        <button class="button h-button is-warning">Warning Button</button>
        <button class="button h-button is-danger">Danger Button</button>
    </div>
}


export default PatientDetails;