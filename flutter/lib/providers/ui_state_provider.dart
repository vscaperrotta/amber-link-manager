import 'package:flutter/foundation.dart';

class UiStateProvider extends ChangeNotifier {
  bool _selectModeActive = false;
  bool get selectModeActive => _selectModeActive;

  void setSelectMode(bool active) {
    if (_selectModeActive == active) return;
    _selectModeActive = active;
    notifyListeners();
  }
}
