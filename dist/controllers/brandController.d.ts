import { Request, Response } from 'express';
export declare const getAllBrands: (req: Request, res: Response) => Promise<void>;
export declare const createBrand: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateBrand: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteBrand: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleBrandActive: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
