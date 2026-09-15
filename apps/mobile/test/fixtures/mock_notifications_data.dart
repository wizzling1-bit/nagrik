import 'package:nagrik/features/notifications/domain/models/app_notification.dart';
import 'package:nagrik/features/notifications/domain/models/notification_type.dart';

final List<AppNotification> kMockNotifications = [
  AppNotification(
    id: 'notif_urg_1',
    type: NotificationType.urgentAlert,
    title: 'Severe Waterlogging Alert on EM Bypass',
    body:
        'Heavy rainfall causing knee-deep water near Ruby Crossing. Traffic police advises taking Prince Anwar Shah connector.',
    timestamp: DateTime.now().subtract(const Duration(minutes: 18)),
    isRead: false,
    sourceName: 'Kolkata Traffic Police',
    isCritical: true,
  ),
  AppNotification(
    id: 'notif_news_1',
    type: NotificationType.urgentAlert,
    title: 'New Solar Bus Shelters Opened in New Town',
    body:
        'NKDA inaugurated 14 solar-powered bus stops with free phone charging and emergency SOS.',
    timestamp: DateTime.now().subtract(const Duration(hours: 3)),
    isRead: false,
    sourceName: 'Metro Infrastructure',
  ),
  AppNotification(
    id: 'notif_vid_1',
    type: NotificationType.communityEvent,
    title: 'Kumartuli Idol Making Video Report Now Live',
    body:
        'Watch the ground report on eco-friendly idol sculpting in North Kolkata.',
    timestamp: DateTime.now().subtract(const Duration(hours: 5)),
    isRead: false,
    sourceName: 'Bangla Lok Sangbad',
  ),
  AppNotification(
    id: 'notif_news_2',
    type: NotificationType.systemUpdate,
    title: 'Orange Line Metro Trial Run Concluded',
    body:
        'Successful train trial between Ruby and Salt Lake Sector V completed this afternoon.',
    timestamp: DateTime.now().subtract(const Duration(hours: 14)),
    isRead: true,
    sourceName: 'Transit Watch Bengal',
  ),
  AppNotification(
    id: 'notif_env_1',
    type: NotificationType.communityEvent,
    title: 'Rabindra Sarobar Lake Cleared of Plastic',
    body:
        'Over 3 tonnes of debris cleared by urban forestry volunteers before migratory bird season.',
    timestamp: DateTime.now().subtract(const Duration(days: 1)),
    isRead: true,
    sourceName: 'Green Kolkata Initiative',
  ),
  AppNotification(
    id: 'notif_sys_1',
    type: NotificationType.systemUpdate,
    title: 'Bengali & Hindi Language Support Active',
    body:
        'Switch your reading language anytime from the settings screen.',
    timestamp: DateTime.now().subtract(const Duration(days: 2)),
    isRead: true,
    sourceName: 'Nagrik News Desk',
  ),
];
