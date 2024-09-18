'use client';
import { useGlobalState } from '@/app/context/globalProvider';
import React from 'react';

interface Props {
    content: React.ReactNode;
}

function Modal({ content }: Props) {
    const { closeModal } = useGlobalState();
    return (
        <>
            <div className="modal modal-open">
            <div className='absolute top-0 left-0 w-full h-screen blur' onClick={closeModal}></div>
                <div className="modal-box">
                    {content}
                </div>
            </div>
        </>
    )
}

export default Modal