import React from 'react';
import { Pagination } from 'react-bootstrap';

// Note: This component receives a prop named 'currentPage'.
// In App.jsx, you pass your 'pageNumber' state to it like: <PaginationComponent currentPage={pageNumber} ... />
const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item 
        key={number} 
        active={number === currentPage} 
        onClick={() => onPageChange(number)}
      >
        {number}
      </Pagination.Item>,
    );
  }

  return (
    <div className="d-flex justify-content-center mt-4">
      <Pagination>
        <Pagination.Prev 
          onClick={() => onPageChange(currentPage - 1)} 
          // THIS IS THE FIX: Disables the button on the first page
          disabled={currentPage === 1} 
        />
        {items}
        <Pagination.Next 
          onClick={() => onPageChange(currentPage + 1)} 
          // THIS IS THE FIX: Disables the button on the last page
          disabled={currentPage === totalPages} 
        />
      </Pagination>
    </div>
  );
};

export default PaginationComponent;