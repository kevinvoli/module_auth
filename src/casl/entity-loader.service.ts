import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class EntityLoader {
  constructor(private connection: Connection) {}

  // Charge les entités dynamiquement
  getAllEntities(): string[] {
    return this.connection.entityMetadatas.map((meta) => meta.name);
  }
}
