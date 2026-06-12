import 'package:http/http.dart' as http;
import 'package:html/parser.dart' as html_parser;

class MetadataService {
  static const _timeout = Duration(seconds: 5);

  /// Tenta di ricavare il titolo della pagina all'URL fornito.
  /// Priorità: og:title → <title> → hostname.
  /// Ritorna null se la richiesta fallisce o il contenuto non è HTML.
  static Future<String?> fetchTitle(String rawUrl) async {
    try {
      final urlStr =
          rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
          ? rawUrl
          : 'https://$rawUrl';
      final uri = Uri.parse(urlStr);

      final response = await http
          .get(uri, headers: {'User-Agent': 'Mozilla/5.0 Kangaroo/1.0'})
          .timeout(_timeout);

      if (response.statusCode < 200 || response.statusCode >= 300) return null;

      final contentType = response.headers['content-type'] ?? '';
      if (!contentType.contains('html')) return null;

      final document = html_parser.parse(response.body);

      // 1. og:title
      final ogTitle = document
          .querySelector('meta[property="og:title"]')
          ?.attributes['content']
          ?.trim();
      if (ogTitle != null && ogTitle.isNotEmpty) return ogTitle;

      // 2. <title>
      final titleTag = document.querySelector('title')?.text.trim();
      if (titleTag != null && titleTag.isNotEmpty) return titleTag;

      // 3. Hostname come fallback
      return uri.host;
    } catch (_) {
      return null;
    }
  }
}
