// Firebase config — values injected at build time via --dart-define-from-file.
// Run with: flutter run --dart-define-from-file=env.json
// See env.example.json for the required keys.

import 'dart:io';
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;

const _apiKey = String.fromEnvironment('FIREBASE_API_KEY');
const _androidAppId = String.fromEnvironment('FIREBASE_ANDROID_APP_ID');
const _iosAppId = String.fromEnvironment('FIREBASE_IOS_APP_ID');
const _messagingSenderId = String.fromEnvironment('FIREBASE_MESSAGING_SENDER_ID');
const _projectId = String.fromEnvironment('FIREBASE_PROJECT_ID');
const _databaseURL = String.fromEnvironment('FIREBASE_DATABASE_URL');
const _storageBucket = String.fromEnvironment('FIREBASE_STORAGE_BUCKET');
const _iosBundleId = String.fromEnvironment('FIREBASE_IOS_BUNDLE_ID');

/// Default [FirebaseOptions] for use with your Firebase apps.
///
/// Example:
/// ```dart
/// import 'firebase_options.dart';
/// // ...
/// await Firebase.initializeApp(
///   options: DefaultFirebaseOptions.currentPlatform,
/// );
/// ```
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (Platform.isAndroid) {
      return android;
    }
    if (Platform.isIOS) {
      return ios;
    }
    throw UnsupportedError(
      'DefaultFirebaseOptions are not supported for this platform.',
    );
  }

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: _apiKey,
    appId: _androidAppId,
    messagingSenderId: _messagingSenderId,
    projectId: _projectId,
    databaseURL: _databaseURL,
    storageBucket: _storageBucket,
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: _apiKey,
    appId: _iosAppId,
    messagingSenderId: _messagingSenderId,
    projectId: _projectId,
    databaseURL: _databaseURL,
    storageBucket: _storageBucket,
    iosBundleId: _iosBundleId,
  );
}
