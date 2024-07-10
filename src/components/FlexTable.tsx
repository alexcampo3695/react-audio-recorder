import React, { useState, useEffect, ReactElement, Suspense } from "react";
import { useUser } from "../context/UserContext";
import InfiniteScroll from "react-infinite-scroll-component";


interface FlexTableProps {
    children: ReactElement | ReactElement[];
    titles: string[];
    searchPlaceholder?: string;
    hasMore: boolean;
    hasSearch?: boolean;
    hasButton?: boolean;
    buttonLabel?: string;
    buttonIcon?:ReactElement;
    buttonOnclick?: () => void;
    loadMore: () => void;
    onSearchChange: (searchTerm: string) => void;
}

const FlexTable: React.FC<FlexTableProps> = ({ 
    children,
    titles,
    searchPlaceholder,
    hasMore,
    hasSearch,
    hasButton,
    buttonLabel,
    buttonIcon,
    buttonOnclick,
    loadMore,
    onSearchChange

}) => {
    const [patients, setPatients] = useState([]);
    const{ user } = useUser();
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term)
        onSearchChange(term)
    }

    return (
        <div>
            <div className="list-flex-toolbar">
                {hasSearch && (
                    <div className="control has-icon">
                        <input 
                            className="input custom-text-filter" 
                            placeholder="Search..." 
                            data-filter-target=".flex-table-item"
                            onChange={handleSearchTermChange}
                            value={searchTerm}
                        >
                        </input>
                        <div className="form-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                    </div>
                )}
                
                {hasButton && (
                    <div className="buttons">
                        <button className="button h-button is-primary is-elevated" onClick={buttonOnclick}>
                            <span className="icon">
                                {buttonIcon || <i aria-hidden="true" className="fas fa-check"></i>}
                            </span>
                            <span>{buttonLabel}</span>
                        </button>
                    </div>
                )}
            </div>
            <div className="page-content-inner">
                <div className="flex-list-wrapper flex-list-v1">
                    <div className="page-placeholder custom-text-filter-placeholder is-hidden">
                        <div className="placeholder-content">
                            <img className="light-image" src="assets/img/illustrations/placeholders/search-4.svg" alt=""></img>
                            <img className="strokeWidth-image" src="assets/img/illustrations/placeholders/search-4-strokeWidth.svg" alt=""></img>
                            <h3>We couldn't find any matching results.</h3>
                            <p className="is-larger">
                                Too bad. Looks like we couldn't find any matching results for
                                the search terms you've entered. Please try different search
                                terms or criteria.
                            </p>
                        </div>
                    </div>
                    <div className="flex-table">
                        <div className="flex-table-header" data-filter-hide="">
                            {titles.map((header, index) => (
                                <span 
                                    key={index} 
                                    className={`${index === 0 ? "flex-grow" : ""} ${index === titles.length - 1 ? "cell-end" : ""}`}
                                        
                                >
                                    {header}
                                </span>
                            ))}
                        </div>

                        <div className="flex-list-inner">
                            <InfiniteScroll
                                dataLength= {React.Children.count(children)}
                                next={loadMore}
                                hasMore={hasMore}
                                loader={<h4>Loading...</h4>}
                                endMessage={''}
                            >
                                {children}
                            </InfiniteScroll>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlexTable;