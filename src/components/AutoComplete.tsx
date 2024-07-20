import React, { useState, useEffect } from "react";
import "../styles/AutoComplete.scss";
import { API_BASE_URL } from "../config";

export interface AutoCompleteData {
  id: string;
  primaryText: string;
  secondaryText: string;
}

const TileGridItem: React.FC<AutoCompleteData & {onRemove: () => void}> = ({primaryText, secondaryText, onRemove}) => {
  return (
    <div className="tile-grid-item">
      <div className="tile-grid-item-inner">
          <div className="h-avatar is-medium">
              <img className="avatar" src="assets/img/avatars/photos/29.jpg" data-demo-src="assets/img/avatars/photos/29.jpg" alt="" data-user-popover="25"></img>
              <img className="badge" src="assets/img/icons/stacks/python.svg" data-demo-src="assets/img/icons/stacks/python.svg" alt=""></img>
          </div>
          <div className="meta">
              <span className="dark-inverted">{primaryText}</span>
              <span>{secondaryText}</span>
          </div>
          <div className="dropdown is-spaced is-dots is-right dropdown-trigger">
            <div className="is-trigger" aria-haspopup="true" onClick={onRemove}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </div>
          </div>
      </div>
  </div>
  )
}

const TileGrid: React.FC<{data: AutoCompleteData[], onRemoveItem: (id: string) => void}> = ({data, onRemoveItem}) => {
  return (
    <div 
      className="tile-grid tile-grid-v1"
      style={{marginTop: '1rem'}}
    >
      {data.length === 0 ? (
        <div className="page-placeholder custom-text-filter-placeholder">
          <div className="placeholder-content">
            <img className="light-image" src="assets/img/illustrations/placeholders/search-6.svg" alt="" />
            <img className="dark-image" src="assets/img/illustrations/placeholders/search-6-dark.svg" alt="" />
            <h3>We couldn't find any matching results.</h3>
            <p className="is-larger">
              Too bad. Looks like we couldn't find any matching results for
              the search terms you've entered. Please try different search
              terms or criteria.
            </p>
          </div>
        </div>
      ) : (
        <div className="columns is-multiline">
          {data.map((item, index) => (
            <div key={index} className="column is-4">
              <TileGridItem {...item} onRemove={() => onRemoveItem(item.id)}/>
            </div>
          ))}
        </div>
      )}
    </div>
  )
  
};



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
    case 'cpts':
      url = `${API_BASE_URL}/api/cpt/getAllExistingCPTs`;
      break;
    default:
      break; 
  }

  if (search) {
    url += `?search=${encodeURIComponent(search)}`;
  }


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
  const [selectedItem, setSelectedItem] = useState<AutoCompleteData[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleSelectedItem = (item: AutoCompleteData) => {
    setSelectedItem(prevItems => [...prevItems, item]);
    setInputValue('');
    setIsDropdownOpen(false);
  }

  const handleRemoveItem = (id: string) => {
    setSelectedItem(prevItems => prevItems.filter(item => item.id !== id))
  }

  console.log('selectedItem:',selectedItem);

  const inputHasText = inputValue.length > 0;

  const changeDropDown = () => {
    if (!isDropdownOpen) {
      return 'none';
    } else {
      return 'block'
    }
  }

  return (
    <div className="control has-icon">
      <div className="easy-autocomplete" style={{ width: '45%' }}>
        <input
          id="autocomplete-demo-subtext"
          type="text"
          className="input"
          placeholder={getPlaceholderText(type)}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setIsDropdownOpen(true);
          }}
        />
        {inputHasText && (
          <div className="easy-autocomplete-container-alex" id="eac-container-autocomplete-demo-subtext">
            <ul 
              style={{ display: changeDropDown() }}
            >
              {autoCompleteData.map((item, index) => (
                <li key={index} onClick={() => handleSelectedItem(item)}>
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
      <TileGrid data={selectedItem} onRemoveItem={handleRemoveItem}/>
    </div>
  );
};

export default AutoComplete;
