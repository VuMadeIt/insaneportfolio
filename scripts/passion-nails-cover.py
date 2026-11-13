# The Passion Nails cover (home and /work row, case-study hero): Lucas's screen recording of the live site
# (~/Videos/pnails.mp4), with dead air cut and cursor-only stretches sped up, framed like reboot-wide.mp4.
# Privacy: browser autofill popups are patched out, the typed mobile number is blurred, and the browser's
# link-preview bar (it showed a private manage-booking link) is cropped off.
# Usage: python scripts/passion-nails-cover.py [source.mp4] [DRY=1]
#   -> public/media/work/passion-nails.mp4 + .webp
import os, subprocess, sys
import cv2
import numpy as np

SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser("~/Videos/pnails.mp4")
OUT = "public/media/work/passion-nails"
W, H, PAD, RADIUS = 1630, 912, 100, 6  # the frame of reboot-wide.mp4, padding equal on all sides
BG = (203, 184, 221)  # BGR of #DDB8CB, a soft mauve tint of the salon's wine #87133E
CROP_BOTTOM = 48  # the browser's link-preview bar
IDLE, LIGHT = 0.12, 1.5  # mean frame difference: nothing moves / only the cursor or a caret
SPEED_LIGHT, SPEED_MOTION, KEEP_IDLE = 2.5, 1.5, 0.2  # seconds of each still stretch kept


def frames():
    cap = cv2.VideoCapture(SRC)
    while True:
        ok, f = cap.read()
        if not ok:
            return
        yield f


def plan(fps):
    small = [cv2.cvtColor(cv2.resize(f, (356, 183)), cv2.COLOR_BGR2GRAY).astype(np.int16) for f in frames()]
    d = np.array([0.0] + [np.mean(np.abs(b - a)) for a, b in zip(small, small[1:])])
    d = np.array([d[max(0, i - 3) : i + 4].max() for i in range(len(d))])
    start = int(np.argmax(d > 15))  # frame 0 is the page before the reload
    step, still = [], 0
    for i, v in enumerate(d):
        still = still + 1 if v < IDLE else 0
        if i < start or still > KEEP_IDLE * fps:
            step.append(0.0)
        else:
            step.append(1 / SPEED_LIGHT if v < LIGHT else 1 / SPEED_MOTION)
    return step


def privacy(f, t, refs, label):
    if not 76 <= t <= 93:
        return f
    # Chrome's autofill popups (measured: under Name 77.18-80.28 s, under Mobile 80.28-84.81 s, plus their
    # fades), patched from a clean frame at the same scroll; each starts under its field's focus ring.
    for (a, b, y0, y1), ref in zip([(77.0, 80.27, 858, 1116), (80.27, 85.0, 1056, 1292)], refs):
        if a <= t <= b:
            f[y0:y1, 1000:1400] = ref[y0:y1, 1000:1400]
            tip = f[y0 - 5 : y0, 1000:1400]  # the popup's pointer, over the focus ring: paint it ring colour
            ring = f[y0 - 5 : y0, 900:901]
            dark = cv2.cvtColor(tip, cv2.COLOR_BGR2GRAY) < 120
            tip[dark] = np.broadcast_to(ring, tip.shape)[dark]
    g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
    r = cv2.matchTemplate(g, label, cv2.TM_CCOEFF_NORMED)
    _, score, _, (lx, ly) = cv2.minMaxLoc(r)
    if score > 0.8:  # the mobile field sits 53 px under its label
        y0, y1, x0, x1 = ly + 58, ly + 145, lx + 12, lx + 600
        f[y0:y1, x0:x1] = cv2.GaussianBlur(f[y0:y1, x0:x1], (0, 0), 14)
    return f


def frame_at(t):
    cap = cv2.VideoCapture(SRC)
    cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
    return cap.read()[1]


def main():
    fps = cv2.VideoCapture(SRC).get(cv2.CAP_PROP_FPS)
    step = plan(fps)
    print(f"{len(step) / fps:.1f}s -> {sum(step) / fps:.1f}s")
    if os.environ.get("DRY"):
        return
    refs = (frame_at(76.6), frame_at(86.5))
    label = cv2.cvtColor(frame_at(89.5), cv2.COLOR_BGR2GRAY)[496:530, 822:1060]
    iw = W - 2 * PAD
    ih = H - 2 * PAD
    mask = np.zeros((ih, iw), np.uint8)
    cv2.rectangle(mask, (RADIUS, 0), (iw - RADIUS - 1, ih - 1), 255, -1)
    cv2.rectangle(mask, (0, RADIUS), (iw - 1, ih - RADIUS - 1), 255, -1)
    for cx, cy in [(RADIUS, RADIUS), (iw - RADIUS - 1, RADIUS), (RADIUS, ih - RADIUS - 1), (iw - RADIUS - 1, ih - RADIUS - 1)]:
        cv2.circle(mask, (cx, cy), RADIUS, 255, -1, cv2.LINE_AA)
    alpha = (mask / 255.0)[..., None]
    canvas = np.zeros((H, W, 3), np.uint8)
    canvas[:] = BG
    ff = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", "30", "-i", "-",
         "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
         f"{OUT}.mp4"],
        stdin=subprocess.PIPE,
    )
    clock, emitted, poster = 0.0, 0, None
    for i, f in enumerate(frames()):
        clock += step[i] / fps
        if emitted >= clock * 30:
            continue
        f = privacy(f, i / fps, refs, label)[: f.shape[0] - CROP_BOTTOM]
        inner = cv2.resize(f, (iw, ih), interpolation=cv2.INTER_AREA)
        out = canvas.copy()
        out[PAD : PAD + ih, PAD : PAD + iw] = (inner * alpha + out[PAD : PAD + ih, PAD : PAD + iw] * (1 - alpha)).astype(np.uint8)
        while emitted < clock * 30:
            ff.stdin.write(out.tobytes())
            emitted += 1
        if poster is None and i / fps > 3:
            poster = out
    ff.stdin.close()
    ff.wait()
    cv2.imwrite(f"{OUT}.webp", poster, [cv2.IMWRITE_WEBP_QUALITY, 82])
    print(f"{emitted} frames, {emitted / 30:.1f}s")


main()
