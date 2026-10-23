"""Check Ukrainian glyph coverage directly from the bundled TrueType cmap tables."""
from pathlib import Path
import struct

REQUIRED = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯабвгґдеєжзиіїйклмнопрстуфхцчшщьюя’"


def mapped_codepoints(data):
    count = struct.unpack_from('>H', data, 4)[0]
    cmap = None
    for index in range(count):
        tag, _, offset, _ = struct.unpack_from('>4sIII', data, 12 + index * 16)
        if tag == b'cmap':
            cmap = offset
    if cmap is None:
        return set()
    count = struct.unpack_from('>H', data, cmap + 2)[0]
    codes = set()
    for index in range(count):
        platform, _, offset = struct.unpack_from('>HHI', data, cmap + 4 + index * 8)
        if platform not in (0, 3):
            continue
        pos = cmap + offset
        fmt = struct.unpack_from('>H', data, pos)[0]
        if fmt == 4:
            segments = struct.unpack_from('>H', data, pos + 6)[0] // 2
            end_pos = pos + 14
            start_pos = end_pos + segments * 2 + 2
            delta_pos = start_pos + segments * 2
            range_pos = delta_pos + segments * 2
            for segment in range(segments):
                end = struct.unpack_from('>H', data, end_pos + segment * 2)[0]
                start = struct.unpack_from('>H', data, start_pos + segment * 2)[0]
                delta = struct.unpack_from('>h', data, delta_pos + segment * 2)[0]
                roffset = struct.unpack_from('>H', data, range_pos + segment * 2)[0]
                for char in REQUIRED:
                    code = ord(char)
                    if not start <= code <= end:
                        continue
                    glyph = (code + delta) & 0xffff
                    if roffset:
                        glyph_pos = range_pos + segment * 2 + roffset + (code - start) * 2
                        glyph = struct.unpack_from('>H', data, glyph_pos)[0]
                        if glyph:
                            glyph = (glyph + delta) & 0xffff
                    if glyph:
                        codes.add(code)
        elif fmt == 12:
            groups = struct.unpack_from('>I', data, pos + 12)[0]
            for group in range(groups):
                start, end, glyph = struct.unpack_from('>III', data, pos + 16 + group * 12)
                codes.update(ord(char) for char in REQUIRED if start <= ord(char) <= end and glyph + ord(char) - start > 0)
    return codes


failed = False
fonts = sorted(Path('public/fonts').glob('*.ttf'))
if len(fonts) != 4:
    raise SystemExit('Expected four bundled TTF files')
for font in fonts:
    codepoints = mapped_codepoints(font.read_bytes())
    missing = ''.join(char for char in REQUIRED if ord(char) not in codepoints)
    print(font.name + ': ' + ('missing ' + missing if missing else 'all Ukrainian glyphs present'))
    failed = failed or bool(missing)
raise SystemExit(1 if failed else 0)
