import type IUser from '../resources/user';

export default interface ILoginResponse {
    user: IUser;
    access_token: string;
}
