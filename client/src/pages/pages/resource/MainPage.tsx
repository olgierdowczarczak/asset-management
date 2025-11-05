import PageController from '@/core/PageController';

function MainPage<T>({ controller }: { controller: PageController<T> }) {
    return <>resource page for {controller.resourceName}</>;
}

export default MainPage;
