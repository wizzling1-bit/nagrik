import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

/// Utility methods for safely launching URLs, mail, phone calls, and clipboard actions.
abstract final class UrlHelper {
  /// Launches an arbitrary URL string in an external application / browser.
  static Future<bool> launchUrlSafe(BuildContext context, String url) async {
    final trimmed = url.trim();
    if (trimmed.isEmpty) return false;

    try {
      final uri = Uri.parse(trimmed);
      final success = await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );
      if (!success && context.mounted) {
        _showErrorSnackBar(context, 'Could not open link: $url');
      }
      return success;
    } catch (e) {
      if (context.mounted) {
        _showErrorSnackBar(context, 'Unable to open link');
      }
      return false;
    }
  }

  /// Launches an email client with the specified recipient and optional subject.
  static Future<bool> launchEmail(
    BuildContext context,
    String email, {
    String? subject,
    String? body,
  }) async {
    try {
      final uri = Uri(
        scheme: 'mailto',
        path: email.trim(),
        queryParameters: {
          if (subject != null && subject.isNotEmpty) 'subject': subject,
          if (body != null && body.isNotEmpty) 'body': body,
        },
      );
      final success = await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );
      if (!success && context.mounted) {
        await copyToClipboard(context, email, 'Email address');
      }
      return success;
    } catch (_) {
      if (context.mounted) {
        await copyToClipboard(context, email, 'Email address');
      }
      return false;
    }
  }

  /// Launches the phone dialer with the specified phone number.
  static Future<bool> launchPhone(BuildContext context, String phone) async {
    try {
      final clean = phone.replaceAll(RegExp(r'[^0-9+]'), '');
      final uri = Uri(scheme: 'tel', path: clean);
      final success = await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );
      if (!success && context.mounted) {
        await copyToClipboard(context, phone, 'Phone number');
      }
      return success;
    } catch (_) {
      if (context.mounted) {
        await copyToClipboard(context, phone, 'Phone number');
      }
      return false;
    }
  }

  /// Copies text to clipboard and displays an informative floating SnackBar.
  static Future<void> copyToClipboard(
    BuildContext context,
    String text,
    String label,
  ) async {
    await Clipboard.setData(ClipboardData(text: text));
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle_outline, color: Colors.white, size: 18),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                '$label copied to clipboard',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  static void _showErrorSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 3),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }
}
