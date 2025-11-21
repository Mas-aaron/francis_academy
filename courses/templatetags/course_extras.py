from django import template
import re
from urllib.parse import urlparse, parse_qs

register = template.Library()

@register.filter
def get_item(dictionary, key):
    """Get an item from a dictionary using a key."""
    if dictionary is None:
        return None
    return dictionary.get(key, False)


@register.filter
def youtube_id(url):
    """Extract YouTube video ID from URL."""
    if not url:
        return None
    
    # Handle different YouTube URL formats
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
        r'youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    return None


@register.filter
def vimeo_id(url):
    """Extract Vimeo video ID from URL."""
    if not url:
        return None
    
    # Handle different Vimeo URL formats
    pattern = r'vimeo\.com/(?:video/)?(\d+)'
    match = re.search(pattern, url)
    
    if match:
        return match.group(1)
    
    return None
