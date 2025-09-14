import { Request, Response } from 'express';
export declare const getAllLoans: (req: Request, res: Response) => Promise<void>;
export declare const createLoan: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateLoan: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteLoan: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
