import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';

export const useGlobalState = () => useContext(GlobalContext);