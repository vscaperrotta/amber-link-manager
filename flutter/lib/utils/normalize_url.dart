const _trackingParams = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'igshid', 'si', 'ref',
];

/// Normalizes a URL for duplicate comparison: strips www., trailing slash,
/// and known tracking query params, lowercases the result. Not for display —
/// comparison only. Mirrors browser/src/utils/normalizeUrl.js.
String normalizeUrl(String rawUrl) {
  try {
    final withScheme = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
        ? rawUrl
        : 'https://$rawUrl';
    final uri = Uri.parse(withScheme);
    final host = uri.host.replaceFirst(RegExp(r'^www\.'), '');
    var path = uri.path.replaceFirst(RegExp(r'/+$'), '');
    if (path.isEmpty) path = '/';
    final params = Map<String, String>.from(uri.queryParameters)
      ..removeWhere((key, _) => _trackingParams.contains(key));
    final sortedKeys = params.keys.toList()..sort();
    final query = sortedKeys.map((k) => '$k=${params[k]}').join('&');
    return '$host$path${query.isNotEmpty ? '?$query' : ''}'.toLowerCase();
  } catch (_) {
    return rawUrl.trim().toLowerCase();
  }
}
