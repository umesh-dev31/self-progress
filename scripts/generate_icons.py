import os
from PIL import Image, ImageDraw

os.makedirs('public', exist_ok=True)

def draw_icon(size, is_maskable=False):
    # Base image
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # If maskable, fill entire canvas with neo-yellow #FFDD55, and keep graphics within safe area (80%)
    if is_maskable:
        draw.rectangle([0, 0, size, size], fill=(255, 221, 85, 255))
        padding = int(size * 0.15)
        # Inner card in safe zone
        card_x0, card_y0 = padding, padding
        card_x1, card_y1 = size - padding, size - padding
        border_w = max(3, int(size * 0.035))
        corner_r = int(size * 0.12)
        
        # Shadow
        shadow_off = int(size * 0.03)
        draw.rounded_rectangle(
            [card_x0 + shadow_off, card_y0 + shadow_off, card_x1 + shadow_off, card_y1 + shadow_off],
            radius=corner_r,
            fill=(18, 18, 18, 255)
        )
        # Card (Terracotta #D96B43)
        draw.rounded_rectangle(
            [card_x0, card_y0, card_x1, card_y1],
            radius=corner_r,
            fill=(217, 107, 67, 255),
            outline=(18, 18, 18, 255),
            width=border_w
        )
        
        # Lightning bolt in white
        cx = size / 2
        cy = size / 2
        s = (card_x1 - card_x0) * 0.55
    else:
        # Standard rounded app icon with drop shadow
        margin = int(size * 0.08)
        shadow_off = int(size * 0.04)
        border_w = max(3, int(size * 0.04))
        corner_r = int(size * 0.22)

        x0, y0 = margin, margin
        x1, y1 = size - margin - shadow_off, size - margin - shadow_off

        # Shadow
        draw.rounded_rectangle(
            [x0 + shadow_off, y0 + shadow_off, x1 + shadow_off, y1 + shadow_off],
            radius=corner_r,
            fill=(18, 18, 18, 255)
        )

        # Background rounded rect (Yellow #FFDD55)
        draw.rounded_rectangle(
            [x0, y0, x1, y1],
            radius=corner_r,
            fill=(255, 221, 85, 255),
            outline=(18, 18, 18, 255),
            width=border_w
        )

        # Inner badge (Terracotta #D96B43)
        inner_m = int((x1 - x0) * 0.12)
        ix0, iy0 = x0 + inner_m, y0 + inner_m
        ix1, iy1 = x1 - inner_m, y1 - inner_m
        draw.rounded_rectangle(
            [ix0, iy0, ix1, iy1],
            radius=int(corner_r * 0.7),
            fill=(217, 107, 67, 255),
            outline=(18, 18, 18, 255),
            width=max(2, int(border_w * 0.7))
        )

        cx = (ix0 + ix1) / 2
        cy = (iy0 + iy1) / 2
        s = (ix1 - ix0) * 0.65

    # Coordinates for crisp lightning bolt Zap icon centered at (cx, cy)
    # Standard SVG lightning bolt: [13, 2], [3, 14], [12, 14], [11, 22], [21, 10], [12, 10], [13, 2]
    # Center of unit 24 is roughly (12, 12)
    def pt(ux, uy):
        return (cx + (ux - 12) * (s / 24), cy + (uy - 12) * (s / 24))

    bolt_pts = [
        pt(13, 2),
        pt(4.5, 13.5),
        pt(11.5, 13.5),
        pt(10.5, 22),
        pt(19.5, 10.5),
        pt(12.5, 10.5),
    ]

    # Draw white bolt with crisp black border
    draw.polygon(bolt_pts, fill=(255, 255, 255, 255), outline=(18, 18, 18, 255))

    return img

# Generate all required icon assets
sizes = [
    ('public/pwa-192x192.png', 192, False),
    ('public/pwa-512x512.png', 512, False),
    ('public/maskable-icon-512x512.png', 512, True),
    ('public/apple-touch-icon.png', 180, False),
    ('public/favicon-32x32.png', 32, False),
]

for filename, size, maskable in sizes:
    img = draw_icon(size, maskable)
    img.save(filename, 'PNG')
    print(f"Generated {filename} ({size}x{size})")
