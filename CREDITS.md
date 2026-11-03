# Credits

Every external asset used in the site or in the build pipeline, with source and licence.

## Type
- **Fraunces** by Undercase Type (Phaedra Charles, Flavia Zimbardi). SIL Open Font License 1.1.
  Served via `next/font/google` (self-hosted at build time).

## Lucas's own material
- Identity reference images and the atom motion video in `reference/identities/` belong to Lucas Vu.
  Not shipped; used as references only.

## Sound (calibration and samples)
Freesound previews, downloaded by `scripts/audio/fetch.sh` (not committed after the first physics
commit). Licence verified on each page on 2026-11-02.
- "Newton's Cradle" by drewtait, https://freesound.org/s/676377/ , CC0 1.0. Calibration and the
  shipped clack samples.
- "Newtons Cradle 2" by LoafDV, https://freesound.org/s/131596/ , CC BY 4.0. Calibration only
  (onset timing and loudness decay).
- "Newtons Cradle.mp3" by LoafDV, https://freesound.org/s/94030/ , CC BY 4.0. Calibration only.
- "Newton's Cradle Toy" by HandroMyburg, https://freesound.org/s/763542/ , CC BY-NC 4.0.
  Calibration only, never shipped.

## Physics references
- Matthias Müller et al., "Small Steps in Physics Simulation" (2019) and Ten Minute Physics 05
  (MIT licence). Approach studied; no code copied.
- Miles Macklin et al., "XPBD: Position-Based Simulation of Compliant Constrained Dynamics" (2016).

## Light and surfaces
- HDRIs from Poly Haven (CC0): `sculpture_exhibition` (Oliksiy Yakovlyev), `white_studio_03`,
  `studio_small_09` (Sergej Majboroda), `photo_studio_loft_hall`, `monochrome_studio_02`,
  `studio_kontrast_02`. https://polyhaven.com . `gallery_neutral.hdr` and `white_neutral.hdr` are
  white-balanced, desaturated derivatives made by `scripts/hdri_neutral.py`.
- `public/textures/imperfections.jpg`: channels from ambientCG "Fingerprints002" and
  "SurfaceImperfections017" roughness maps (CC0), https://ambientcg.com .
- Realism reference photos (not shipped): see `reference/realism/SOURCES.md`.
