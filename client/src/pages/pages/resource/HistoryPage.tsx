import PageController from '@/core/PageController';

function HistoryPage<T>({ controller }: { controller: PageController<T> }) {
    return <>create page for {controller.resourceName}</>;
}

export default HistoryPage;
