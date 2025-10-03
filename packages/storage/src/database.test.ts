import { describe, it, expect, runTests } from '@sldm/testing';

import type { RecordWithId } from './async-types';
import { MemoryDatabaseAdapter } from './database-storage';

interface User extends RecordWithId {
  id: string;
  name: string;
  email: string;
  age: number;
}

describe('DatabaseAdapter - CRUD Operations', () => {
  it('should create a record with auto-generated ID', async () => {
    const db = new MemoryDatabaseAdapter<User>();

    const user = await db.create({
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
    });

    expect(user.id).toBeDefined();
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.age).toBe(30);
  });

  it('should find a record by ID', async () => {
    const db = new MemoryDatabaseAdapter<User>();

    const created = await db.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25,
    });

    const found = await db.findById(created.id);
    expect(found).toEqual(created);
  });

  it('should return null for non-existent ID', async () => {
    const db = new MemoryDatabaseAdapter<User>();

    const found = await db.findById('nonexistent');
    expect(found).toBe(null);
  });

  it('should update a record', async () => {
    const db = new MemoryDatabaseAdapter<User>();

    const created = await db.create({
      name: 'Bob Johnson',
      email: 'bob@example.com',
      age: 35,
    });

    const updated = await db.update(created.id, {
      age: 36,
      email: 'bob.j@example.com',
    });

    expect(updated.id).toBe(created.id);
    expect(updated.name).toBe('Bob Johnson');
    expect(updated.email).toBe('bob.j@example.com');
    expect(updated.age).toBe(36);
  });

  it('should delete a record', async () => {
    const db = new MemoryDatabaseAdapter<User>();

    const created = await db.create({
      name: 'Alice Wonder',
      email: 'alice@example.com',
      age: 28,
    });

    await db.delete(created.id);

    const found = await db.findById(created.id);
    expect(found).toBe(null);
  });

  it('should get all records', async () => {
    const db = new MemoryDatabaseAdapter<User>();
    await db.clear();

    await db.create({ name: 'User 1', email: 'user1@example.com', age: 20 });
    await db.create({ name: 'User 2', email: 'user2@example.com', age: 25 });
    await db.create({ name: 'User 3', email: 'user3@example.com', age: 30 });

    const all = await db.getAll();
    expect(all.length).toBe(3);
  });
});

describe('DatabaseAdapter - Query Operations', () => {
  it('should query with filter function', async () => {
    const db = new MemoryDatabaseAdapter<User>();
    await db.clear();

    await db.create({ name: 'Young User', email: 'young@example.com', age: 18 });
    await db.create({ name: 'Adult User', email: 'adult@example.com', age: 30 });
    await db.create({ name: 'Senior User', email: 'senior@example.com', age: 65 });

    const adults = await db.query((user: User) => user.age >= 18 && user.age < 65);
    expect(adults.length).toBe(2);
  });

  it('should query with where clause', async () => {
    const db = new MemoryDatabaseAdapter<User>();
    await db.clear();

    await db.create({ name: 'John', email: 'john@example.com', age: 30 });
    await db.create({ name: 'Jane', email: 'jane@example.com', age: 25 });
    await db.create({ name: 'John', email: 'john2@example.com', age: 35 });

    const johns = await db.query({
      where: { name: 'John' },
    });

    expect(johns.length).toBe(2);
    expect(johns.every((u: User) => u.name === 'John')).toBe(true);
  });

  it('should query with ordering', async () => {
    const db = new MemoryDatabaseAdapter<User>();
    await db.clear();

    await db.create({ name: 'Charlie', email: 'charlie@example.com', age: 30 });
    await db.create({ name: 'Alice', email: 'alice@example.com', age: 25 });
    await db.create({ name: 'Bob', email: 'bob@example.com', age: 35 });

    const ordered = await db.query({
      orderBy: 'name',
      order: 'asc',
    });

    expect(ordered[0].name).toBe('Alice');
    expect(ordered[1].name).toBe('Bob');
    expect(ordered[2].name).toBe('Charlie');
  });

  it('should query with limit', async () => {
    const db = new MemoryDatabaseAdapter<User>();
    await db.clear();

    await db.create({ name: 'User 1', email: 'user1@example.com', age: 20 });
    await db.create({ name: 'User 2', email: 'user2@example.com', age: 25 });
    await db.create({ name: 'User 3', email: 'user3@example.com', age: 30 });
    await db.create({ name: 'User 4', email: 'user4@example.com', age: 35 });

    const limited = await db.query({
      limit: 2,
    });

    expect(limited.length).toBe(2);
  });

  it('should query with offset', async () => {
    const db = new MemoryDatabaseAdapter<User>();
    await db.clear();

    await db.create({ name: 'User 1', email: 'user1@example.com', age: 20 });
    await db.create({ name: 'User 2', email: 'user2@example.com', age: 25 });
    await db.create({ name: 'User 3', email: 'user3@example.com', age: 30 });
    await db.create({ name: 'User 4', email: 'user4@example.com', age: 35 });

    const offset = await db.query({
      offset: 2,
    });

    expect(offset.length).toBe(2);
  });

  it('should count records', async () => {
    const db = new MemoryDatabaseAdapter<User>();
    await db.clear();

    await db.create({ name: 'User 1', email: 'user1@example.com', age: 20 });
    await db.create({ name: 'User 2', email: 'user2@example.com', age: 25 });
    await db.create({ name: 'User 3', email: 'user3@example.com', age: 30 });

    const count = await db.count();
    expect(count).toBe(3);
  });

  it('should count records with filter', async () => {
    const db = new MemoryDatabaseAdapter<User>();
    await db.clear();

    await db.create({ name: 'User 1', email: 'user1@example.com', age: 20 });
    await db.create({ name: 'User 2', email: 'user2@example.com', age: 25 });
    await db.create({ name: 'User 3', email: 'user3@example.com', age: 30 });

    const count = await db.count((user: User) => user.age >= 25);
    expect(count).toBe(2);
  });
});

describe('DatabaseAdapter - Batch Operations', () => {
  it('should get many records by IDs', async () => {
    const db = new MemoryDatabaseAdapter<User>();
    await db.clear();

    const user1 = await db.create({ name: 'User 1', email: 'user1@example.com', age: 20 });
    await db.create({ name: 'User 2', email: 'user2@example.com', age: 25 });
    const user3 = await db.create({ name: 'User 3', email: 'user3@example.com', age: 30 });

    const users = await db.getMany([user1.id, user3.id, 'nonexistent']);
    expect(users.length).toBe(3);
    expect(users[0]).toEqual(user1);
    expect(users[1]).toEqual(user3);
    expect(users[2]).toBe(null);
  });

  it('should set many records', async () => {
    const db = new MemoryDatabaseAdapter<User>();
    await db.clear();

    await db.setMany([
      ['id1', { id: 'id1', name: 'User 1', email: 'user1@example.com', age: 20 }],
      ['id2', { id: 'id2', name: 'User 2', email: 'user2@example.com', age: 25 }],
      ['id3', { id: 'id3', name: 'User 3', email: 'user3@example.com', age: 30 }],
    ]);

    const all = await db.getAll();
    expect(all.length).toBe(3);
  });

  it('should remove many records', async () => {
    const db = new MemoryDatabaseAdapter<User>();
    await db.clear();

    const user1 = await db.create({ name: 'User 1', email: 'user1@example.com', age: 20 });
    const user2 = await db.create({ name: 'User 2', email: 'user2@example.com', age: 25 });
    const user3 = await db.create({ name: 'User 3', email: 'user3@example.com', age: 30 });

    await db.removeMany([user1.id, user3.id]);

    expect(await db.findById(user1.id)).toBe(null);
    expect(await db.findById(user2.id)).not.toBe(null);
    expect(await db.findById(user3.id)).toBe(null);
  });
});

// Run all tests
runTests();
