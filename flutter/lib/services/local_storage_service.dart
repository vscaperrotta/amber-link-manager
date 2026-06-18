import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/link_item.dart';
import '../models/collection_item.dart';

class LocalStorageService {
  static Database? _database;

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'amber.db');

    return await openDatabase(
      path,
      version: 7,
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
            ai_description TEXT DEFAULT '',
            thumbnail TEXT DEFAULT '',
            note TEXT DEFAULT '',
            collection_id TEXT DEFAULT ''
          )
        ''');
        await db.execute('''
          CREATE TABLE collections(
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            parent_id TEXT,
            created_at INTEGER NOT NULL
          )
        ''');
      },
      onUpgrade: (db, oldVersion, newVersion) async {
        if (oldVersion < 2) {
          await db.execute(
            'ALTER TABLE links ADD COLUMN tags TEXT NOT NULL DEFAULT \'\'',
          );
          try {
            await db.execute(
              'ALTER TABLE links ADD COLUMN savedAt INTEGER NOT NULL DEFAULT 0',
            );
            await db.execute(
              'UPDATE links SET savedAt = CAST(strftime(\'%s\', createdAt) * 1000 AS INTEGER) WHERE savedAt = 0',
            );
          } catch (_) {}
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
        if (oldVersion < 5) {
          await db.execute(
            'ALTER TABLE links ADD COLUMN thumbnail TEXT DEFAULT \'\'',
          );
        }
        if (oldVersion < 6) {
          await db.execute(
            'ALTER TABLE links ADD COLUMN note TEXT DEFAULT \'\'',
          );
        }
        if (oldVersion < 7) {
          await db.execute(
            'ALTER TABLE links ADD COLUMN collection_id TEXT DEFAULT \'\'',
          );
          await db.execute('''
            CREATE TABLE IF NOT EXISTS collections(
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              parent_id TEXT,
              created_at INTEGER NOT NULL
            )
          ''');
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

  // ── Collections ────────────────────────────────────────────────────────────

  Future<List<CollectionItem>> getCollections() async {
    final db = await database;
    final maps = await db.query('collections', orderBy: 'created_at ASC');
    return maps.map((m) => CollectionItem.fromMap(m)).toList();
  }

  Future<void> addCollection(CollectionItem collection) async {
    final db = await database;
    await db.insert(
      'collections',
      collection.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<void> updateCollection(CollectionItem collection) async {
    final db = await database;
    await db.update(
      'collections',
      collection.toMap(),
      where: 'id = ?',
      whereArgs: [collection.id],
    );
  }

  Future<void> deleteCollection(String id) async {
    final db = await database;
    await db.delete('collections', where: 'id = ?', whereArgs: [id]);
  }
}
