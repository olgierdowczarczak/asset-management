import { useLocation } from 'react-router-dom';
import type { PageController } from '@/core';
import * as React from 'react';

interface RouteWrapperProps {
    Component: React.ComponentType<{ controller: PageController<any> }>;
    controller: PageController<any>;
}

const RouteWrapper = ({ Component, controller }: RouteWrapperProps) => {
    const location = useLocation();

    return <Component key={location.pathname} controller={controller} />;
};

export default RouteWrapper;
