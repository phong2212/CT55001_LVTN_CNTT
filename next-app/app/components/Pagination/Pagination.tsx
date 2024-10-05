import React from 'react';

interface Props {
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPreviousPage: () => void;
}

const Pagination: React.FC<Props> = ({ currentPage, totalPages, onNextPage, onPreviousPage }) => (
    <div className='flex justify-center mt-4 space-x-2'>
        <button className='btn btn-primary' onClick={onPreviousPage} disabled={currentPage <= 1}>Trước</button>
        <span className='btn'>{currentPage} / {totalPages}</span>
        <button className='btn btn-primary' onClick={onNextPage} disabled={currentPage >= totalPages}>Sau</button>
    </div>
);

export default Pagination;
