import 'package:flutter/material.dart';

/// Notification event classifications.
enum NotificationType {
  urgentAlert(
    label: 'Emergency Alert',
    icon: Icons.warning_amber_rounded,
    defaultColor: Color(0xFFE05656),
  ),
  civicGrievance(
    label: 'Civic Update',
    icon: Icons.account_balance_outlined,
    defaultColor: Color(0xFF4A7EC7),
  ),
  communityEvent(
    label: 'Community & Events',
    icon: Icons.event_outlined,
    defaultColor: Color(0xFF8B6CB5),
  ),
  engagement(
    label: 'Social & Engagement',
    icon: Icons.thumb_up_alt_outlined,
    defaultColor: Color(0xFF439B6F),
  ),
  systemUpdate(
    label: 'System Notice',
    icon: Icons.info_outline,
    defaultColor: Color(0xFF6B7C96),
  );

  const NotificationType({
    required this.label,
    required this.icon,
    required this.defaultColor,
  });

  final String label;
  final IconData icon;
  final Color defaultColor;
}
