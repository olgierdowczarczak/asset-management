import { useEffect, useState } from 'react';
import type Resource from '../../types/resource';
import style from './ResourceMainPage.module.css';

interface ResourceMainPageProps<T> {
    resourceName: string;
    resourceUse: Resource<T>;
}

export default function ResourceMainPage<T>(props: ResourceMainPageProps<T>) {
    const [resources, setResources] = useState<Array<T> | null>(null);
    const [headers, setHeaders] = useState<Array<String> | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await props.resourceUse.get();
            setResources(fetchedData!.data);
            setHeaders(fetchedData!.headers);
        };
        fetchData();
    }, []);

    if (!headers || !headers.length) {
        return null;
    }

    return (
        <div className={style.container}>
            <div className={style.wrapper}>
                <>
                    <input placeholder="search" />
                    <button>Add</button>
                </>
                <table>
                    <thead>
                        <tr>
                            {headers.map((head) => (
                                <th key={String(head)}>{String(head)}</th>
                            ))}
                        </tr>
                    </thead>
                    {resources && (
                        <tbody>
                            {resources.map((resource, idx) => (
                                <tr key={idx}>
                                    {headers.map((key) => (
                                        <td key={String(key)}>
                                            {String(resource[key as keyof T])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}
