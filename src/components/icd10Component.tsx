import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';


interface Icd10RowData {
  code: string;
  description: string;
  status: string;
}

const Icd10Row: React.FC<Icd10RowData> = ({ code, description, status }) => {
  return (
    <div className="inner-list-item media-flex-center">
        <div className="animated-checkbox is-unchecked">
            <input type="checkbox"></input>
            <div className="checkmark-wrap">
                <div className="shadow-circle"></div>
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"></circle>
                    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>
                </svg>
            </div>
        </div>
        <div className="flex-meta is-light">
            <a href="#">{description}</a>
            <span>{code}</span>
        </div>
        <div className="flex-end">
            {/* hardcoded need to take care of! */}
            <span className="tag is-rounded">Saved</span> 
        </div>
    </div>
  );
};
interface Icd10ComponentProps {
  fileId: string;
}

interface Icd10Response {
  _id: string;
  fileId: string;
  code: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Icd10Component: React.FC<Icd10ComponentProps> = ({ fileId }) => {
  const [icd10s, setIcd10s] = useState<Icd10Response[] | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const fetchIcd10Codes = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/icd10/file/${fileId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch icd10 codes: ${response.status}`);
        }
        const data: Icd10Response[] = await response.json();
        setIcd10s(data);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      }
    };

    fetchIcd10Codes();
  }, [fileId]);

  return (
    <div className="list-widget list-widget-v2 tabbed-widget">
      <div className="widget-head">
          <h3 className="dark-inverted">ICD10 Codes</h3>
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
              {icd10s ? (
                icd10s.map(icd10 => (
                  <Icd10Row
                    key={icd10._id}
                    code={icd10.code}
                    description={icd10.description}
                    status="Saved"
                  />
                ))
              ) : (
                <div>No ICD 10 Codes</div>
              )}

          </div>
      </div>
  </div>
  );
};

export default Icd10Component;
