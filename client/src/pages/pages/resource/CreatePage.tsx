import PageController from '@/core/PageController';

function CreatePage<T>({ controller }: { controller: PageController<T> }) {
    return <>create page for {controller.resourceName}</>;
}

export default CreatePage;
