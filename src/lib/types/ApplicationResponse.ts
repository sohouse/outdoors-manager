
export class ApplicationResponse {
    public readonly code: number;
    public readonly message: string;
    public readonly success: boolean;
    public readonly content?: string;
    constructor(code: number, message: string, success: boolean, content?: string) {
        this.code = code;
        this.message = message;
        this.success = success;
        this.content = content;
    }
}