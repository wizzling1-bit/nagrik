export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Naagrik Hyperlocal Platform - Unified API Documentation',
    version: '1.0.0',
    description: `
# Naagrik Hyperlocal Platform API Documentation

Welcome to the backend API specification for **Naagrik**, a location-based local news and short-video monetization platform.

## 📱 For Flutter / Mobile App Developers:
- **No Login / No Signup for Users**: End users do **NOT** have any registration or login accounts. All user-facing features work 100% credential-free.
- **Location Feeds**: Call \`GET /api/v1/content/feed\` passing \`city\` and \`area\` to receive a prioritized hyperlocal feed with interleaved advertisements.
- **Monetized Video Views**: Call \`POST /api/v1/views\` with \`videoId\` and \`deviceId\` to track views. The backend automatically handles view ceilings (max 3 counted views per user/device per video) and creator earnings without any login required.
- **Search & Discovery**: \`GET /api/v1/content/search\`, \`GET /api/v1/content/categories\`, \`GET /api/v1/content/locations\`.
- **Likes, Saves, & Reports**: \`POST /api/v1/content/:id/like\`, \`POST /api/v1/content/:id/save\`, \`POST /api/v1/content/:id/report\`.

## 🎬 For Creator & Admin Portals:
- **Creator Studio**: Register or log in via \`POST /api/v1/auth/login\` / \`POST /api/v1/auth/register\`, generate Cloudflare R2 presigned upload URLs with \`POST /api/v1/content/upload-url\`, submit content for admin moderation, track earnings, and request payouts ($10.00 minimum).
- **Admin Portal**: Review moderation queues (\`POST /api/v1/admin/moderation/review\`), process creator payouts with transaction UTRs (\`POST /api/v1/admin/payouts/process\`), manage advertisements, and inspect system audit logs.
    `,
    contact: {
      name: 'Naagrik Engineering Team',
      email: 'dev@naagrik.news'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local Development Server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token for Creators and Admins obtained from /auth/login or /auth/register'
      },
      DeviceIdHeader: {
        type: 'apiKey',
        in: 'header',
        name: 'x-device-id',
        description: 'Anonymous device UUID from Flutter mobile app (No login credentials needed)'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Error message description' }
        }
      },
      LocationData: {
        type: 'object',
        properties: {
          country: { type: 'string', example: 'India' },
          state: { type: 'string', example: 'Bihar' },
          city: { type: 'string', example: 'Patna' },
          area: { type: 'string', example: 'Kankarbagh' },
          coordinates: {
            type: 'object',
            properties: {
              latitude: { type: 'number', example: 25.5941 },
              longitude: { type: 'number', example: 85.1376 }
            }
          }
        },
        required: ['state', 'city', 'area']
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          _id: { type: 'string', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          name: { type: 'string', example: 'Rahul Kumar' },
          email: { type: 'string', format: 'email', example: 'creator@naagrik.news' },
          role: { type: 'string', enum: ['CREATOR', 'ADMIN'], example: 'CREATOR' },
          phone: { type: 'string', example: '+919876543210' },
          profileImage: { type: 'string', example: 'https://pub-r2.naagrik.news/media/profiles/avatar.png' },
          location: { $ref: '#/components/schemas/LocationData' },
          status: { type: 'string', enum: ['ACTIVE', 'SUSPENDED'], example: 'ACTIVE' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'c1b2c3d4-0000-0000-0000-000000000001' },
          _id: { type: 'string', example: 'c1b2c3d4-0000-0000-0000-000000000001' },
          name: { type: 'string', example: 'Politics' },
          slug: { type: 'string', example: 'politics' },
          displayOrder: { type: 'integer', example: 1 },
          status: { type: 'string', example: 'ACTIVE' }
        }
      },
      Content: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'd1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          _id: { type: 'string', example: 'd1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          creatorId: { type: 'string', example: 'cr_123' },
          type: { type: 'string', enum: ['ARTICLE', 'VIDEO'], example: 'VIDEO' },
          title: { type: 'string', example: 'Patna Metro Construction Update Phase 2' },
          description: { type: 'string', example: 'Full report on the underground tunneling progress near Patna Junction.' },
          mediaUrl: { type: 'string', example: 'https://pub-r2.naagrik.news/media/videos/metro_update.mp4' },
          thumbnailUrl: { type: 'string', example: 'https://pub-r2.naagrik.news/media/thumbnails/metro_thumb.jpg' },
          categoryId: { $ref: '#/components/schemas/Category' },
          location: { $ref: '#/components/schemas/LocationData' },
          moderationStatus: { type: 'string', enum: ['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'FLAGGED', 'PUBLISHED'], example: 'APPROVED' },
          views: { type: 'integer', example: 1250 },
          eligibleViews: { type: 'integer', example: 840 },
          likes: { type: 'integer', example: 310 },
          shares: { type: 'integer', example: 45 },
          saves: { type: 'integer', example: 82 },
          publishedAt: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Advertisement: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'ad_123' },
          name: { type: 'string', example: 'Local City Store Special Offer' },
          type: { type: 'string', enum: ['BANNER', 'VIDEO', 'SPONSORED'], example: 'BANNER' },
          mediaUrl: { type: 'string', example: 'https://pub-r2.naagrik.news/media/ads/banner.jpg' },
          frequency: { type: 'integer', example: 4 },
          status: { type: 'string', example: 'ACTIVE' }
        }
      },
      FeedItem: {
        type: 'object',
        properties: {
          itemType: { type: 'string', enum: ['CONTENT', 'ADVERTISEMENT'], example: 'CONTENT' },
          data: {
            oneOf: [
              { $ref: '#/components/schemas/Content' },
              { $ref: '#/components/schemas/Advertisement' }
            ]
          }
        }
      }
    }
  },
  paths: {
    // ==========================================
    // USER & PUBLIC CONTENT APIs (FLUTTER APP - NO AUTH/LOGIN REQUIRED)
    // ==========================================
    '/content/feed': {
      get: {
        tags: ['User & Public Content (Flutter App - No Login)'],
        summary: 'Get Location-Prioritized News & Short-Video Feed (No Login Required)',
        description: 'Returns approved, published content prioritized by location hierarchy (Area > City > State > Country) with dynamic advertisement interleaving. Completely credential-free.',
        parameters: [
          { name: 'city', in: 'query', schema: { type: 'string', example: 'Patna' }, description: 'Target City for hyperlocal news' },
          { name: 'area', in: 'query', schema: { type: 'string', example: 'Kankarbagh' }, description: 'Target Locality / Area' },
          { name: 'state', in: 'query', schema: { type: 'string', example: 'Bihar' } },
          { name: 'country', in: 'query', schema: { type: 'string', example: 'India' } },
          { name: 'contentType', in: 'query', schema: { type: 'string', enum: ['ARTICLE', 'VIDEO'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } }
        ],
        responses: {
          200: {
            description: 'Feed items with interleaved advertisements',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    items: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/FeedItem' }
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 20 },
                        totalItems: { type: 'integer', example: 45 },
                        totalPages: { type: 'integer', example: 3 }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/content/search': {
      get: {
        tags: ['User & Public Content (Flutter App - No Login)'],
        summary: 'Search Content by Keywords, Category, or City',
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string', example: 'Patna Metro' }, description: 'Search keywords' },
          { name: 'categoryId', in: 'query', schema: { type: 'string' } },
          { name: 'city', in: 'query', schema: { type: 'string', example: 'Patna' } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['ARTICLE', 'VIDEO'] } }
        ],
        responses: {
          200: {
            description: 'Matching search results',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    contents: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Content' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/content/categories': {
      get: {
        tags: ['User & Public Content (Flutter App - No Login)'],
        summary: 'Get All Available News Categories',
        responses: {
          200: {
            description: 'List of active categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    categories: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Category' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/content/locations': {
      get: {
        tags: ['User & Public Content (Flutter App - No Login)'],
        summary: 'Get Supported Cities & Localities for Location Picker',
        responses: {
          200: {
            description: 'List of supported cities and areas',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    locations: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/LocationData' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/content/{id}': {
      get: {
        tags: ['User & Public Content (Flutter App - No Login)'],
        summary: 'Get Single Content / Video Details',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Content details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    content: { $ref: '#/components/schemas/Content' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/content/{id}/like': {
      post: {
        tags: ['User & Public Content (Flutter App - No Login)'],
        summary: 'Toggle Like on Article / Video (No Login Required)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Like status updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    isLiked: { type: 'boolean', example: true },
                    likes: { type: 'integer', example: 311 }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/content/{id}/save': {
      post: {
        tags: ['User & Public Content (Flutter App - No Login)'],
        summary: 'Toggle Save / Bookmark on Content (No Login Required)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Bookmark status toggled',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    isSaved: { type: 'boolean', example: true }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/content/{id}/report': {
      post: {
        tags: ['User & Public Content (Flutter App - No Login)'],
        summary: 'Report Inappropriate Content (No Login Required)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['reason'],
                properties: {
                  reason: { type: 'string', example: 'Misleading information or hate speech' },
                  deviceId: { type: 'string', example: 'flutter-device-123' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Report submitted for editorial review',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Report submitted for review.' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/views': {
      post: {
        tags: ['User & Public Content (Flutter App - No Login)'],
        summary: 'Register Video View (3-View Ceiling Monetization Rule - No Login Required)',
        description: `
Enforces strict anti-gaming rule:
- Maximum 3 monetized views per device/user per video.
- Subsequent views increment raw view count but are not counted for creator payouts.
- Pass **deviceId** or **videoId** directly without any login credentials!
        `,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['videoId'],
                properties: {
                  videoId: { type: 'string', format: 'uuid', example: 'd1b2c3d4-e5f6-7890-abcd-ef1234567890' },
                  deviceId: { type: 'string', example: 'flutter-device-uuid-123' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'View registered and validated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    isEligibleView: { type: 'boolean', example: true, description: 'True if within the 3-view ceiling rule' },
                    currentCountedViews: { type: 'integer', example: 2 },
                    totalViews: { type: 'integer', example: 1251 },
                    eligibleViews: { type: 'integer', example: 841 }
                  }
                }
              }
            }
          }
        }
      }
    },

    // ==========================================
    // CREATOR & ADMIN AUTHENTICATION
    // ==========================================
    '/auth/register': {
      post: {
        tags: ['Creator & Admin Authentication'],
        summary: 'Register Creator profile',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Rahul Kumar' },
                  email: { type: 'string', format: 'email', example: 'creator@naagrik.news' },
                  password: { type: 'string', minLength: 6, example: 'CreatorPass123!' },
                  role: { type: 'string', enum: ['CREATOR', 'ADMIN'], default: 'CREATOR' },
                  phone: { type: 'string', example: '+919876543210' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    token: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Creator & Admin Authentication'],
        summary: 'Sign In to Creator Studio or Admin Portal',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'creator1@naagrik.news' },
                  password: { type: 'string', example: 'CreatorPass123!' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    token: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/me': {
      get: {
        tags: ['Creator & Admin Authentication'],
        summary: 'Get Authenticated Creator / Admin Profile Details',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Current user profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          }
        }
      }
    },

    // ==========================================
    // CREATOR STUDIO APIs
    // ==========================================
    '/creator/dashboard': {
      get: {
        tags: ['Creator Portal'],
        summary: 'Get Creator Dashboard Statistics & Balances',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Creator statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    stats: {
                      type: 'object',
                      properties: {
                        totalContent: { type: 'integer', example: 12 },
                        publishedContent: { type: 'integer', example: 10 },
                        pendingContent: { type: 'integer', example: 1 },
                        rejectedContent: { type: 'integer', example: 1 },
                        totalEligibleViews: { type: 'integer', example: 15400 },
                        availableBalance: { type: 'number', example: 23.10 },
                        lifetimeEarnings: { type: 'number', example: 45.00 },
                        pendingPayoutAmount: { type: 'number', example: 10.00 },
                        totalPaid: { type: 'number', example: 20.00 }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/creator/content': {
      get: {
        tags: ['Creator Portal'],
        summary: 'Get List of Content Published by Logged-in Creator',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of creator content',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    contents: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Content' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/content/upload-url': {
      post: {
        tags: ['Creator Portal'],
        summary: 'Generate Cloudflare R2 Presigned Direct Upload URL',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['folder', 'mimeType', 'fileExtension'],
                properties: {
                  folder: { type: 'string', enum: ['videos', 'images', 'thumbnails'], example: 'videos' },
                  mimeType: { type: 'string', example: 'video/mp4' },
                  fileExtension: { type: 'string', example: 'mp4' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Presigned upload URL and public media URL',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    uploadUrl: { type: 'string', example: 'https://naagrik-media.r2.cloudflarestorage.com/...' },
                    mediaUrl: { type: 'string', example: 'https://pub-r2.naagrik.news/media/videos/abc123.mp4' },
                    key: { type: 'string', example: 'media/videos/abc123.mp4' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/content': {
      post: {
        tags: ['Creator Portal'],
        summary: 'Submit Content for Automated Scan & Admin Editorial Review',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['type', 'title', 'description', 'mediaUrl', 'thumbnailUrl', 'categoryId', 'location'],
                properties: {
                  type: { type: 'string', enum: ['ARTICLE', 'VIDEO'], example: 'VIDEO' },
                  title: { type: 'string', example: 'Boring Road Flyover Construction Updates' },
                  description: { type: 'string', example: 'Detailed coverage of the newly opened flyover wing.' },
                  mediaUrl: { type: 'string', example: 'https://pub-r2.naagrik.news/media/videos/flyover.mp4' },
                  thumbnailUrl: { type: 'string', example: 'https://pub-r2.naagrik.news/media/thumbnails/flyover.jpg' },
                  categoryId: { type: 'string', example: 'local' },
                  location: { $ref: '#/components/schemas/LocationData' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Content created and submitted for review',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    content: { $ref: '#/components/schemas/Content' },
                    moderationMessage: { type: 'string', example: 'Content submitted successfully and pending admin approval.' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/creator/analytics': {
      get: {
        tags: ['Creator Portal'],
        summary: 'Get Comprehensive Monetization & View Analytics',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Analytics summary',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    analytics: {
                      type: 'object',
                      properties: {
                        totalContentCount: { type: 'integer', example: 12 },
                        totalViews: { type: 'integer', example: 18500 },
                        totalEligibleViews: { type: 'integer', example: 15400 },
                        nonEligibleViews: { type: 'integer', example: 3100 },
                        totalLikes: { type: 'integer', example: 1200 },
                        totalShares: { type: 'integer', example: 340 },
                        totalSaves: { type: 'integer', example: 210 }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/creator/payout-methods': {
      get: {
        tags: ['Creator Portal'],
        summary: 'Get Creator Saved Payout Methods (Bank / UPI)',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of payout methods',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    methods: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Creator Portal'],
        summary: 'Add / Save New Payout Method (Bank or UPI)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['type'],
                properties: {
                  type: { type: 'string', enum: ['BANK', 'UPI'], example: 'UPI' },
                  upiId: { type: 'string', example: 'creator@upi' },
                  bankDetails: {
                    type: 'object',
                    properties: {
                      accountHolderName: { type: 'string', example: 'Rahul Kumar' },
                      accountNumber: { type: 'string', example: '987654321098' },
                      ifsc: { type: 'string', example: 'SBIN0001234' },
                      bankName: { type: 'string', example: 'State Bank of India' }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Payout method added',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    method: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/creator/request-payout': {
      post: {
        tags: ['Creator Portal'],
        summary: 'Request Creator Earnings Payout ($10.00 Minimum)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['amount', 'payoutMethodId'],
                properties: {
                  amount: { type: 'number', minimum: 10.00, example: 15.00 },
                  payoutMethodId: { type: 'string', example: 'pm_123' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Payout request submitted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Payout request submitted successfully. Target processing time within 24 hours.' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/creator/payout-history': {
      get: {
        tags: ['Creator Portal'],
        summary: 'Get Payout Request History & Payment Status',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of previous payout requests',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    requests: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          }
        }
      }
    },

    // ==========================================
    // ADMIN EDITORIAL & OPERATIONS APIs
    // ==========================================
    '/admin/dashboard': {
      get: {
        tags: ['Admin Editorial & Operations'],
        summary: 'Get Platform High-Density Metrics & Overview',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Admin platform metrics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    metrics: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/admin/moderation/queue': {
      get: {
        tags: ['Admin Editorial & Operations'],
        summary: 'Get Editorial Moderation Queue',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', default: 'PENDING_REVIEW' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } }
        ],
        responses: {
          200: {
            description: 'Moderation queue items',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    items: { type: 'array', items: { $ref: '#/components/schemas/Content' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/admin/moderation/review': {
      post: {
        tags: ['Admin Editorial & Operations'],
        summary: 'Approve, Reject, or Flag Submitted Content',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['contentId', 'status'],
                properties: {
                  contentId: { type: 'string', example: 'd1b2c3d4-...' },
                  status: { type: 'string', enum: ['APPROVED', 'REJECTED', 'FLAGGED'], example: 'APPROVED' },
                  rejectionReason: { type: 'string', example: 'Does not adhere to editorial standards' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Content reviewed and updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Content status updated to APPROVED' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/admin/payouts': {
      get: {
        tags: ['Admin Editorial & Operations'],
        summary: 'Get Creator Payout Processing Queue',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'PROCESSING', 'PAID', 'REJECTED'] } }
        ],
        responses: {
          200: {
            description: 'List of payout requests',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    requests: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/admin/payouts/process': {
      post: {
        tags: ['Admin Editorial & Operations'],
        summary: 'Process Payout (Mark PAID with Bank UTR Reference)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['requestId', 'status'],
                properties: {
                  requestId: { type: 'string', example: 'req_123' },
                  status: { type: 'string', enum: ['PAID', 'REJECTED', 'PROCESSING'], example: 'PAID' },
                  transactionReference: { type: 'string', example: 'UTR_BANK_2026_0901_8849' },
                  adminNote: { type: 'string', example: 'Processed via IMPS transfer' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Payout processed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Payout request updated to PAID' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/admin/ads': {
      get: {
        tags: ['Admin Editorial & Operations'],
        summary: 'List All Advertisements',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of advertisements',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    ads: { type: 'array', items: { $ref: '#/components/schemas/Advertisement' } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Admin Editorial & Operations'],
        summary: 'Create New Advertisement Campaign',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'type', 'mediaUrl'],
                properties: {
                  name: { type: 'string', example: 'Patna Grand Mega Sale' },
                  type: { type: 'string', enum: ['BANNER', 'VIDEO', 'SPONSORED'], example: 'BANNER' },
                  mediaUrl: { type: 'string', example: 'https://pub-r2.naagrik.news/media/ads/sale.jpg' },
                  frequency: { type: 'integer', default: 4, example: 4 },
                  status: { type: 'string', enum: ['ACTIVE', 'PAUSED'], default: 'ACTIVE' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Advertisement created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    ad: { $ref: '#/components/schemas/Advertisement' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/admin/settings': {
      get: {
        tags: ['Admin Editorial & Operations'],
        summary: 'Get Platform System Settings ($10 min payout, rate/1000 views, ad frequency)',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'System settings',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    settings: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Admin Editorial & Operations'],
        summary: 'Update Platform Monetization & Ad Insertion Settings',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  minPayoutAmount: { type: 'number', example: 10.00 },
                  earningRatePer1000Views: { type: 'number', example: 1.50 },
                  maxCountedViewsPerVideo: { type: 'integer', example: 3 },
                  adFeedFrequency: { type: 'integer', example: 4 }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Settings updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'System settings updated successfully.' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/admin/audit-logs': {
      get: {
        tags: ['Admin Editorial & Operations'],
        summary: 'Inspect Recent System Audit Logs',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of audit logs',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    logs: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/admin/categories': {
      get: {
        tags: ['Admin Editorial & Operations'],
        summary: 'List Categories for Editorial Management',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    categories: { type: 'array', items: { $ref: '#/components/schemas/Category' } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Admin Editorial & Operations'],
        summary: 'Create New Content Category',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Science & Tech' },
                  slug: { type: 'string', example: 'tech' },
                  displayOrder: { type: 'integer', example: 7 }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Category created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    category: { $ref: '#/components/schemas/Category' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
