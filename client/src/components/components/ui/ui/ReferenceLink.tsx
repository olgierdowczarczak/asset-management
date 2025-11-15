import { Link } from 'react-router-dom';
import { extractId, getDisplayValue } from '@/lib/schemaHelpers';
import type { IPopulatedReference } from '@/types';

interface ReferenceLinkProps {
    value: number | IPopulatedReference | undefined;
    collection: string;
    displayField?: string;
    className?: string;
}

const ReferenceLink: React.FC<ReferenceLinkProps> = ({
    value,
    collection,
    displayField = 'name',
    className = '',
}) => {
    const id = extractId(value);
    const displayText = getDisplayValue(value, displayField);

    if (!id) {
        return <span className="text-gray-500">-</span>;
    }

    return (
        <Link
            to={`/${collection}/${id}`}
            className={`text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1 transition-colors ${className}`}
            onClick={(e) => e.stopPropagation()}
        >
            {displayText}
        </Link>
    );
};

export default ReferenceLink;
