import { Navigate } from 'react-router-dom';
import type { JSX } from 'react';
import isLogged from '../helpers/isLogged.ts';

type Props = {
    children: JSX.Element;
};

export default ({ children }: Props) => isLogged() ? <Navigate to="/" replace /> : children;