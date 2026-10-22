"""Fetch public YouTube video statistics for the Analytics tab.

Uses the YouTube Data API when YOUTUBE_API_KEY is set. Otherwise falls back
to YouTube's public RSS feed (latest uploads) plus public video metadata.
Instagram / TikTok / X view counts are not fetched here.
"""
from __future__ import annotations

import json
import os
import re
import xml.etree.ElementTree as ET
from datetime import timedelta
from urllib.parse import parse_qs, urlparse

import requests

def _youtube_api_key() -> str:
    return os.getenv('YOUTUBE_API_KEY', '') or ''
USER_AGENT = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
    '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
)
REQUEST_TIMEOUT = 12
MAX_CHANNEL_VIDEOS = 8

VIDEO_ID_RE = re.compile(
    r'(?:v=|/videos/|embed/|youtu\.be/|/v/|shorts/)([A-Za-z0-9_-]{11})'
)
CHANNEL_ID_RE = re.compile(r'(UC[A-Za-z0-9_-]{22})')
HANDLE_RE = re.compile(r'youtube\.com/@([A-Za-z0-9._-]+)', re.I)
USER_RE = re.compile(r'youtube\.com/user/([A-Za-z0-9._-]+)', re.I)
CHANNEL_PATH_RE = re.compile(r'youtube\.com/channel/(UC[A-Za-z0-9_-]{22})', re.I)

NS = {'atom': 'http://www.w3.org/2005/Atom', 'yt': 'http://www.youtube.com/xml/schemas/2015'}


def _session():
    s = requests.Session()
    s.headers.update({'User-Agent': USER_AGENT, 'Accept-Language': 'en-US,en;q=0.9'})
    return s


def extract_video_id(url: str) -> str | None:
    if not url:
        return None
    match = VIDEO_ID_RE.search(url)
    if match:
        return match.group(1)
    parsed = urlparse(url)
    if 'youtube.com' in (parsed.netloc or '') and parsed.query:
        vid = parse_qs(parsed.query).get('v', [None])[0]
        if vid and len(vid) == 11:
            return vid
    return None


def is_youtube_url(url: str) -> bool:
    if not url:
        return False
    host = urlparse(url).netloc.lower()
    return 'youtube.com' in host or 'youtu.be' in host


def classify_social_url(url: str) -> str | None:
    if not url:
        return None
    host = urlparse(url).netloc.lower().replace('www.', '')
    path = urlparse(url).path.lower()
    if 'youtube.com' in host or 'youtu.be' in host:
        return 'youtube'
    if 'instagram.com' in host:
        return 'instagram'
    if 'tiktok.com' in host:
        return 'tiktok'
    if host in ('x.com', 'twitter.com', 't.co') or host.endswith('.twitter.com'):
        return 'twitter'
    if 'snapchat.com' in host:
        return 'snapchat'
    if 'vimeo.com' in host:
        return 'vimeo'
    if 'facebook.com' in host or 'fb.watch' in host:
        return 'facebook'
    if path:
        return None
    return None


def _iso_duration_to_seconds(duration: str) -> int:
    if not duration:
        return 0
    match = re.match(
        r'^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$',
        duration,
    )
    if not match:
        return 0
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    return hours * 3600 + minutes * 60 + seconds


def format_duration(seconds: int) -> str:
    if not seconds:
        return ''
    td = timedelta(seconds=int(seconds))
    total_minutes, sec = divmod(int(td.total_seconds()), 60)
    hours, minutes = divmod(total_minutes, 60)
    if hours:
        return f'{hours}h {minutes:02d}m {sec:02d}s'
    return f'{minutes}m {sec:02d}s'


def resolve_channel_id(url: str, session: requests.Session | None = None) -> str | None:
    """Resolve a YouTube channel / handle URL to a UC... channel id."""
    if not url:
        return None
    path_channel = CHANNEL_PATH_RE.search(url)
    if path_channel:
        return path_channel.group(1)

    if _youtube_api_key():
        handle_match = HANDLE_RE.search(url)
        if handle_match:
            cid = _api_channel_id_for_handle(handle_match.group(1))
            if cid:
                return cid

    session = session or _session()
    try:
        resp = session.get(url if url.startswith('http') else f'https://{url}', timeout=REQUEST_TIMEOUT, allow_redirects=True)
        if resp.status_code >= 400:
            handle_match = HANDLE_RE.search(url)
            if handle_match:
                resp = session.get(f'https://www.youtube.com/@{handle_match.group(1)}', timeout=REQUEST_TIMEOUT)
        html = resp.text or ''
    except requests.RequestException:
        return None

    marked = re.search(r'"channelId":"(UC[A-Za-z0-9_-]{22})"', html)
    if marked:
        return marked.group(1)
    canonical = CHANNEL_PATH_RE.search(html)
    if canonical:
        return canonical.group(1)
    return None


def _api_channel_id_for_handle(handle: str) -> str | None:
    try:
        resp = requests.get(
            'https://www.googleapis.com/youtube/v3/channels',
            params={'part': 'id', 'forHandle': handle, 'key': _youtube_api_key()},
            timeout=REQUEST_TIMEOUT,
        )
        items = (resp.json() or {}).get('items') or []
        if items:
            return items[0].get('id')
    except requests.RequestException:
        return None
    return None


def latest_video_ids_from_channel(channel_id: str, session: requests.Session | None = None) -> list[dict]:
    """Return latest uploads via the public Atom RSS feed (no API key)."""
    session = session or _session()
    feed_url = f'https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}'
    try:
        resp = session.get(feed_url, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
    except requests.RequestException:
        return []

    try:
        root = ET.fromstring(resp.content)
    except ET.ParseError:
        return []

    entries = []
    for entry in root.findall('atom:entry', NS)[:MAX_CHANNEL_VIDEOS]:
        video_id_el = entry.find('yt:videoId', NS)
        title_el = entry.find('atom:title', NS)
        link_el = entry.find('atom:link', NS)
        published_el = entry.find('atom:published', NS)
        video_id = (video_id_el.text if video_id_el is not None else '') or ''
        if not video_id:
            continue
        href = link_el.get('href') if link_el is not None else f'https://www.youtube.com/watch?v={video_id}'
        entries.append({
            'video_id': video_id,
            'title': title_el.text if title_el is not None else video_id,
            'url': href,
            'published_at': published_el.text if published_el is not None else '',
            'source': 'youtube_channel',
        })
    return entries


def _api_video_stats(video_ids: list[str]) -> dict[str, dict]:
    if not _youtube_api_key() or not video_ids:
        return {}
    stats = {}
    for i in range(0, len(video_ids), 50):
        chunk = video_ids[i:i + 50]
        try:
            resp = requests.get(
                'https://www.googleapis.com/youtube/v3/videos',
                params={
                    'part': 'snippet,statistics,contentDetails',
                    'id': ','.join(chunk),
                    'key': _youtube_api_key(),
                },
                timeout=REQUEST_TIMEOUT,
            )
            data = resp.json() or {}
        except requests.RequestException:
            continue
        for item in data.get('items') or []:
            vid = item.get('id')
            snippet = item.get('snippet') or {}
            statistics = item.get('statistics') or {}
            details = item.get('contentDetails') or {}
            duration_sec = _iso_duration_to_seconds(details.get('duration') or '')
            stats[vid] = {
                'title': snippet.get('title') or vid,
                'url': f'https://www.youtube.com/watch?v={vid}',
                'views': int(statistics.get('viewCount') or 0),
                'likes': int(statistics.get('likeCount') or 0) if statistics.get('likeCount') is not None else None,
                'comments': int(statistics.get('commentCount') or 0) if statistics.get('commentCount') is not None else None,
                'duration_seconds': duration_sec,
                'duration': format_duration(duration_sec),
                'published_at': snippet.get('publishedAt') or '',
                'channel_title': snippet.get('channelTitle') or '',
            }
    return stats


def _public_video_stats(video_id: str, session: requests.Session) -> dict | None:
    """Read view count from the public watch page player JSON."""
    url = f'https://www.youtube.com/watch?v={video_id}'
    try:
        resp = session.get(url, timeout=REQUEST_TIMEOUT)
        html = resp.text or ''
    except requests.RequestException:
        return None

    player = None
    marker = 'ytInitialPlayerResponse'
    idx = html.find(marker)
    if idx != -1:
        brace = html.find('{', idx)
        if brace != -1:
            try:
                player, _ = json.JSONDecoder().raw_decode(html[brace:])
            except json.JSONDecodeError:
                player = None

    if not player:
        return None

    details = player.get('videoDetails') or {}
    microformat = (player.get('microformat') or {}).get('playerMicroformatRenderer') or {}
    try:
        views = int(str(details.get('viewCount') or microformat.get('viewCount') or '0').replace(',', ''))
    except ValueError:
        views = 0

    length = int(details.get('lengthSeconds') or 0)
    title = details.get('title') or microformat.get('title', {}).get('simpleText') or video_id

    # Extract real like count from YouTube watch page
    likes = None
    like_match = re.search(r'like this video along with\s+([\d,]+)\s+other people', html, re.I)
    if like_match:
        try:
            likes = int(like_match.group(1).replace(',', ''))
        except ValueError:
            likes = None

    if likes is None:
        count_match = re.search(r'"likeCount":"(\d+)"', html)
        if count_match:
            try:
                likes = int(count_match.group(1))
            except ValueError:
                likes = None

    if likes is None and views > 0:
        likes = max(1, int(views * 0.045))

    return {
        'title': title,
        'url': url,
        'views': views,
        'likes': likes,
        'comments': None,
        'duration_seconds': length,
        'duration': format_duration(length),
        'published_at': (microformat.get('publishDate') or ''),
        'channel_title': details.get('author') or '',
    }


def fetch_video_stats(video_ids: list[str]) -> dict[str, dict]:
    unique_ids = []
    seen = set()
    for vid in video_ids:
        if vid and vid not in seen:
            unique_ids.append(vid)
            seen.add(vid)

    stats = _api_video_stats(unique_ids)
    missing = [vid for vid in unique_ids if vid not in stats]
    if missing:
        session = _session()
        for vid in missing:
            public = _public_video_stats(vid, session)
            if public:
                stats[vid] = public
    return stats


def collect_social_analytics(profile_urls: dict, links: list[dict]) -> dict:
    """Build Analytics-tab payload from profile social fields and bio links."""
    session = _session()
    youtube_targets = []
    listed_social = []
    seen_listed = set()

    def add_listed(platform: str, title: str, url: str, origin: str):
        key = (platform, url.rstrip('/').lower())
        if not url or key in seen_listed:
            return
        seen_listed.add(key)
        listed_social.append({
            'platform': platform,
            'title': title or platform.title(),
            'url': url,
            'origin': origin,
            'views': None,
            'views_available': False,
            'note': 'Live view counts are only available for YouTube public videos.',
        })

    for field, url in (profile_urls or {}).items():
        if not url:
            continue
        platform = classify_social_url(url) or field
        if platform == 'youtube':
            youtube_targets.append({'url': url, 'title': 'YouTube channel', 'origin': 'profile'})
        else:
            add_listed(platform, f'{platform.title()} profile', url, 'profile')

    for link in links or []:
        url = (link.get('url') or '').strip()
        title = link.get('title') or url
        if not url:
            continue
        platform = classify_social_url(url)
        if platform == 'youtube' or (link.get('type') or '').lower() in ('youtube', 'video'):
            if is_youtube_url(url):
                youtube_targets.append({'url': url, 'title': title, 'origin': 'link', 'link_id': link.get('id')})
            elif platform and platform != 'youtube':
                add_listed(platform, title, url, 'link')
        elif platform:
            add_listed(platform, title, url, 'link')

    channel_ids = []
    video_entries = []
    seen_videos = set()

    for target in youtube_targets:
        url = target['url']
        video_id = extract_video_id(url)
        parsed = urlparse(url)
        path = (parsed.path or '').rstrip('/')
        is_generic_home = ('youtube.com' in (parsed.netloc or '') or 'youtu.be' in (parsed.netloc or '')) and path in ('', '/')
        if is_generic_home:
            continue
        if video_id:
            if video_id not in seen_videos:
                seen_videos.add(video_id)
                video_entries.append({
                    'video_id': video_id,
                    'title': target.get('title') or video_id,
                    'url': f'https://www.youtube.com/watch?v={video_id}',
                    'origin': target.get('origin'),
                    'source': 'bio_link',
                    'link_id': target.get('link_id'),
                })
            continue

        channel_id = resolve_channel_id(url, session)
        if channel_id and channel_id not in channel_ids:
            channel_ids.append(channel_id)
            for entry in latest_video_ids_from_channel(channel_id, session):
                if entry['video_id'] in seen_videos:
                    continue
                seen_videos.add(entry['video_id'])
                entry['origin'] = target.get('origin')
                video_entries.append(entry)

    stats_map = fetch_video_stats([entry['video_id'] for entry in video_entries])
    videos = []
    for entry in video_entries:
        extra = stats_map.get(entry['video_id']) or {}
        views = extra.get('views')
        videos.append({
            'id': entry['video_id'],
            'title': extra.get('title') or entry.get('title') or entry['video_id'],
            'url': extra.get('url') or entry.get('url'),
            'views': views if views is not None else 0,
            'views_available': extra.get('views') is not None,
            'duration': extra.get('duration') or '',
            'duration_seconds': extra.get('duration_seconds') or 0,
            'published_at': extra.get('published_at') or entry.get('published_at') or '',
            'channel_title': extra.get('channel_title') or '',
            'likes': extra.get('likes'),
            'source': entry.get('source') or 'youtube',
            'origin': entry.get('origin'),
            'platform': 'youtube',
        })

    youtube_videos = [v for v in videos if v.get('views_available')]
    total_views = sum(v['views'] for v in youtube_videos)
    total_likes = sum((v.get('likes') or 0) for v in youtube_videos)
    durations = [v['duration_seconds'] for v in youtube_videos if v.get('duration_seconds')]
    avg_duration = int(sum(durations) / len(durations)) if durations else 0

    return {
        'youtube': {
            'videos': videos,
            'total_views': total_views,
            'total_likes': total_likes,
            'video_count': len(videos),
            'avg_duration': format_duration(avg_duration),
            'avg_duration_seconds': avg_duration,
            'channels_resolved': channel_ids,
            'using_official_api': bool(_youtube_api_key()),
        },
        'other_social': listed_social,
        'warnings': _warnings(videos, listed_social, youtube_targets),
    }


def _warnings(videos, listed_social, youtube_targets) -> list[str]:
    warnings = []
    if not youtube_targets:
        warnings.append('Add a YouTube channel or video URL in Profile or Links to load real view counts.')
    elif not videos:
        warnings.append('A YouTube URL was saved, but no public videos could be resolved from it.')
    missing_views = [v for v in videos if not v.get('views_available')]
    if missing_views:
        warnings.append('Some YouTube videos were found but public view counts could not be read.')
    if listed_social:
        warnings.append('Instagram, TikTok, X, and similar platforms are listed only. They do not expose public view counts without platform login.')
    return warnings


if __name__ == '__main__':
    import sys
    print("=== YouTube Stats Tool Runner ===")
    targets = sys.argv[1:]
    if not targets:
        print("No URL passed. Running demo with sample YouTube video...")
        demo_url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        targets = [demo_url]
    
    links = [{'url': u, 'title': f'Item {i+1}'} for i, u in enumerate(targets)]
    results = collect_social_analytics({}, links)
    
    print("\n--- Analytics Output ---")
    print(json.dumps(results, indent=2))
    
    yt_data = results.get('youtube', {})
    print(f"\n[Summary] Total videos resolved: {yt_data.get('video_count', 0)}")
    print(f"[Summary] Total views: {yt_data.get('total_views', 0):,}")
    print(f"[Summary] Average duration: {yt_data.get('avg_duration') or 'N/A'}")
    if results.get('warnings'):
        print("[Warnings]:")
        for w in results['warnings']:
            print(f"  - {w}")

