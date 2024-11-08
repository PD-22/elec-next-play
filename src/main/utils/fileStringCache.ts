// TODO: add fileStringCache

// import * as fs from 'fs';
// import * as path from 'path';
// import * as crypto from 'crypto';

// export class FileStringCache {
//     private cacheDirectory: string;
//     private hash: boolean;

//     constructor(cacheInstanceName = '', rootDirectory = '', cacheDirName = '', hash = false) {
//         this.hash = hash;
//         this.cacheDirectory = this.buildCacheDirectoryPath(cacheInstanceName, rootDirectory, cacheDirName);

//         // Ensure cache directory exists
//         if (!fs.existsSync(this.cacheDirectory)) {
//             fs.mkdirSync(this.cacheDirectory, { recursive: true });
//         }
//     }

//     private buildCacheDirectoryPath(cacheInstanceName: string, rootDirectory: string, cacheDirName: string): string {
//         const baseDir = rootDirectory || path.join(process.env.HOME || '', 'Documents');
//         const finalDir = path.join(baseDir, cacheDirName || 'DefaultCache');

//         if (cacheInstanceName) {
//             return path.join(finalDir, cacheInstanceName);
//         }
//         return finalDir;
//     }

//     private generateSafeFilenameHash(input: string): string {
//         if (this.hash) {
//             const hash = crypto.createHash('sha256').update(input).digest('base64');
//             return this.makeFilenameSafe(hash) + '.dat';
//         }
//         return this.makeFilenameSafe(input) + '.dat';
//     }

//     private makeFilenameSafe(input: string): string {
//         return input.replace(/[\/:*?"<>|]/g, '_').slice(0, 255);  // Limits filename to 255 characters and replaces invalid characters
//     }

//     public async saveCache(keyBase: string, item: string): Promise<void> {
//         const filePath = path.join(this.cacheDirectory, this.generateSafeFilenameHash(keyBase));

//         // Check file path length
//         if (filePath.length >= 260) {
//             throw new Error('File path is too long.');
//         }

//         // Delete existing file if it exists
//         if (fs.existsSync(filePath)) {
//             fs.unlinkSync(filePath);
//         }

//         // Write the new cache file
//         await fs.promises.writeFile(filePath, item, 'utf-8');
//     }

//     public async getCache(keyBase: string): Promise<string | null> {
//         const filePath = path.join(this.cacheDirectory, this.generateSafeFilenameHash(keyBase));

//         if (fs.existsSync(filePath)) {
//             return await fs.promises.readFile(filePath, 'utf-8');
//         }
//         return null;
//     }

//     public async removeCache(keyBase: string): Promise<boolean> {
//         const filePath = path.join(this.cacheDirectory, this.generateSafeFilenameHash(keyBase));

//         if (fs.existsSync(filePath)) {
//             try {
//                 fs.unlinkSync(filePath);
//                 return true;
//             } catch (error) {
//                 throw new Error(`Error removing cache file ${filePath}: ${error.message}`);
//             }
//         }
//         return false;
//     }

//     public resetCache(): void {
//         if (fs.existsSync(this.cacheDirectory)) {
//             fs.rmdirSync(this.cacheDirectory, { recursive: true });
//             fs.mkdirSync(this.cacheDirectory, { recursive: true });
//         }
//     }

//     public initCache(): void {
//         if (!fs.existsSync(this.cacheDirectory)) {
//             fs.mkdirSync(this.cacheDirectory, { recursive: true });
//         }
//     }
// }
