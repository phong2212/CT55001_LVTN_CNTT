import React from 'react';

interface Props {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SearchForm: React.FC<Props> = ({ searchTerm, onSearchChange, onSearchSubmit }) => (
    <form onSubmit={onSearchSubmit}>
        <div className='form-control flex flex-row'>
            <input
                type="text"
                value={searchTerm}
                className='input input-bordered w-24 md:w-auto'
                onChange={onSearchChange}
                placeholder="Tìm kiếm..."
            />
            <button type='submit' className="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </div>
    </form>
);

export default SearchForm;
