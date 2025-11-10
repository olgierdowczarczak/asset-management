import PageController from '@/core/PageController';

function ResourcePage<T>({ controller }: { controller: PageController<T> }) {
    return <>create page for {controller.resourceName}</>;
}

export default ResourcePage;
