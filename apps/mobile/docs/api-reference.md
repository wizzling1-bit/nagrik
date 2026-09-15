# Naagrik Public Content API Documentation

> **Live Staging Server Base URL:** `https://nagrik-1x9o.onrender.com/api/v1`  
> **Interactive Swagger UI:** https://nagrik-1x9o.onrender.com/api-docs  
> **Database Seed Endpoint:** `GET https://nagrik-1x9o.onrender.com/api/v1/seed`  
> **Device Identification:** Sent globally in headers as `x-device-id: <uuid>` and in body as `{ "deviceId": "<uuid>" }`. Completely credential-free.

---

User & Public Content (Flutter App - No Login)


GET
/content/feed
Get Location-Prioritized News & Short-Video Feed (No Login Required)


Returns approved, published content prioritized by location hierarchy (Area > City > State > Country) with dynamic advertisement interleaving. Completely credential-free.

Parameters
Try it out
Name	Description
city
string
(query)
Target City for hyperlocal news

Patna
area
string
(query)
Target Locality / Area

Kankarbagh
state
string
(query)
Bihar
country
string
(query)
India
contentType
string
(query)
Available values : ARTICLE, VIDEO


--
page
integer
(query)
Default value : 1

1
limit
integer
(query)
Default value : 20

20
Responses
Code	Description	Links
200	
Feed items with interleaved advertisements

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "items": [
    {
      "itemType": "CONTENT",
      "data": {
        "id": "d1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "_id": "d1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "creatorId": "cr_123",
        "type": "VIDEO",
        "title": "Patna Metro Construction Update Phase 2",
        "description": "Full report on the underground tunneling progress near Patna Junction.",
        "mediaUrl": "https://pub-r2.naagrik.news/media/videos/metro_update.mp4",
        "thumbnailUrl": "https://pub-r2.naagrik.news/media/thumbnails/metro_thumb.jpg",
        "categoryId": {
          "id": "c1b2c3d4-0000-0000-0000-000000000001",
          "_id": "c1b2c3d4-0000-0000-0000-000000000001",
          "name": "Politics",
          "slug": "politics",
          "displayOrder": 1,
          "status": "ACTIVE"
        },
        "location": {
          "country": "India",
          "state": "Bihar",
          "city": "Patna",
          "area": "Kankarbagh",
          "coordinates": {
            "latitude": 25.5941,
            "longitude": 85.1376
          }
        },
        "moderationStatus": "APPROVED",
        "views": 1250,
        "eligibleViews": 840,
        "likes": 310,
        "shares": 45,
        "saves": 82,
        "publishedAt": "2026-09-04T07:27:32.662Z",
        "createdAt": "2026-09-04T07:27:32.662Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 45,
    "totalPages": 3
  }
}
No links

GET
/content/search
Search Content by Keywords, Category, or City


Parameters
Try it out
Name	Description
q
string
(query)
Search keywords

Patna Metro
categoryId
string
(query)
categoryId
city
string
(query)
Patna
type
string
(query)
Available values : ARTICLE, VIDEO


--
Responses
Code	Description	Links
200	
Matching search results

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "contents": [
    {
      "id": "d1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "_id": "d1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "creatorId": "cr_123",
      "type": "VIDEO",
      "title": "Patna Metro Construction Update Phase 2",
      "description": "Full report on the underground tunneling progress near Patna Junction.",
      "mediaUrl": "https://pub-r2.naagrik.news/media/videos/metro_update.mp4",
      "thumbnailUrl": "https://pub-r2.naagrik.news/media/thumbnails/metro_thumb.jpg",
      "categoryId": {
        "id": "c1b2c3d4-0000-0000-0000-000000000001",
        "_id": "c1b2c3d4-0000-0000-0000-000000000001",
        "name": "Politics",
        "slug": "politics",
        "displayOrder": 1,
        "status": "ACTIVE"
      },
      "location": {
        "country": "India",
        "state": "Bihar",
        "city": "Patna",
        "area": "Kankarbagh",
        "coordinates": {
          "latitude": 25.5941,
          "longitude": 85.1376
        }
      },
      "moderationStatus": "APPROVED",
      "views": 1250,
      "eligibleViews": 840,
      "likes": 310,
      "shares": 45,
      "saves": 82,
      "publishedAt": "2026-09-04T07:27:32.669Z",
      "createdAt": "2026-09-04T07:27:32.669Z"
    }
  ]
}
No links

GET
/content/categories
Get All Available News Categories


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
List of active categories

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "categories": [
    {
      "id": "c1b2c3d4-0000-0000-0000-000000000001",
      "_id": "c1b2c3d4-0000-0000-0000-000000000001",
      "name": "Politics",
      "slug": "politics",
      "displayOrder": 1,
      "status": "ACTIVE"
    }
  ]
}
No links

GET
/content/locations
Get Supported Cities & Localities for Location Picker


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
List of supported cities and areas

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "locations": [
    {
      "country": "India",
      "state": "Bihar",
      "city": "Patna",
      "area": "Kankarbagh",
      "coordinates": {
        "latitude": 25.5941,
        "longitude": 85.1376
      }
    }
  ]
}
No links

GET
/content/{id}
Get Single Content / Video Details


Parameters
Try it out
Name	Description
id *
string
(path)
id
Responses
Code	Description	Links
200	
Content details

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "content": {
    "id": "d1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "_id": "d1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "creatorId": "cr_123",
    "type": "VIDEO",
    "title": "Patna Metro Construction Update Phase 2",
    "description": "Full report on the underground tunneling progress near Patna Junction.",
    "mediaUrl": "https://pub-r2.naagrik.news/media/videos/metro_update.mp4",
    "thumbnailUrl": "https://pub-r2.naagrik.news/media/thumbnails/metro_thumb.jpg",
    "categoryId": {
      "id": "c1b2c3d4-0000-0000-0000-000000000001",
      "_id": "c1b2c3d4-0000-0000-0000-000000000001",
      "name": "Politics",
      "slug": "politics",
      "displayOrder": 1,
      "status": "ACTIVE"
    },
    "location": {
      "country": "India",
      "state": "Bihar",
      "city": "Patna",
      "area": "Kankarbagh",
      "coordinates": {
        "latitude": 25.5941,
        "longitude": 85.1376
      }
    },
    "moderationStatus": "APPROVED",
    "views": 1250,
    "eligibleViews": 840,
    "likes": 310,
    "shares": 45,
    "saves": 82,
    "publishedAt": "2026-09-04T07:27:32.674Z",
    "createdAt": "2026-09-04T07:27:32.674Z"
  }
}
No links

POST
/content/{id}/like
Toggle Like on Article / Video (No Login Required)


Parameters
Try it out
Name	Description
id *
string
(path)
id
Responses
Code	Description	Links
200	
Like status updated

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "isLiked": true,
  "likes": 311
}
No links

POST
/content/{id}/save
Toggle Save / Bookmark on Content (No Login Required)


Parameters
Try it out
Name	Description
id *
string
(path)
id
Responses
Code	Description	Links
200	
Bookmark status toggled

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "isSaved": true
}
No links

POST
/content/{id}/report
Report Inappropriate Content (No Login Required)


Parameters
Try it out
Name	Description
id *
string
(path)
id
Request body

application/json
Example Value
Schema
{
  "reason": "Misleading information or hate speech",
  "deviceId": "flutter-device-123"
}
Responses
Code	Description	Links
200	
Report submitted for editorial review

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Report submitted for review."
}
No links

POST
/views
Register Video View (3-View Ceiling Monetization Rule - No Login Required)


Enforces strict anti-gaming rule:

Maximum 3 monetized views per device/user per video.
Subsequent views increment raw view count but are not counted for creator payouts.
Pass deviceId or videoId directly without any login credentials!
Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "videoId": "d1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "deviceId": "flutter-device-uuid-123"
}
Responses
Code	Description	Links
200	
View registered and validated

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "isEligibleView": true,
  "currentCountedViews": 2,
  "totalViews": 1251,
  "eligibleViews": 841
}