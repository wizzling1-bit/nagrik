import 'package:nagrik/features/feed/domain/models/comment.dart';
import 'package:nagrik/features/feed/domain/models/post.dart';
import 'package:nagrik/features/feed/domain/models/post_author.dart';
import 'package:nagrik/features/feed/domain/models/post_category.dart';
import 'package:nagrik/features/feed/domain/models/post_type.dart';

final List<Post> kMockPosts = [
  // 1. Urgent Breaking Local News
  Post(
    id: 'post_breaking_1',
    type: PostType.news,
    category: PostCategory.traffic,
    author: const PostAuthor(
      id: 'auth_traffic',
      name: 'Kolkata Traffic Desk',
      isVerified: true,
      badgeTitle: 'Official Agency',
      distanceKm: 0.8,
    ),
    title: 'Severe Waterlogging on EM Bypass near Kasba Connector',
    body:
        'Heavy downpours have triggered acute water stagnation on the southbound EM Bypass. Slow moving traffic from Ruby toward Science City. Motorists are advised to divert via Jadavpur connector.',
    locality: 'Kasba',
    city: 'Kolkata',
    createdAt: DateTime.now().subtract(const Duration(minutes: 12)),
    isUrgent: true,
    likesCount: 142,
    commentsCount: 29,
    sharesCount: 88,
    comments: [
      Comment(
        id: 'c1',
        author: const PostAuthor(id: 'u1', name: 'Debashis Sen', distanceKm: 0.4),
        text: 'Drainage pumps are now operational near the Ruby intersection.',
        createdAt: DateTime.now().subtract(const Duration(minutes: 5)),
        likesCount: 12,
      ),
    ],
  ),

  // 2. Short Local Video Report
  Post(
    id: 'post_video_1',
    type: PostType.video,
    category: PostCategory.events,
    author: const PostAuthor(
      id: 'auth_media_1',
      name: 'Bangla Lok Sangbad',
      isVerified: true,
      badgeTitle: 'Local Reporter',
      distanceKm: 2.1,
    ),
    title: 'Kumartuli Idol Making in Full Swing ahead of Durga Puja',
    body:
        'Exclusive ground report from the potters quarter in North Kolkata as traditional artisans sculpt eco-friendly clay idols for community pujas.',
    locality: 'Kumartuli',
    city: 'Kolkata',
    createdAt: DateTime.now().subtract(const Duration(hours: 1)),
    videoDuration: '0:58',
    viewCount: 4820,
    likesCount: 384,
    commentsCount: 45,
    sharesCount: 120,
    mediaUrls: [
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800',
    ],
  ),

  // 3. Local Infrastructure News
  Post(
    id: 'post_news_1',
    type: PostType.news,
    category: PostCategory.utilities,
    author: const PostAuthor(
      id: 'auth_metro',
      name: 'City Infrastructure Desk',
      isVerified: true,
      badgeTitle: 'Verified Media',
      distanceKm: 3.5,
    ),
    title: 'New Solar Powered Bus Shelters Inaugurated Across New Town',
    body:
        'NKDA has unveiled 14 smart passenger bus shelters equipped with solar charging docks, real-time bus tracking screens, and emergency SOS buttons.',
    locality: 'Action Area II',
    city: 'Kolkata',
    createdAt: DateTime.now().subtract(const Duration(hours: 5)),
    likesCount: 215,
    commentsCount: 31,
    sharesCount: 64,
    mediaUrls: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
    ],
  ),

  // 4. Ground Video Report on Metro Expansion
  Post(
    id: 'post_video_2',
    type: PostType.video,
    category: PostCategory.traffic,
    author: const PostAuthor(
      id: 'auth_transit',
      name: 'Transit Watch Bengal',
      isVerified: true,
      badgeTitle: 'Transit Reporter',
      distanceKm: 1.4,
    ),
    title: 'Orange Line Metro Trial Runs Reach Salt Lake Sector V',
    body:
        'First passenger trial runs successfully concluded between Ruby and Salt Lake Sector V stations today. Commercial launch expected next month.',
    locality: 'Sector V',
    city: 'Kolkata',
    createdAt: DateTime.now().subtract(const Duration(hours: 8)),
    videoDuration: '1:15',
    viewCount: 7350,
    likesCount: 512,
    commentsCount: 63,
    sharesCount: 195,
    mediaUrls: [
      'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800',
    ],
  ),

  // 5. Neighborhood Environmental News
  Post(
    id: 'post_news_2',
    type: PostType.news,
    category: PostCategory.utilities,
    author: const PostAuthor(
      id: 'auth_green',
      name: 'Green Kolkata Initiative',
      isVerified: true,
      badgeTitle: 'Verified Desk',
      distanceKm: 4.2,
    ),
    title: 'Rabindra Sarobar Lake Cleared of Plastic Ahead of Winter Migrations',
    body:
        'Over 200 student volunteers and urban forestry teams completed a two-day lake restoration drive, removing 3 tonnes of floating debris.',
    locality: 'Dhakuria',
    city: 'Kolkata',
    createdAt: DateTime.now().subtract(const Duration(days: 1)),
    likesCount: 340,
    commentsCount: 22,
    sharesCount: 91,
    mediaUrls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    ],
  ),
];

/// Generates authentic, location-relevant fallback news and video posts for any selected city and locality.
List<Post> getLocalizedFallbackPosts({String? city, String? area}) {
  final targetCity =
      (city != null && city.trim().isNotEmpty) ? city.trim() : 'Patna';
  final targetArea = (area != null && area.trim().isNotEmpty)
      ? area.trim()
      : (targetCity.toLowerCase() == 'patna'
          ? 'Boring Road'
          : (targetCity.toLowerCase() == 'gaya' ? 'Bodhgaya' : 'Local Area'));

  if (targetCity.toLowerCase() == 'patna') {
    return [
      // 1. Urgent Breaking Patna News
      Post(
        id: 'patna_breaking_1',
        type: PostType.news,
        category: PostCategory.traffic,
        author: const PostAuthor(
          id: 'auth_patna_traffic',
          name: 'Patna Traffic Police Desk',
          isVerified: true,
          badgeTitle: 'Official Agency',
          distanceKm: 0.7,
        ),
        title:
            '$targetArea Elevated Flyover Construction: Traffic Diversions in Effect',
        body:
            'Patna Traffic Police has notified temporary diversions near $targetArea roundabout and Boring Canal Road for elevated corridor girder installation. Commuters traveling toward Fraser Road are advised to take Bailey Road.',
        locality: targetArea,
        city: 'Patna',
        createdAt: DateTime.now().subtract(const Duration(minutes: 10)),
        isUrgent: true,
        likesCount: 168,
        commentsCount: 34,
        sharesCount: 92,
        comments: [
          Comment(
            id: 'pc1',
            author:
                const PostAuthor(id: 'pu1', name: 'Amitabh Verma', distanceKm: 0.5),
            text:
                'Traffic marshals are actively directing traffic near Sahdeo Mahto Marg.',
            createdAt: DateTime.now().subtract(const Duration(minutes: 4)),
            likesCount: 18,
          ),
        ],
      ),

      // 2. Video Report: Patna Metro
      Post(
        id: 'patna_video_1',
        type: PostType.video,
        category: PostCategory.utilities,
        author: const PostAuthor(
          id: 'auth_bihar_samachar',
          name: 'Bihar Samachar Express',
          isVerified: true,
          badgeTitle: 'Local Reporter',
          distanceKm: 1.8,
        ),
        title:
            'Ground Report: Patna Metro Underground Tunneling Progress Near Fraser Road',
        body:
            'Exclusive ground footage from the underground construction shaft near Patna Junction as the second tunnel boring machine achieves breakthrough on Metro Corridor 2.',
        locality: 'Fraser Road',
        city: 'Patna',
        createdAt: DateTime.now().subtract(const Duration(hours: 1)),
        videoDuration: '1:12',
        viewCount: 5410,
        likesCount: 420,
        commentsCount: 52,
        sharesCount: 135,
        mediaUrls: [
          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
        ],
      ),

      // 3. Infrastructure News: Smart Bus Shelters
      Post(
        id: 'patna_news_1',
        type: PostType.news,
        category: PostCategory.utilities,
        author: const PostAuthor(
          id: 'auth_patna_smart',
          name: 'Patna Smart City Mission',
          isVerified: true,
          badgeTitle: 'Verified Media',
          distanceKm: 2.3,
        ),
        title:
            'Solar Powered Smart Passenger Shelters Installed Across $targetArea',
        body:
            'PMC has inaugurated modern eco-friendly passenger shelters along $targetArea and Bailey Road equipped with real-time bus tracking digital screens and emergency SOS buttons.',
        locality: targetArea,
        city: 'Patna',
        createdAt: DateTime.now().subtract(const Duration(hours: 3)),
        likesCount: 245,
        commentsCount: 38,
        sharesCount: 71,
        mediaUrls: [
          'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
        ],
      ),

      // 4. Civic News: Pumping Stations
      Post(
        id: 'patna_news_2',
        type: PostType.news,
        category: PostCategory.utilities,
        author: const PostAuthor(
          id: 'auth_civic_patna',
          name: 'Civic Watch Patna',
          isVerified: true,
          badgeTitle: 'Verified Desk',
          distanceKm: 3.1,
        ),
        title:
            'Kankarbagh & Patna Sahib Drainage Sump Stations Upgraded by PMC',
        body:
            'Patna Municipal Corporation has commissioned high-capacity automated drainage pump stations in low-lying zones to ensure zero water stagnation during heavy rains.',
        locality: 'Kankarbagh',
        city: 'Patna',
        createdAt: DateTime.now().subtract(const Duration(hours: 6)),
        likesCount: 190,
        commentsCount: 19,
        sharesCount: 48,
        mediaUrls: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        ],
      ),

      // 5. Video Report: Ganga Marine Drive
      Post(
        id: 'patna_video_2',
        type: PostType.video,
        category: PostCategory.events,
        author: const PostAuthor(
          id: 'auth_patna_live',
          name: 'Patna City Live',
          isVerified: true,
          badgeTitle: 'Transit Reporter',
          distanceKm: 4.5,
        ),
        title:
            'Ganga Pathway Marine Drive Evening Cultural Walkway Reopens to Citizens',
        body:
            'Scenic riverfront promenade along the Ganga Pathway welcomes evening visitors with cultural performances, food kiosks, and newly illuminated pathways.',
        locality: 'Ganga Path',
        city: 'Patna',
        createdAt: DateTime.now().subtract(const Duration(days: 1)),
        videoDuration: '0:55',
        viewCount: 6890,
        likesCount: 480,
        commentsCount: 61,
        sharesCount: 154,
        mediaUrls: [
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
        ],
      ),
    ];
  }

  if (targetCity.toLowerCase() == 'gaya') {
    return [
      Post(
        id: 'gaya_breaking_1',
        type: PostType.news,
        category: PostCategory.events,
        author: const PostAuthor(
          id: 'auth_gaya_admin',
          name: 'Gaya District Administration',
          isVerified: true,
          badgeTitle: 'Official Agency',
          distanceKm: 1.2,
        ),
        title:
            'Bodhgaya International Heritage Mahotsav Preparations in Full Swing',
        body:
            'Delegates from over 30 countries are scheduled to arrive in $targetArea for the upcoming International Cultural Festival with special heritage walking corridors.',
        locality: targetArea,
        city: 'Gaya',
        createdAt: DateTime.now().subtract(const Duration(minutes: 25)),
        isUrgent: true,
        likesCount: 230,
        commentsCount: 41,
        sharesCount: 110,
      ),
      Post(
        id: 'gaya_video_1',
        type: PostType.video,
        category: PostCategory.utilities,
        author: const PostAuthor(
          id: 'auth_gaya_press',
          name: 'Magadh Samachar',
          isVerified: true,
          badgeTitle: 'Local Reporter',
          distanceKm: 2.5,
        ),
        title:
            'Falgu River Rubber Dam & Ghat Renovation Welcomes Devotees and Pilgrims',
        body:
            'Drone coverage of the historic Gayaji Dam on Falgu river ensuring round-the-year water availability and landscaped riverfront ghats.',
        locality: 'Vishnupad',
        city: 'Gaya',
        createdAt: DateTime.now().subtract(const Duration(hours: 2)),
        videoDuration: '1:05',
        viewCount: 4920,
        likesCount: 388,
        commentsCount: 45,
        sharesCount: 122,
        mediaUrls: [
          'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
        ],
      ),
      Post(
        id: 'gaya_news_1',
        type: PostType.news,
        category: PostCategory.utilities,
        author: const PostAuthor(
          id: 'auth_gaya_smart',
          name: 'Gaya Municipal Desk',
          isVerified: true,
          badgeTitle: 'Verified Media',
          distanceKm: 3.0,
        ),
        title:
            'Solar Micro-Grids and Heritage Streetlighting Commissioned Across $targetArea',
        body:
            'Urban development authority installs 500+ solar LED streetlamps and high-speed public Wi-Fi zones along principal tourist corridors in Bodhgaya.',
        locality: targetArea,
        city: 'Gaya',
        createdAt: DateTime.now().subtract(const Duration(hours: 5)),
        likesCount: 180,
        commentsCount: 23,
        sharesCount: 50,
      ),
    ];
  }

  if (targetCity.toLowerCase() == 'kolkata') {
    return List.of(kMockPosts);
  }

  // Generic dynamic generator for ANY other city/area
  return [
    Post(
      id: 'local_breaking_${targetCity.toLowerCase()}',
      type: PostType.news,
      category: PostCategory.traffic,
      author: PostAuthor(
        id: 'auth_${targetCity.toLowerCase()}',
        name: '$targetCity Civic Desk',
        isVerified: true,
        badgeTitle: 'Official Agency',
        distanceKm: 0.9,
      ),
      title:
          '$targetArea Infrastructure & Transit Upgrade Initiative Announced in $targetCity',
      body:
          'Municipal authorities in $targetCity have initiated arterial road resurfacing and smart junction traffic sensor installations across $targetArea.',
      locality: targetArea,
      city: targetCity,
      createdAt: DateTime.now().subtract(const Duration(minutes: 15)),
      isUrgent: true,
      likesCount: 135,
      commentsCount: 24,
      sharesCount: 65,
    ),
    Post(
      id: 'local_video_${targetCity.toLowerCase()}',
      type: PostType.video,
      category: PostCategory.utilities,
      author: PostAuthor(
        id: 'auth_${targetCity.toLowerCase()}_rep',
        name: '$targetCity Local Live',
        isVerified: true,
        badgeTitle: 'Local Reporter',
        distanceKm: 2.1,
      ),
      title:
          'Ground Video Report: Smart City Green Corridor Progress in $targetArea',
      body:
          'Watch the latest civic progress report as new pedestrian green zones and solar lighting systems are rolled out in $targetArea.',
      locality: targetArea,
      city: targetCity,
      createdAt: DateTime.now().subtract(const Duration(hours: 2)),
      videoDuration: '1:02',
      viewCount: 3800,
      likesCount: 290,
      commentsCount: 36,
      sharesCount: 88,
      mediaUrls: [
        'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
      ],
    ),
    Post(
      id: 'local_news_${targetCity.toLowerCase()}',
      type: PostType.news,
      category: PostCategory.utilities,
      author: PostAuthor(
        id: 'auth_${targetCity.toLowerCase()}_news',
        name: '$targetCity Community Voice',
        isVerified: true,
        badgeTitle: 'Verified Media',
        distanceKm: 3.4,
      ),
      title:
          'Solar Smart Bus Stops and Clean Energy Transit Deployed in $targetCity',
      body:
          'Public transport department inaugurates modern smart transit shelters with real-time tracking across $targetArea.',
      locality: targetArea,
      city: targetCity,
      createdAt: DateTime.now().subtract(const Duration(hours: 6)),
      likesCount: 210,
      commentsCount: 28,
      sharesCount: 52,
    ),
  ];
}
