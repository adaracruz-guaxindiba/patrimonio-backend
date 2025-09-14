import { Request, Response } from 'express';
export declare const getAllStatuses: (req: Request, res: Response) => Promise<void>;
export declare const createStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleStatusActive: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
