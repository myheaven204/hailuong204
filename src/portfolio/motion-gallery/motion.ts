import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

export const galleryEase = {
  move: CustomEase.create('mg-move', '0.3, 0.075, 0, 1'),
  settle: CustomEase.create('mg-settle', '0.625, 0.05, 0, 1'),
};

export const galleryMotion = {
  entranceDelay: 0.4,
  textDuration: 1,
  lineStagger: 0.07,
  characterStagger: 0.0175,
  scrollLerp: 0.165,
  wheelMultiplier: 1.25,
  stackDepth: 120,
  stackOffset: 40,
  stackScroll: 1.2,
};
