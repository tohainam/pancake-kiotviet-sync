import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

interface StorageData {
  value: string;
  expiry: number | null;
  createdAt: number;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly storagePath: string;

  constructor() {
    this.storagePath = join(process.cwd(), 'storage');
    void this.ensureStorageDirectory();
  }

  private async ensureStorageDirectory(): Promise<void> {
    try {
      await fs.access(this.storagePath);
    } catch {
      await fs.mkdir(this.storagePath, { recursive: true });
      this.logger.log(`Created storage directory: ${this.storagePath}`);
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      const filePath = join(this.storagePath, `${key}.json`);
      const data = {
        value,
        expiry: ttl ? Date.now() + ttl : null,
        createdAt: Date.now(),
      };

      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      this.logger.debug(`Stored data for key: ${key}`);
    } catch (error) {
      this.logger.error(`Error storing data for key ${key}:`, error);
      throw error;
    }
  }

  async get<T = string>(key: string): Promise<T | null> {
    try {
      const filePath = join(this.storagePath, `${key}.json`);

      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data: StorageData = JSON.parse(fileContent) as StorageData;

        // Check if data has expired
        if (data.expiry && Date.now() > data.expiry) {
          await this.del(key);
          return null;
        }

        return data.value as T;
      } catch (error: any) {
        if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') {
          return null; // File doesn't exist
        }
        throw error;
      }
    } catch (error) {
      this.logger.error(`Error getting data for key ${key}:`, error);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      const filePath = join(this.storagePath, `${key}.json`);
      await fs.unlink(filePath);
      this.logger.debug(`Deleted data for key: ${key}`);
    } catch (error: any) {
      if ((error as NodeJS.ErrnoException)?.code !== 'ENOENT') {
        this.logger.error(`Error deleting data for key ${key}:`, error);
        throw error;
      }
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const filePath = join(this.storagePath, `${key}.json`);
      await fs.access(filePath);

      // Check if file exists and is not expired
      const value = await this.get(key);
      return value !== null;
    } catch {
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      const files = await fs.readdir(this.storagePath);
      const deletePromises = files
        .filter((file) => file.endsWith('.json'))
        .map((file) => fs.unlink(join(this.storagePath, file)));

      await Promise.all(deletePromises);
      this.logger.log('Cleared all storage files');
    } catch (error) {
      this.logger.error('Error clearing storage:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.storagePath);
      return files
        .filter((file) => file.endsWith('.json'))
        .map((file) => file.replace('.json', ''));
    } catch (error) {
      this.logger.error('Error getting all keys:', error);
      return [];
    }
  }

  async cleanup(): Promise<void> {
    try {
      const keys = await this.getAllKeys();
      const cleanupPromises = keys.map(async (key) => {
        const value = await this.get(key);
        // If get returns null, it means the file was expired and already deleted
        return value;
      });

      await Promise.all(cleanupPromises);
      this.logger.log('Cleanup completed');
    } catch (error) {
      this.logger.error('Error during cleanup:', error);
    }
  }
}
