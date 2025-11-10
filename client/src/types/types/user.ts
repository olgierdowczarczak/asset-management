export default interface User {
    id: number;
    username: string;
    role: 'admin' | 'user';
}
