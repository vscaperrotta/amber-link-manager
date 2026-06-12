import 'dart:convert';
import 'package:http/http.dart' as http;

class OpenRouterService {
  static const _baseUrl = 'https://openrouter.ai/api/v1/chat/completions';

  final String apiKey;
  final String model;

  OpenRouterService({required this.apiKey, required this.model});

  /// Generates a concise 1-2 sentence description for a link.
  /// Returns null on failure.
  Future<String?> generateDescription({
    required String title,
    required String url,
  }) async {
    final prompt =
        'Generate a concise 1-2 sentence description of this webpage for a '
        'bookmarking app. Be informative and specific. Reply with only the '
        'description, no quotes or preamble.\n\nTitle: $title\nURL: $url';

    try {
      final response = await http.post(
        Uri.parse(_baseUrl),
        headers: {
          'Authorization': 'Bearer $apiKey',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'model': model,
          'messages': [
            {'role': 'user', 'content': prompt},
          ],
          'max_tokens': 150,
          'temperature': 0.3,
        }),
      );

      if (response.statusCode != 200) return null;

      final data = jsonDecode(response.body) as Map<String, dynamic>;
      final choices = data['choices'] as List?;
      if (choices == null || choices.isEmpty) return null;

      final content =
          (choices.first as Map)['message']?['content'] as String?;
      return content?.trim();
    } catch (_) {
      return null;
    }
  }
}
