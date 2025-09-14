import { Request, Response } from 'express';
export declare const getAllPurchaseItems: (req: Request, res: Response) => Promise<void>;
export declare const createPurchaseItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updatePurchaseItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPurchaseItemById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deletePurchaseItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
