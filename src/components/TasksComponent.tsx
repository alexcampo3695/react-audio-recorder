import React, { useEffect, useState } from "react";

import NoData from "./NoData";
import { API_BASE_URL } from "../config";
import formatDate from "../helpers/DataManipulation";
import Modal from "./Modal";
import feather from "feather-icons";
import { Link } from "react-router-dom";


interface PatientData {
  PatientId: string
  FirstName: string
  LastName: string
  DateOfBirth: string
  CreatedBy: string
}

interface TaskRowData {
  patientId?: string;
  id: string;
  task: string;
  reasoning: string;
  severity: string;
  status: boolean;
  dueDate: string;
  hasPatient?: boolean;
  patientData?:string;
  onStatusChange: (id: string, newStatus: boolean) => void;
}


const TaskRow: React.FC<TaskRowData> = ({ patientId , id, task, reasoning, status, severity, dueDate, onStatusChange, hasPatient, patientData }) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleTaskStatusChange = () => {
    const newStatus = !isChecked;
    setIsChecked(newStatus);
    onStatusChange(id, newStatus);
  }

  useEffect(() => {
      feather.replace();
  }, []);

  return (
    <div className="inner-list-item media-flex-center">
        <div 
          className={`animated-checkbox ${status === true ? 'is-checked' : 'is-unchecked'}`}
        >
            <input 
              type="checkbox"
              onClick = {() => setIsChecked(!isChecked)}
              onChange = {handleTaskStatusChange}
            >
            </input>
            <div className="checkmark-wrap">
                <div className="shadow-circle"></div>
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"></circle>
                    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>
                </svg>
            </div>
        </div>
        <div className="flex-meta is-light">
            <a 
              onClick={() => setIsModalOpen(true)}
            >
              {task}
            </a>
            <span>{"Due Date: "}{formatDate(dueDate)}</span>
            {hasPatient && (
              <Link to={`/patient_profile/${patientId}`} className="patient-data">
                {patientData}
              </Link>
            )}
        </div>
        <div className="flex-end">
            <span 
              style = {{width: '65px', textAlign: 'center'}}
              className={`tag is-rounded ${(() => {
                switch (severity) {
                  case 'High': return 'is-danger';
                  case 'Moderate': return 'is-orange';
                  case 'Mild': return 'is-primary';
                  case 'Low': return 'is-success';
                  default: return 'is-light';
                }
              })()}`}
            >
                {(() => {
                  switch (severity) {
                    case 'High': return 'High';
                    case 'Moderate': return 'Moderate';
                    case 'Mild': return 'Mild';
                    case 'Low': return 'Low';
                    default: return 'Unknown';
                  }
                
                })()}
            </span> 
        </div>
        { isModalOpen && (
            <Modal
                ModalTitle="Task Recommendation"
                Type= 'image'
                Header="Reasoning:"
                Subtext={reasoning}
                hasButtons={false}
                PrimaryButtonText=""
                SecondaryButtonText=""
                IsLarge={false}
                onSubmit={() => {}}
                onClose={() => setIsModalOpen(false)}
            />
        )}
    </div>
  );
};



interface TaskComponentProps {
  fileId?: string;
  createdById?: string;
  title?: string;
  tab1?: string;
  tab2?: string;
  hasPatient?: boolean;
  patientData?: PatientData;
}

interface TaskResponse {
  _id: string;
  fileId: string;
  task: string;
  reasoning: string;
  severity: string;
  dueDate: string;
  patientId: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type PatientDataMap = {
  [key: string]: PatientData[];
};

const TaskComponent: React.FC<TaskComponentProps> = ({ fileId, createdById, title, tab1, tab2, hasPatient }) => {
  const [tasks, setTasks] = useState<TaskResponse[] | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [patientData, setPatientData] = useState<PatientDataMap>({});

  const fetchPatientData =async (patientId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/patients/${patientId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch patient data: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch patient data:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const url = createdById ? `${API_BASE_URL}/api/tasks/created_by/${createdById}` : `${API_BASE_URL}/api/tasks/file/${fileId}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch cpt codes: ${response.status}`);
        }
        const data: TaskResponse[] = await response.json();


        if (hasPatient) {
          const patientDataPromises = data.map(task => fetchPatientData(task.patientId));
          const patientDataArray = await Promise.all(patientDataPromises);
          const patientDataMap = data.reduce((acc: PatientDataMap, task, index) => {
            if (patientDataArray[index]) {
              acc[task.patientId] = patientDataArray[index];
            }
            return acc;
          }, {} as PatientDataMap);
          setPatientData(patientDataMap);
        }

        setTasks(data);

        console.log('tasks:', tasks)
        console.log('patientData:', patientData)
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      }
    };
    console.log('tasks:', tasks)

    fetchTasks();
  }, [fileId, createdById, hasPatient]);

  useEffect(() => {
    console.log('tasks:', tasks);
    console.log('patientData:', patientData);
  }, [tasks, patientData])

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    try {
      await fetch(`${API_BASE_URL}/api/tasks/update/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTasks(prevTasks => 
        prevTasks?.map(task =>
          task._id === id ? {...task, status: newStatus} : task
        ) || null
      );
    } catch (error) {
      console.error('Failed to update cpt status:', error);
    }
  }

  return (
    <div className="list-widget list-widget-v2 tabbed-widget">
      <div className="widget-head">
          <h3 className="dark-inverted">{title ||'Recommended Tasks'}</h3>
          <div className="tabbed-controls">
              <a className="tabbed-control is-active">
                  <span>{tab1 || 'All'}</span>
              </a>
              <a className="tabbed-control">
                  <span>{tab2 || 'Mine'}</span>
              </a>
              <div className="tabbed-naver"></div>
          </div>
      </div>

      <div className="inner-list-wrapper is-active">
          <div className="inner-list">
              {tasks?.length === 0 ? (
                <NoData 
                  Title='No Tasks Found'
                  Subtitle= 'There have been no CPT Codes found in this transcription file.'
                />
              ) : (
                tasks?.map(tasks => (
                  <TaskRow
                    patientId= {tasks.patientId}
                    key={tasks._id}
                    id={tasks._id}
                    task={tasks.task}
                    severity={tasks.severity}
                    reasoning={tasks.reasoning}
                    dueDate={tasks.dueDate}
                    status={tasks.status}
                    onStatusChange={handleStatusChange}
                    hasPatient={hasPatient}
                    patientData={patientData[tasks.patientId] && patientData[tasks.patientId][0] ? `${patientData[tasks.patientId][0].FirstName} ${patientData[tasks.patientId][0].LastName}` : ''}
                  />
                ))
              )}
          </div>
      </div>
  </div>
  );
};

export default TaskComponent;
