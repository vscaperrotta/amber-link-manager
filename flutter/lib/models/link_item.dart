import 'package:uuid/uuid.dart';

class LinkItem {
  final String id;
  final String url;
  final String title;
  final List<String> tags;
  final DateTime createdAt;
  final bool isFavorite;
  final bool isRead;
  final String? aiDescription;

  LinkItem({
    String? id,
    required this.url,
    required this.title,
    List<String>? tags,
    DateTime? createdAt,
    bool? isFavorite,
    bool? isRead,
    this.aiDescription,
  }) : id = id ?? const Uuid().v4(),
       tags = tags ?? const [],
       createdAt = createdAt ?? DateTime.now(),
       isFavorite = isFavorite ?? false,
       isRead = isRead ?? true;

  /// Usato per SQLite: include 'id' come PRIMARY KEY, tags come stringa CSV.
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'url': url,
      'title': title,
      'tags': tags.join(','),
      'savedAt': createdAt.millisecondsSinceEpoch,
      'is_favorite': isFavorite ? 1 : 0,
      'is_read': isRead ? 1 : 0,
      'ai_description': aiDescription ?? '',
    };
  }

  /// Usato per Firestore: niente campo 'id' nel body (il doc ID è l'UUID),
  /// tags in metadata.tags come lista, struttura identica a Chrome.
  Map<String, dynamic> toFirestoreMap() {
    final metadata = <String, dynamic>{
      'tags': tags,
      'isFavorite': isFavorite,
      'isRead': isRead,
    };
    if (aiDescription != null && aiDescription!.isNotEmpty) {
      metadata['aiDescription'] = aiDescription;
    }
    return {
      'url': url,
      'title': title,
      'savedAt': createdAt.millisecondsSinceEpoch,
      'metadata': metadata,
    };
  }

  factory LinkItem.fromMap(Map<String, dynamic> map) {
    DateTime? createdDate;

    // Supporta sia 'createdAt' che 'savedAt' per retrocompatibilità
    if (map.containsKey('savedAt') && map['savedAt'] != null) {
      final timestamp = map['savedAt'];
      if (timestamp is int) {
        createdDate = DateTime.fromMillisecondsSinceEpoch(timestamp);
      } else if (timestamp is String) {
        createdDate = DateTime.tryParse(timestamp);
      }
    } else if (map.containsKey('createdAt') && map['createdAt'] != null) {
      final raw = map['createdAt'];
      if (raw is String) {
        createdDate = DateTime.tryParse(raw);
      }
    }

    return LinkItem(
      id: map['id'] as String? ?? const Uuid().v4(),
      url: map['url'] as String,
      title: map['title'] as String,
      tags: _parseTags(map),
      createdAt: createdDate ?? DateTime.now(),
      isFavorite: _parseFavorite(map),
      isRead: _parseIsRead(map),
      aiDescription: _parseAiDescription(map),
    );
  }

  static bool _parseFavorite(Map<String, dynamic> map) {
    final metadata = map['metadata'];
    if (metadata is Map && metadata['isFavorite'] is bool) {
      return metadata['isFavorite'] as bool;
    }
    if (map['is_favorite'] is int) return (map['is_favorite'] as int) == 1;
    return false;
  }

  static bool _parseIsRead(Map<String, dynamic> map) {
    final metadata = map['metadata'];
    if (metadata is Map && metadata['isRead'] is bool) {
      return metadata['isRead'] as bool;
    }
    if (map['is_read'] is int) return (map['is_read'] as int) == 1;
    return true; // default: read
  }

  static String? _parseAiDescription(Map<String, dynamic> map) {
    final metadata = map['metadata'];
    if (metadata is Map && metadata['aiDescription'] is String) {
      final val = metadata['aiDescription'] as String;
      return val.isEmpty ? null : val;
    }
    if (map['ai_description'] is String) {
      final val = map['ai_description'] as String;
      return val.isEmpty ? null : val;
    }
    return null;
  }

  static List<String> _parseTags(Map<String, dynamic> map) {
    // Firestore: metadata.tags è una List
    final metadata = map['metadata'];
    if (metadata is Map && metadata['tags'] is List) {
      return (metadata['tags'] as List)
          .map((t) => t.toString().toUpperCase())
          .toList();
    }
    // SQLite: tags è una stringa CSV
    if (map['tags'] is String && (map['tags'] as String).isNotEmpty) {
      return (map['tags'] as String)
          .split(',')
          .map((t) => t.trim().toUpperCase())
          .where((t) => t.isNotEmpty)
          .toList();
    }
    return [];
  }

  LinkItem copyWith({
    String? url,
    String? title,
    List<String>? tags,
    bool? isFavorite,
    bool? isRead,
    String? aiDescription,
  }) {
    return LinkItem(
      id: id,
      url: url ?? this.url,
      title: title ?? this.title,
      tags: tags ?? this.tags,
      createdAt: createdAt,
      isFavorite: isFavorite ?? this.isFavorite,
      isRead: isRead ?? this.isRead,
      aiDescription: aiDescription ?? this.aiDescription,
    );
  }

  @override
  String toString() =>
      'LinkItem(id: $id, url: $url, title: $title, tags: $tags, isFavorite: $isFavorite, isRead: $isRead)';
}
