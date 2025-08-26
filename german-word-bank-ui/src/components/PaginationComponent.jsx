import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ pageNumber, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item 
        key={number} 
        active={number === pageNumber} 
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
          onClick={() => onPageChange(pageNumber - 1)} 
          disabled={pageNumber === 1} 
        />
        {items}
        <Pagination.Next 
          onClick={() => onPageChange(pageNumber + 1)} 
          disabled={pageNumber === totalPages} 
        />
      </Pagination>
    </div>
  );
};

export default PaginationComponent;