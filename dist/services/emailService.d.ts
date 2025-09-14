declare class EmailService {
    private transporter;
    constructor();
    sendPasswordResetEmail(to: string, resetToken: string, userName: string): Promise<boolean>;
    sendWelcomeEmail(to: string, userName: string, tempPassword: string): Promise<boolean>;
    private getPasswordResetTemplate;
    private getWelcomeTemplate;
    testConnection(): Promise<boolean>;
}
export declare const emailService: EmailService;
export {};
