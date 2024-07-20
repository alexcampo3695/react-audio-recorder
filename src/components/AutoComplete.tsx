import React, { useState, useEffect } from "react";
import "../styles/AutoComplete.scss";
import { API_BASE_URL } from "../config";

export interface AutoCompleteData {
  id: string;
  primaryText: string;
  secondaryText: string;
}

export const fetchAutoCompleteData = async (
  type: 'icd10s' | 'medications' | 'cpts',
  search: string
): Promise<AutoCompleteData[]> => {
  let url = '';
  switch (type) {
    case 'icd10s':
      url = `${API_BASE_URL}/api/icd10/getAllExistingIcd10s`;
      break;
    // case 'medications':
    //   url = ''
    //   break;
    // case 'cpts':
    //   url = ''
    //   break;
    default:
      break; 
  }

  if (search) {
    url += `?search=${encodeURIComponent(search)}`;
  }

  console.log('url', url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data: AutoCompleteData[] = await response.json();
    const mappedData = data.map((item: any) => {
      return {
        id: item._id,
        primaryText: item.Code,
        secondaryText: item.Description
      }
    });
    return mappedData;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return [];
  }
};

interface AutoCompleteProps {
  input: string;
  type: 'icd10s' | 'medications' | 'cpts';
}

const AutoComplete: React.FC<AutoCompleteProps> = ({ input = "", type }) => {
  const [inputValue, setInputValue] = useState(input);
  const [autoCompleteData, setAutoCompleteData] = useState<AutoCompleteData[]>([]);

  useEffect(() => {
    setInputValue(input);
  }, [input]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAutoCompleteData(type, inputValue);
      setAutoCompleteData(data);
    };

    if (inputValue) {
      fetchData();
    }
  }, [inputValue, type]);

  const getPlaceholderText = (type: string) => {
    switch (type) {
      case 'icd10s':
        return 'Search for ICD10s...';
      case 'medications':
        return 'Search for medications...';
      case 'cpts':
        return 'Search for CPTs...';
      default:
        return 'Search...';
    }
  };

  const inputHasText = inputValue.length > 0;

  return (
    <div className="control has-icon">
      <div className="easy-autocomplete" style={{ width: '45%' }}>
        <input
          id="autocomplete-demo-subtext"
          type="text"
          className="input"
          placeholder={getPlaceholderText(type)}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {inputHasText && (
          <div className="easy-autocomplete-container-alex" id="eac-container-autocomplete-demo-subtext">
            <ul style={{ display: "block" }}>
              {autoCompleteData.map((item, index) => (
                <li key={index}>
                  <div className="template-wrapper">
                    <div className="entry-text">
                      <span>{item.primaryText}</span>
                      <span>{item.secondaryText}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="form-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-search"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </div>
  );
};

export default AutoComplete;
