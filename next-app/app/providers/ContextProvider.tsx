'use client';

import React from 'react';
import { GlobalProvider } from '../context/globalProvider'
import { Toaster } from 'react-hot-toast';

interface Props {
    children: React.ReactNode;
}

function ContextProvider({ children }: Props) {
    const [isReady, setIsReady] = React.useState(false);

    React.useEffect(() => {
        setTimeout(() => {
            setIsReady(true);
        }, 250);
    }, []);

    if (!isReady) {
        return <div className='w-full h-screen flex items-center justify-center'>
            <span className="loading loading-spinner loading-lg"></span>
        </div>;
    }


    return <GlobalProvider>
        <Toaster
            position="bottom-center"
        />
        {children}
    </GlobalProvider>;
}

export default ContextProvider;