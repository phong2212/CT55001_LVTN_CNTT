import { useContext } from 'react';
import { GlobalUpdateContext } from '../context/GlobalContext';

export const useGlobalUpdate = () => useContext(GlobalUpdateContext)