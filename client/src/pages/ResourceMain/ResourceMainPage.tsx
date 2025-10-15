import { useQuery } from "@tanstack/react-query";
import type Resource from '../../types/resource';
import type GetResources from '../../types/responses/getResources';

interface ResourceMainPageProps<T> {
    resourceName: string;
    resourceUse: Resource<T>;
}

export default function ResourceMainPage<T>(props: ResourceMainPageProps<T>) {
    const { data, isLoading, error } = useQuery<GetResources<T> | null>({
        queryKey: [props.resourceName.toLowerCase()],
        queryFn: () => props.resourceUse.get()
    });

    if (isLoading || error || !data || !data.total) {
        return null;
    }

    return (
        <table>
            <thead>
                <tr>
                    {data.meta.columns.map((col) => (
                        <th key={col.key}>
                            {col.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.data.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                        {data.meta.columns.map((col) => (
                            <td key={col.key}>
                                {/* @ts-ignore */}
                                {item[col.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}