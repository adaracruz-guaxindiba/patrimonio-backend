import { Request, Response } from 'express';
export declare const getAllSectors: (req: Request, res: Response) => Promise<void>;
export declare const createSector: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSector: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteSector: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleSectorActive: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
