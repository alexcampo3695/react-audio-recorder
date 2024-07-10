import React, { useEffect, useState } from "react";

import NoData from "./NoData";
import { API_BASE_URL } from "../config";
import formatDate from "../helpers/DataManipulation";
import Modal from "./Modal";
import feather from "feather-icons";

interface TaskRowData {
  id: string;
  task: string;
  reasoning: string;
  severity: string;
  status: boolean;
  dueDate: string;
  onStatusChange: (id: string, newStatus: boolean) => void;
}

const TaskRow: React.FC<TaskRowData> = ({ id, task, reasoning, status, severity, dueDate, onStatusChange }) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleCPTStatusChange = () => {
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
              onChange = {handleCPTStatusChange}
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
              href="#"
            >
              {task}
            </a>
            <span>{"Due Date: "}{formatDate(dueDate)}</span>
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
  fileId: string;
}

interface TaskResponse {
  _id: string;
  fileId: string;
  task: string;
  reasoning: string;
  severity: string;
  dueDate: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const TaskComponent: React.FC<TaskComponentProps> = ({ fileId }) => {
  const [tasks, setTasks] = useState<TaskResponse[] | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/tasks/file/${fileId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch cpt codes: ${response.status}`);
        }
        const data: TaskResponse[] = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      }
    };
    console.log('tasks:', tasks)

    fetchTasks();
  }, [fileId]);

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
          <h3 className="dark-inverted">Recommended Tasks</h3>
          <div className="tabbed-controls">
              <a className="tabbed-control is-active">
                  <span>All</span>
              </a>
              <a className="tabbed-control">
                  <span>Mine</span>
              </a>
              <div className="tabbed-naver"></div>
          </div>
      </div>

      <div className="inner-list-wrapper is-active">
          <div className="inner-list">
              {tasks?.length === 0 ? (
                <NoData 
                  Title='No CPT Codes Found'
                  Subtitle= 'There have been no CPT Codes found in this transcription file.'
                />
              ) : (
                tasks?.map(tasks => (
                  <TaskRow
                    key={tasks._id}
                    id={tasks._id}
                    task={tasks.task}
                    severity={tasks.severity}
                    reasoning={tasks.reasoning}
                    dueDate={tasks.dueDate}
                    status={tasks.status}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
          </div>
      </div>
  </div>
  );
};

export default TaskComponent;
