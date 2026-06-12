import 'dart:io';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/link_item.dart';

class LocalStorageService {
  static Database? _database;

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final newPath = join(dbPath, 'amber.db');
    final oldPath = join(dbPath, 'amber.db');

    // Migrate old db file to new name if it exists and new one doesn't
    final oldFile = File(oldPath);
    final newFile = File(newPath);
    if (await oldFile.exists() && !await newFile.exists()) {
      await oldFile.copy(newPath);
      await oldFile.delete();
    }

    final path = newPath;

    return await openDatabase(
      path,
      version: 4,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE links(
            id TEXT PRIMARY KEY,
            url TEXT NOT NULL,
            title TEXT NOT NULL,
            tags TEXT NOT NULL DEFAULT '',
            savedAt INTEGER NOT NULL,
            is_favorite INTEGER NOT NULL DEFAULT 0,
            is_read INTEGER NOT NULL DEFAULT 1,
            ai_description TEXT DEFAULT ''
          )
        ''');
      },
      onUpgrade: (db, oldVersion, newVersion) async {
        if (oldVersion < 2) {
          await db.execute(
            'ALTER TABLE links ADD COLUMN tags TEXT NOT NULL DEFAULT \'\'',
          );
          // Rinomina createdAt → savedAt solo se la colonna esiste ancora
          // (migration sicura: aggiunge savedAt ricavato da createdAt)
          try {
            await db.execute(
              'ALTER TABLE links ADD COLUMN savedAt INTEGER NOT NULL DEFAULT 0',
            );
            await db.execute(
              'UPDATE links SET savedAt = CAST(strftime(\'%s\', createdAt) * 1000 AS INTEGER) WHERE savedAt = 0',
            );
          } catch (_) {
            // savedAt potrebbe già esistere
          }
        }
        if (oldVersion < 3) {
          await db.execute(
            'ALTER TABLE links ADD COLUMN is_favorite INTEGER NOT NULL DEFAULT 0',
          );
        }
        if (oldVersion < 4) {
          await db.execute(
            'ALTER TABLE links ADD COLUMN is_read INTEGER NOT NULL DEFAULT 1',
          );
          await db.execute(
            'ALTER TABLE links ADD COLUMN ai_description TEXT DEFAULT \'\'',
          );
        }
      },
    );
  }

  Future<List<LinkItem>> getLinks() async {
    final db = await database;
    final maps = await db.query('links', orderBy: 'savedAt DESC');
    return maps.map((map) => LinkItem.fromMap(map)).toList();
  }

  Future<void> addLink(LinkItem link) async {
    final db = await database;
    await db.insert(
      'links',
      link.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<void> deleteLink(String id) async {
    final db = await database;
    await db.delete('links', where: 'id = ?', whereArgs: [id]);
  }

  Future<void> updateLink(LinkItem link) async {
    final db = await database;
    await db.update(
      'links',
      link.toMap(),
      where: 'id = ?',
      whereArgs: [link.id],
    );
  }

  Future<void> deleteAllLinks() async {
    final db = await database;
    await db.delete('links');
  }
}
