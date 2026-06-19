import 'package:uuid/uuid.dart';

class CollectionItem {
  final String id;
  final String name;
  final String? parentId;
  final String? color;
  final DateTime createdAt;

  CollectionItem({
    String? id,
    required this.name,
    this.parentId,
    this.color,
    DateTime? createdAt,
  }) : id = id ?? const Uuid().v4(),
       createdAt = createdAt ?? DateTime.now();

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'parent_id': parentId,
      'color': color,
      'created_at': createdAt.millisecondsSinceEpoch,
    };
  }

  Map<String, dynamic> toFirestoreMap() {
    return {
      'name': name,
      'parentId': parentId,
      'color': color,
      'createdAt': createdAt.millisecondsSinceEpoch,
    };
  }

  factory CollectionItem.fromMap(Map<String, dynamic> map) {
    return CollectionItem(
      id: map['id'] as String,
      name: map['name'] as String,
      parentId: map['parent_id'] as String? ?? map['parentId'] as String?,
      color: map['color'] as String?,
      createdAt: map['created_at'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['created_at'] as int)
          : map['createdAt'] != null
              ? DateTime.fromMillisecondsSinceEpoch(map['createdAt'] as int)
              : DateTime.now(),
    );
  }

  CollectionItem copyWith({String? name, String? parentId, String? color}) {
    return CollectionItem(
      id: id,
      name: name ?? this.name,
      parentId: parentId ?? this.parentId,
      color: color ?? this.color,
      createdAt: createdAt,
    );
  }
}
