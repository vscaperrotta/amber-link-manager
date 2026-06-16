import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:html/parser.dart' as html_parser;

class LinkMetadata {
  final String? title;
  final String? thumbnail;
  const LinkMetadata({this.title, this.thumbnail});
}

class MetadataService {
  static const _timeout = Duration(seconds: 8);

  static Future<LinkMetadata> fetchMetadata(String rawUrl) async {
    try {
      final urlStr =
          rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
          ? rawUrl
          : 'https://$rawUrl';
      final uri = Uri.parse(urlStr);

      debugPrint('[MetadataService] fetching $uri');
      final response = await http
          .get(uri, headers: {
            'User-Agent':
                'Mozilla/5.0 (compatible; Amber/1.0; +https://github.com/vscaperrotta/amber-link-manager)',
          })
          .timeout(_timeout);

      debugPrint('[MetadataService] status=${response.statusCode} ct=${response.headers['content-type']}');

      if (response.statusCode < 200 || response.statusCode >= 300) {
        return const LinkMetadata();
      }

      final contentType = response.headers['content-type'] ?? '';
      if (!contentType.contains('html')) return const LinkMetadata();

      final document = html_parser.parse(response.body);

      // Title: og:title → <title> → hostname
      final ogTitle = document
          .querySelector('meta[property="og:title"]')
          ?.attributes['content']
          ?.trim();
      final titleTag = document.querySelector('title')?.text.trim();
      final title =
          (ogTitle != null && ogTitle.isNotEmpty ? ogTitle : null) ??
          (titleTag != null && titleTag.isNotEmpty ? titleTag : null) ??
          uri.host;

      // Thumbnail: og:image → twitter:image
      final ogImage = document
          .querySelector('meta[property="og:image"]')
          ?.attributes['content']
          ?.trim();
      final twitterImage = document
          .querySelector('meta[name="twitter:image"]')
          ?.attributes['content']
          ?.trim();
      String? thumbnail =
          (ogImage != null && ogImage.isNotEmpty ? ogImage : null) ??
          (twitterImage != null && twitterImage.isNotEmpty
              ? twitterImage
              : null);

      // Resolve relative URLs
      if (thumbnail != null && !thumbnail.startsWith('http')) {
        thumbnail = uri.resolve(thumbnail).toString();
      }

      debugPrint('[MetadataService] title=$title thumbnail=$thumbnail');
      return LinkMetadata(title: title, thumbnail: thumbnail);
    } catch (e) {
      debugPrint('[MetadataService] error: $e');
      return const LinkMetadata();
    }
  }

  static Future<String?> fetchTitle(String rawUrl) async {
    final meta = await fetchMetadata(rawUrl);
    return meta.title;
  }
}
