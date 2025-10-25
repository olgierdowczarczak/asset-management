import { Router } from 'express';

class Endpoint {
    constructor() {
        this._router = Router();
    }

    get router() {
        return this._router;
    }
}

export default Endpoint;
