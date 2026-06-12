import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart' as app;
import '../providers/link_provider.dart';
import '../screens/options_screen.dart';
import '../utils/i18n.dart';

class AuthNavItem extends StatelessWidget {
  const AuthNavItem({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<app.AuthProvider>();

    if (authProvider.isLoggedIn) {
      return PopupMenuButton<String>(
        icon: const CircleAvatar(
          radius: 16,
          child: Icon(Icons.person, size: 20),
        ),
        onSelected: (value) async {
          if (value == 'logout') {
            await authProvider.signOut();
            if (context.mounted) {
              context.read<LinkProvider>().loadLinks();
            }
          } else if (value == 'settings') {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const OptionsScreen()),
            );
          }
        },
        itemBuilder: (context) => [
          PopupMenuItem(
            enabled: false,
            child: Text(
              authProvider.user?.email ?? '',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          const PopupMenuDivider(),
          PopupMenuItem(
            value: 'settings',
            child: Row(
              children: [
                const Icon(Icons.settings_outlined, size: 18),
                const SizedBox(width: 8),
                Text(t('options.title')),
              ],
            ),
          ),
          const PopupMenuDivider(),
          PopupMenuItem(
            value: 'logout',
            child: Row(
              children: [
                const Icon(Icons.logout, size: 18),
                const SizedBox(width: 8),
                Text(t('nav.signOut')),
              ],
            ),
          ),
        ],
      );
    }

    return IconButton(
      icon: const Icon(Icons.person_outline),
      tooltip: t('options.title'),
      onPressed: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const OptionsScreen()),
        );
      },
    );
  }
}
