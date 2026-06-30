import 'package:flutter/material.dart';
import '../models/collection_item.dart';
import '../services/collection_repository.dart';

const _kCollectionColors = [
  '#F5A623',
  '#5096F0',
  '#50D282',
  '#EE5555',
  '#A78BFA',
  '#4ECDC4',
  '#FF8C42',
  '#F06292',
];

Color collectionColor(String? hex, {int fallbackIndex = 0}) {
  final h = (hex?.isNotEmpty == true ? hex! : _kCollectionColors[fallbackIndex % _kCollectionColors.length])
      .replaceAll('#', '');
  return Color(int.parse('FF$h', radix: 16));
}

class CollectionProvider extends ChangeNotifier {
  final CollectionRepository _repository = CollectionRepository();
  List<CollectionItem> _collections = [];
  bool _isLoading = false;
  String? _activeCollectionId;

  List<CollectionItem> get collections => _collections;
  bool get isLoading => _isLoading;
  String? get activeCollectionId => _activeCollectionId;

  CollectionItem? get activeCollection =>
      _activeCollectionId != null
          ? _collections.where((c) => c.id == _activeCollectionId).firstOrNull
          : null;

  Future<void> loadCollections() async {
    _isLoading = true;
    notifyListeners();
    try {
      _collections = await _repository.getCollections();
    } catch (e) {
      debugPrint('[CollectionProvider] error loading: $e');
    }
    _isLoading = false;
    notifyListeners();
  }

  void setActiveCollection(String? id) {
    _activeCollectionId = id;
    notifyListeners();
  }

  Future<void> addCollection(String name, {String? parentId}) async {
    final color = _kCollectionColors[_collections.length % _kCollectionColors.length];
    final collection = CollectionItem(name: name, parentId: parentId, color: color);
    await _repository.addCollection(collection);
    await loadCollections();
  }

  Future<void> renameCollection(String id, String name) async {
    final existing = _collections.firstWhere((c) => c.id == id);
    await _repository.updateCollection(existing.copyWith(name: name));
    await loadCollections();
  }

  Future<void> deleteCollection(String id) async {
    await _repository.deleteCollection(id);
    if (_activeCollectionId == id) {
      _activeCollectionId = null;
    }
    await loadCollections();
  }
}
