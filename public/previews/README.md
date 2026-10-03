# Video previews for the motion gallery

The design preview uses original, correctly associated project frames until genuine preview clips are supplied. No unavailable video URLs are requested and no still-image effect is presented as film footage.

## Adding a clip

1. Export a short, seamless loop from footage you have permission to use. A 3–6 second H.264 MP4 without audio is a useful starting point. Keep the clip lightweight and retain the original image composition.
2. Place the file in this directory, using the exact project ID as its filename.
3. Add the matching entry to src/portfolio/motion-gallery/data.ts:

    export const PREVIEW_CLIPS: Partial<Record<string, PreviewClip>> = {
      'lavie-tvc-2025': { src: '/previews/lavie-tvc-2025.mp4' },
    };

Suggested first clips:

- lavie-tvc-2025.mp4
- rong-do-gducke-mv.mp4
- mbbank-priority.mp4
- grab-dejavu.mp4
- sunlight-tvc-2024.mp4
- closeup-tvc-2025.mp4

Clips load on interaction, play muted and inline, pause when inactive or out of view, and fall back to the original project frame if loading or autoplay fails. Reduced-motion disables automatic previews unless the viewer deliberately selects Full motion in this isolated demo.

The studio showreel and project/breakdown players remain their original YouTube/Vimeo sources; they are not substituted with preview loops.
