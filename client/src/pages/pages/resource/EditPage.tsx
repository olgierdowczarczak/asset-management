import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageController from '@/core/PageController';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';

function EditPage<T extends { id: number }>({ controller }: { controller: PageController<T> }) {
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const result = await controller.service.get(Number(id));
                setFormData(result);
            } catch (err: any) {
                setError(err.message || 'Failed to load resource');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, controller]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            await controller.service.edit(Number(id), formData);
            navigate(`/${controller.path}`);
        } catch (err: any) {
            setError(err.message || 'Failed to update resource');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev: any) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="p-8">
                    <div className="text-center text-gray-400">Loading...</div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-100">
                    Edit {controller.resourceName}
                </h1>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-sm text-red-400">
                    {error}
                </div>
            )}

            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="name" required>Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name || ''}
                            onChange={handleChange}
                            placeholder="Enter name"
                            required
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" variant="primary" disabled={saving}>
                            {saving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate(`/${controller.path}`)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default EditPage;
