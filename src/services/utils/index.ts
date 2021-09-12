export class ResponseError extends Error {
    public readonly type = 'ResponseError';
    public response: Response;

    constructor (response: Response) {
        super(response.statusText);

        this.response = response;

        Object.setPrototypeOf(this, ResponseError.prototype);
    }
}

export const fetchJSON = async <T>(input: RequestInfo, init: RequestInit = {}): Promise<T> => {
    const response = await fetch(input, { credentials: 'include', ...init });

    if (!response.ok) throw new ResponseError(response);

    return await response.json();
};
