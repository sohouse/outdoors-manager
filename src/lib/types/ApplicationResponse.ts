
export class ApplicationResponse<T> {
    public readonly code: number;
    public readonly message: string;
    public readonly success: boolean;
    public readonly content?: T;
    constructor(code: number, message: string, success: boolean, content?: T) {
        this.code = code;
        this.message = message;
        this.success = success;
        this.content = content;
    }
}