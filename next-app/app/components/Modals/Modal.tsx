'use client';
import { useGlobalState } from '@/app/hooks/useGlobalState';
import React from 'react';

interface Props {
    content: React.ReactNode;
}

const Modal: React.FC<Props> = ({ content }) => {
    const { closeModal } = useGlobalState();
    return (
        <div className="modal modal-open">
            <div className='absolute top-0 left-0 w-full h-screen blur' onClick={closeModal}></div>
            <div className="modal-box max-w-5xl">
                {content}
            </div>
        </div>
    )
}

export default Modal