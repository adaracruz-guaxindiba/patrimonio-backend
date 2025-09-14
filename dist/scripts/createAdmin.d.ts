#!/usr/bin/env node
declare class AdminCLI {
    private parseArguments;
    private showHelp;
    private validateEmail;
    private validatePassword;
    run(): Promise<void>;
}
export default AdminCLI;
