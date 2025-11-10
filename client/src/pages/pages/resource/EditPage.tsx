import PageController from '@/core/PageController';

function EditPage<T>({ controller }: { controller: PageController<T> }) {
    return <>create page for {controller.resourceName}</>;
}

export default EditPage;
