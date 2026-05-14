export type Category = 'All' | 'Film' | 'TVC' | 'Commercial';

export interface Project {
  id: string;
  title: string;
  category: Exclude<Category, 'All'>;
  role: string;
  image: string;
  imagePosition?: string;
  year: string;
  description: string;
  client?: string;
  duration?: string;
  team?: string;
  tools?: string[];
  video?: string;
  youtubeId?: string;
  vimeoId?: string;
  challenge?: string;
  solution?: string;
  gallery?: string[];
  awards?: string[];
  rating?: number;
  voteCount?: number;
  artists?: Array<{
    role: string;
    names: string;
  }>;
  testimonial?: {
    text: string;
    author: string;
    position: string;
  };
}

export const PROJECTS: Project[] = [
  {
    "id": "grab-dejavu",
    "title": "GRAB - CHUYẾN DEJAVU NHỚ ĐỜI",
    "category": "TVC",
    "role": "VFX Compositor & Motion Designer",
    "image": "https://res.cloudinary.com/diwzqmwno/image/upload/v1777457028/fc0dd8190459057.65bb3983a6983_renwsx.webp",
    "year": "2024",
    "description": "A compilation of the latest VFX work, featuring compositing, matchmoving, and visual effects across film and TVC projects.",
    "client": "Grab",
    "duration": "1 month",
    "team": "9 artists",
    "tools": [
      "After Effects",
      "Houdini",
      "PFTrack",
      "DaVinci Resolve",
      "Nuke"
    ],
    "youtubeId": "HH0m2AUQYFY",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777457027/e15fbf190459057.65bb3983a4329_kznqno.webp",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777457026/502635190459057.65bb3983a2f41_aajmaq.webp",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777457025/7045f4190459057.65bb3983a1731_z4ec45.webp",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777457024/8d3842190459057.65bb3983a246b_nzwepk.webp",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777457013/3afb4b190459057.65bb3983a4e56_hmhhff.webp",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777457012/2ae448190459057.65bb3983a5b71_tpdp5a.webp",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777457011/0bf58f190459057.65bb3983a39bc_klfb3j.webp"
    ],
    "awards": [],
    "rating": 4.8,
    "voteCount": 124
  },
  {
    "id": "dejavu-2026",
    "title": "ÁO XUÂN TƯƠI MÀU, DISCO XIN VÍA - COMFORT x TÓC TIÊN",
    "category": "TVC",
    "role": "VFX Compositor & Motion Designer",
    "image": "https://res.cloudinary.com/diwzqmwno/image/upload/v1777459576/175046162524459.63d791f870191_rvxsj0.jpg",
    "year": "2022",
    "description": "A vibrant and emotional journey captured through stunning visual effects and cinematic storytelling.",
    "client": "Comfort",
    "duration": "2 months",
    "team": "7 artists",
    "tools": [
      "After Effects",
      "Houdini",
      "PFTrack",
      "DaVinci Resolve",
      "Nuke"
    ],
    "youtubeId": "cJa-qJBfrnc",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777459574/8f9e72162524459.63d791f86d5e4_ki3hvf.webp",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777459575/0145b9162524459.63d791f86e361_q8s0et.webp",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777459575/6871d8162524459.63d791f87109e_fhaote.webp",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777459577/b4e7f9162524459.63d791f872fe1_kdx6gs.webp",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777459579/bca667162524459.63d791f86f3f1_waqbuk.webp",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777459578/bbe784162524459.63d791f871f58_d2b6gg.webp"
    ],
    "awards": [],
    "rating": 4.7,
    "voteCount": 98,
    "artists": [
      {
        "role": "CGI and VFX",
        "names": "SPICE fx"
      },
      {
        "role": "CG Director",
        "names": "Quoc Duy Ngo"
      },
      {
        "role": "VFX Producer",
        "names": "Nhi Truong, Tran Thi Tuyet Nhung"
      },
      {
        "role": "CG Artists",
        "names": "Viet Nguyen, Dilys Le, Glou Mai"
      },
      {
        "role": "VFX Artists",
        "names": "Luong Minh Hai, Nguyen Viet Hoang, Tuan Binh, Ly Cam Bieu"
      }
    ]
  },
  {
    "id": "nuvi-mv",
    "title": "NUVI - QUANG HÙNG MASTERD",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://res.cloudinary.com/diwzqmwno/image/upload/v1777452461/0918_1600_NUVI_MV_GENERIC_MOV4444-002.mov_snapshot_00.11.795_rqkvg1.jpg",
    "imagePosition": "center 25%",
    "year": "2026",
    "description": "A cinematic music video featuring stunning visual effects and atmospheric storytelling, bringing the artistic vision to life.",
    "client": "NUVI",
    "duration": "1 month",
    "team": "6 artists",
    "tools": [
      "Houdini",
      "After Effects",
      "DaVinci Resolve",
      "Nuke"
    ],
    "youtubeId": "YVbfTdg6PAE",
    "challenge": "Creating seamless visual effects integration with the music narrative while maintaining high-quality cinematic standards and matching the artistic direction.",
    "solution": "Developed a comprehensive compositing workflow with multi-pass rendering and precise color grading to achieve the cinematic look while preserving the emotional impact of the music.",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777452461/0918_1600_NUVI_MV_GENERIC_MOV4444-002.mov_snapshot_01.37.886_bjfioe.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777452462/0918_1600_NUVI_MV_GENERIC_MOV4444-002.mov_snapshot_03.17.840_nmwxhd.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777452461/0918_1600_NUVI_MV_GENERIC_MOV4444-002.mov_snapshot_00.36.556_a1cnce.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777452460/0918_1600_NUVI_MV_GENERIC_MOV4444-002.mov_snapshot_01.53.016_vdvdjw.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777452460/0918_1600_NUVI_MV_GENERIC_MOV4444-002.mov_snapshot_00.09.739_iaehcv.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777452461/0918_1600_NUVI_MV_GENERIC_MOV4444-002.mov_snapshot_03.29.176_yfqfns.jpg"
    ],
    "awards": [],
    "rating": 4.6,
    "voteCount": 89,
    "artists": [
      {
        "role": "CGI and VFX",
        "names": "SPICE fx"
      },
      {
        "role": "CG Director",
        "names": "Quoc Duy Ngo"
      },
      {
        "role": "VFX Producer",
        "names": "Nhi Truong, Tran Thi Tuyet Nhung"
      },
      {
        "role": "CG Artists",
        "names": "Viet Nguyen, Dat Duong"
      },
      {
        "role": "VFX Artists",
        "names": "Luong Minh Hai, Nguyen Thanh Duy, Ly Cam Bieu, Le My Tam"
      }
    ]
  },
  {
    "id": "7up-fun",
    "title": "7UP - FUN HAS NO RULES",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://res.cloudinary.com/diwzqmwno/image/upload/v1777441946/0115_7UP_MASTER.h264_260106.mov_snapshot_00.14.364_gtvr1m.jpg",
    "year": "2026",
    "description": "A vibrant and energetic commercial bringing playful moments to life with dynamic visual effects and color grading.",
    "client": "7UP Vietnam",
    "duration": "1 months",
    "team": "6 artists",
    "tools": [
      "Houdini",
      "After Effects",
      "Pftrack",
      "DaVinci Resolve"
    ],
    "youtubeId": "RvnaMwVGCYE",
    "challenge": "Creating dynamic particle effects and color grading that match the vibrant, playful brand identity while maintaining realistic lighting integration.",
    "solution": "Designed custom particle systems in Houdini and applied bold color grading in DaVinci Resolve to achieve the signature bright and energetic look.",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777441946/0115_7UP_MASTER.h264_260106.mov_snapshot_00.11.762_xiyovt.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777441946/0115_7UP_MASTER.h264_260106.mov_snapshot_00.07.629_t6idav.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777441946/0115_7UP_MASTER.h264_260106.mov_snapshot_00.02.791_bzhwki.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777441946/0115_7UP_MASTER.h264_260106.mov_snapshot_00.04.958_ecnech.jpg"
    ],
    "awards": [],
    "rating": 4.6,
    "voteCount": 89,
    "artists": [
      {
        "role": "CGI and VFX",
        "names": "SPICE fx"
      },
      {
        "role": "CG Director",
        "names": "Quoc Duy Ngo"
      },
      {
        "role": "VFX Producer",
        "names": "Nhi Truong, Tran Thi Tuyet Nhung"
      },
      {
        "role": "CG Artists",
        "names": "Viet Nguyen, Dat Duong"
      },
      {
        "role": "VFX Artists",
        "names": "Luong Minh Hai, Nguyen Thanh Duy, Ly Cam Bieu, Le My Tam"
      }
    ],
    "testimonial": {
      "text": "The VFX work perfectly captured the fun and energetic spirit of 7UP.",
      "author": "Marketing Director",
      "position": "Client"
    }
  },
  {
    "id": "lays-gi-on-chan-dong",
    "title": "LAY'S GIÒN CHẤN ĐỘNG, KHUẾCH ĐẠI MỌI CUỘC VUI",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://res.cloudinary.com/diwzqmwno/image/upload/v1777371060/0425_LAYS_Family_10s_16-9_South.mp4_snapshot_00.10.342_gtrf0c.jpg",
    "imagePosition": "center 30%",
    "year": "2026",
    "description": "Product-focused VFX with particle effects and dynamic motion graphics for Lay's campaign.",
    "client": "Lay's Vietnam",
    "duration": "3 weeks",
    "team": "6 artists",
    "tools": [
      "Houdini",
      "After Effects",
      "Pftrack",
      "V-Ray"
    ],
    "youtubeId": "Q3Q-TWRiaDE",
    "challenge": "Facing tight deadlines and changing client requirements while maintaining quality across multiple shots.",
    "solution": "Prioritized tasks clearly, communicated early with stakeholders, and broke work into smaller steps to maintain quality under pressure.",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777374183/0422_LAYS_Family_20s_North.mp4_snapshot_00.11.715_zjzjir.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777374177/0422_LAYS_Family_20s_North.mp4_snapshot_00.10.085_te5idq.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777374170/0422_LAYS_Family_20s_North.mp4_snapshot_00.08.520_eef2jq.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777372909/0425_LAYS_Family_10s_16-9_South.mp4_snapshot_00.06.460_hfgmea.jpg"
    ],
    "awards": [],
    "rating": 4.5,
    "voteCount": 78,
    "artists": [
      {
        "role": "CGI and VFX",
        "names": "SPICE fx"
      },
      {
        "role": "CG Director",
        "names": "Quoc Duy Ngo"
      },
      {
        "role": "VFX Producer",
        "names": "Nhi Truong, Tran Thi Tuyet Nhung"
      },
      {
        "role": "CG Artists",
        "names": "Viet Nguyen, Dat Duong"
      },
      {
        "role": "VFX Artists",
        "names": "Luong Minh Hai, Nguyen Thanh Duy, Ly Cam Bieu, Le My Tam"
      }
    ],
    "testimonial": {
      "text": "Excellent VFX work with great attention to detail. Delivered on time with outstanding quality.",
      "author": "Producer",
      "position": "SPICE fx"
    }
  },
  {
    "id": "all-new-nmax",
    "title": "NMAX – MAX UY THẾ",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://res.cloudinary.com/diwzqmwno/image/upload/v1777374562/maxresdefault_xganrx.jpg",
    "year": "2026",
    "description": "High-end automotive commercial with fluid simulations and particle systems.",
    "client": "Aether Motors",
    "duration": "1 months",
    "team": "6 artists",
    "tools": [
      "Houdini",
      "After Effects",
      "Pftrack",
      "V-Ray"
    ],
    "challenge": "Integrating CG fluid and particle simulations seamlessly with practical plates of a luxury vehicle while preserving the brand’s signature lighting language.",
    "solution": "Designed a multi-pass comp template, used custom flip simulations with retimed cache layers, and matched lighting via deep compositing and projected HDRIs.",
    "gallery": [
      "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1600&q=80"
    ],
    "awards": [],
    "rating": 4.4,
    "voteCount": 67,
    "artists": [
      {
        "role": "CGI and VFX",
        "names": "SPICE fx"
      },
      {
        "role": "CG Director",
        "names": "Quoc Duy Ngo"
      },
      {
        "role": "VFX Producer",
        "names": "Nhi Truong, Tran Thi Tuyet Nhung"
      },
      {
        "role": "CG Artists",
        "names": "Viet Nguyen, Dat Duong"
      },
      {
        "role": "VFX Artists",
        "names": "Luong Minh Hai, Nguyen Thanh Duy, Ly Cam Bieu, Le My Tam"
      }
    ],
    "testimonial": {
      "text": "A masterclass in bringing CG and live action together. Every frame feels intentional and premium.",
      "author": "Creative Director",
      "position": "Client"
    }
  },
  {
    "id": "rihair-film",
    "title": "TVC RIHAIR VIET NAM",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://res.cloudinary.com/diwzqmwno/image/upload/v1777442482/1008_Rihair_Film_2_Online.mp4_snapshot_00.20.217_c9s2gi.jpg",
    "year": "2026",
    "description": "Cinematic film production with stunning visual effects and atmospheric storytelling.",
    "client": "Rihair Production",
    "duration": "3 months",
    "team": "6 artists",
    "tools": [
      "Houdini",
      "After Effects",
      "DaVinci Resolve",
      "Nuke"
    ],
    "youtubeId": "CUYnRS53vZs",
    "challenge": "Creating seamless visual effects integration that enhances the emotional narrative while maintaining film-quality standards.",
    "solution": "Developed a comprehensive compositing workflow with multiple passes and precise color grading to achieve cinematic quality.",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777442481/1008_Rihair_Film_2_Online.mp4_snapshot_00.11.666_gplpyu.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777442481/1008_Rihair_Film_2_Online.mp4_snapshot_00.13.440_ymxufg.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777442481/1008_Rihair_Film_2_Online.mp4_snapshot_00.08.685_fzmweg.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777442480/2_dsw8w4.jpg"
    ],
    "awards": [],
    "rating": 4.6,
    "voteCount": 89,
    "artists": [
      {
        "role": "CGI and VFX",
        "names": "SPICE fx"
      },
      {
        "role": "CG Director",
        "names": "Quoc Duy Ngo"
      },
      {
        "role": "VFX Producer",
        "names": "Nhi Truong, Tran Thi Tuyet Nhung"
      },
      {
        "role": "CG Artists",
        "names": "Viet Nguyen, Dat Duong"
      },
      {
        "role": "VFX Artists",
        "names": "Luong Minh Hai, Nguyen Thanh Duy, Ly Cam Bieu, Le My Tam"
      }
    ],
    "testimonial": {
      "text": "Outstanding visual effects work that elevated our film to international standards.",
      "author": "Film Director",
      "position": "Client"
    }
  },
  {
    "id": "surf-tvc-2025",
    "title": "SURF TVC 2025",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1082478288.jpg",
    "year": "2025",
    "description": "VFX breakdown for a surf TV commercial. Wave simulations, water foam compositing, and product integration for SPICE fx.",
    "client": "SPICE fx",
    "duration": "15s",
    "team": "3 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "After Effects"
    ],
    "vimeoId": "1082478288",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778679768/best_01_vnsmc3.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778679772/best_02_a9unhy.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778679775/best_03_qpteeh.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778679791/best_04_tstjfv.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778679795/best_05_nkq5rn.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778679799/best_06_iravt0.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778679803/best_07_fitmb3.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778679807/best_08_tztf3r.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778679822/best_09_tucqjd.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778679825/best_10_e0icek.png"
    ],
    "challenge": "Creating realistic ocean wave simulations with dynamic foam and spray that needed to blend seamlessly with live-action surf footage.",
    "solution": "Built a custom Houdini pyro simulation pipeline for water spray and foam, composited in Nuke with multi-pass layers for realistic light scattering."
  },
  {
    "id": "tiger-balm-tvc-2025",
    "title": "TIGER BALM TVC 2025",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1143381334.jpg",
    "year": "2025",
    "description": "VFX compositing for Tiger Balm TV commercial. Dynamic fire and heat effects integrated with product visuals.",
    "client": "Tiger Balm",
    "duration": "30s",
    "team": "4 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "After Effects"
    ],
    "vimeoId": "1143381334",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674995/best_01_ut1pwn.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674996/best_02_ltyo6t.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674998/best_03_xrwzsb.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674999/best_04_jdyasx.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675000/best_05_xtvjoa.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675002/best_06_cjik6a.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675005/best_07_q53mnv.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675007/best_08_oaz44t.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675009/best_09_srbpau.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675010/best_10_tcglwz.png"
    ]
  },
  {
    "id": "kgc-tvc-2025",
    "title": "KGC JUNG KWAN JANG TVC 2025",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1143379790.jpg",
    "year": "2025",
    "description": "VFX breakdown for KGC Jung Kwan Jang TV commercial. Ginseng-themed visual effects and product integration.",
    "client": "KGC Jung Kwan Jang",
    "duration": "45s",
    "team": "5 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "DaVinci Resolve"
    ],
    "vimeoId": "1143379790",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778679656/best_01_pnqigy.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778679689/best_05_fesz0l.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778679706/best_06_pb7eqs.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778679716/best_07_nec2ha.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778679725/best_09_kuaejj.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778679729/best_10_d4ymyr.png"
    ]
  },
  {
    "id": "vim-cgi-2025",
    "title": "VIM CGI 2025",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1143377686.jpg",
    "year": "2025",
    "description": "CGI and VFX work for Vim brand commercial. Liquid simulation and product animation breakdown.",
    "client": "Vim",
    "duration": "15s",
    "team": "3 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "Cinema 4D"
    ],
    "vimeoId": "1143377686",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674963/best_01_jywlah.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674966/best_02_dafhuv.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674967/best_03_ejgbe7.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674968/best_04_wmgeaj.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674970/best_05_mj2dom.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674973/best_07_ucochf.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674974/best_08_b4eb3f.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674975/best_09_jxqvzo.png"
    ]
  },
  {
    "id": "takeda-tvc-2025",
    "title": "TAKEDA TVC 2025",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1097440287.jpg",
    "year": "2025",
    "description": "VFX breakdown for Takeda pharmaceutical TV commercial. Clean and precise visual effects for healthcare branding.",
    "client": "Takeda",
    "duration": "20s",
    "team": "4 artists",
    "tools": [
      "After Effects",
      "Nuke",
      "DaVinci Resolve"
    ],
    "vimeoId": "1097440287",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675085/best_01_zegayk.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675087/best_02_ijcbkw.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675088/best_03_nuocmw.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675090/best_04_yyblnh.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675091/best_05_rwghbh.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675093/best_07_nrzetw.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675094/best_08_rikpci.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675095/best_10_uodtkl.png"
    ]
  },
  {
    "id": "clear-tvc-2025",
    "title": "CLEAR TVC 2025",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1097430825.jpg",
    "year": "2025",
    "description": "VFX breakdown for CLEAR shampoo TV commercial. Refreshing water and foam visual effects for hair care brand.",
    "client": "CLEAR",
    "duration": "44s",
    "team": "4 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "After Effects"
    ],
    "vimeoId": "1097430825"
  },
  {
    "id": "lavie-tvc-2025",
    "title": "LAVIE TVC 2025",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1097430196.jpg",
    "year": "2025",
    "description": "VFX compositing for LAVIE bottled water TV commercial. Natural water and nature-themed visual effects.",
    "client": "LAVIE",
    "duration": "30s",
    "team": "3 artists",
    "tools": [
      "Houdini",
      "After Effects",
      "DaVinci Resolve"
    ],
    "vimeoId": "1097430196",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674792/best_01_bqabda.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674793/best_02_cpajqj.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674795/best_03_ng5wiv.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674796/best_04_vsguhq.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674797/best_05_tuwygi.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674799/best_06_msyenc.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674800/best_07_gx2job.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674802/best_08_bdlctn.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674804/best_09_cteevm.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674805/best_10_wo5je6.png"
    ]
  },
  {
    "id": "wanda-study-tvc-2025",
    "title": "WANDA STUDY TVC 2025",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1090341856.jpg",
    "year": "2025",
    "description": "VFX breakdown for Wanda Study TV commercial. Educational platform visualization with modern motion graphics.",
    "client": "Wanda Study",
    "duration": "1:06",
    "team": "4 artists",
    "tools": [
      "After Effects",
      "Nuke",
      "Cinema 4D"
    ],
    "vimeoId": "1090341856",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674839/best_01_pgjdu8.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674841/best_02_dpgqkl.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674842/best_03_epizoi.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674844/best_04_wqf8gb.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674845/best_05_rtxjoc.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674848/best_07_ivpvk2.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674850/best_08_uat1hy.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674851/best_09_xin7dy.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674853/best_10_aevcbf.png"
    ]
  },
  {
    "id": "closeup-tvc-2025",
    "title": "CLOSE UP TVC 2025",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1082477708.jpg",
    "year": "2025",
    "description": "VFX breakdown for Close Up toothpaste TV commercial. Dynamic flame and sparkle effects for oral care brand.",
    "client": "Close Up",
    "duration": "17s",
    "team": "3 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "After Effects"
    ],
    "vimeoId": "1082477708",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674701/best_01_rmx6vg.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674702/best_02_as0sxn.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674702/best_03_bnr7bm.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674704/best_04_dweuuy.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674705/best_05_svsbeb.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674707/best_06_dtziin.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674708/best_07_azb7cb.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674710/best_08_jdsb5x.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674711/best_09_s4pxtd.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674712/best_10_ztues1.png"
    ]
  },
  {
    "id": "boncha-ooh-2025",
    "title": "BONCHA OOH 2025",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1082477066.jpg",
    "year": "2025",
    "description": "VFX breakdown for Boncha OOH commercial. Out-of-home advertising visual effects for Boncha brand.",
    "client": "Boncha",
    "duration": "15s",
    "team": "3 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "After Effects"
    ],
    "vimeoId": "1082477066"
  },
  {
    "id": "kiri-minisweet-tvc-2025",
    "title": "KIRI MINISWEET TVC 2025",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1082476307.jpg",
    "year": "2025",
    "description": "VFX compositing for Kiri Minisweet TV commercial. Food product visualization with animated character effects.",
    "client": "Kiri",
    "duration": "6s",
    "team": "3 artists",
    "tools": [
      "After Effects",
      "Nuke",
      "Cinema 4D"
    ],
    "vimeoId": "1082476307"
  },
  {
    "id": "kitkat-tvc-2025",
    "title": "KITKAT TVC 2025",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1082475082.jpg",
    "year": "2025",
    "description": "VFX breakdown for KitKat TV commercial. Chocolate product animation and visual effects.",
    "client": "KitKat",
    "duration": "30s",
    "team": "4 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "After Effects"
    ],
    "vimeoId": "1082475082",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674762/best_01_d6o26m.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674765/best_03_bsfan5.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674766/best_04_zz3bbj.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674768/best_05_oshqlx.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674769/best_06_kisaft.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674771/best_07_dhh1en.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674772/best_08_zynokd.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674775/best_10_bfkk71.png"
    ]
  },
  {
    "id": "vinacapital-tvc-2025",
    "title": "VINACAPITAL TVC 2025",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1071278610.jpg",
    "year": "2025",
    "description": "VFX breakdown for VinaCapital TV commercial. Financial services branding with dynamic visual effects.",
    "client": "VinaCapital",
    "duration": "36s",
    "team": "5 artists",
    "tools": [
      "After Effects",
      "Nuke",
      "DaVinci Resolve"
    ],
    "vimeoId": "1071278610",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675121/best_01_arghcw.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675122/best_03_e8cmcl.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675126/best_07_nogkfi.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675126/best_06_dtm0lb.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675128/best_08_mbnvtt.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675130/best_09_b7wscc.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675131/best_10_ri3xom.png"
    ]
  },
  {
    "id": "shinhan-tvc-2024",
    "title": "SHINHAN TVC 2024",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1033328281.jpg",
    "year": "2024",
    "description": "VFX breakdown for Shinhan Bank TV commercial. Financial services visualization with cinematic effects.",
    "client": "Shinhan Bank",
    "duration": "1:09",
    "team": "5 artists",
    "tools": [
      "Nuke",
      "After Effects",
      "DaVinci Resolve"
    ],
    "vimeoId": "1033328281",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674731/best_01_txzuft.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674733/best_02_ckfh1j.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674735/best_03_k8n5ef.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674736/best_04_wyoen4.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674738/best_05_tdl0tj.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674739/best_06_knyzol.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674740/best_07_w2uzpn.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674743/best_09_xn7qn8.png"
    ]
  },
  {
    "id": "sunlight-tvc-2024",
    "title": "SUNLIGHT TVC 2024",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1018163618.jpg",
    "year": "2024",
    "description": "VFX breakdown for Sunlight TV commercial. Dishwashing liquid product visualization with water effects.",
    "client": "Sunlight",
    "duration": "15s",
    "team": "3 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "After Effects"
    ],
    "vimeoId": "1018163618",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674932/best_01_dhnifm.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674934/best_02_cc7qyl.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674935/best_03_lj8wyg.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674936/best_04_gc8cxo.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674938/best_05_k5furp.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674940/best_06_nbx0qv.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674941/best_07_yv3arc.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674943/best_08_xthm1s.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674944/best_09_hdupgl.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674946/best_10_mwekfh.png"
    ]
  },
  {
    "id": "surf-bumper-ads-2024",
    "title": "SURF BUMPER ADS 2024",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1008292821.jpg",
    "year": "2024",
    "description": "VFX bumper ads for Surf laundry detergent. Quick, impactful visual effects for brand advertising.",
    "client": "Surf",
    "duration": "6s",
    "team": "3 artists",
    "tools": [
      "After Effects",
      "Nuke"
    ],
    "vimeoId": "1008292821"
  },
  {
    "id": "tiki-bumper-ads-2024",
    "title": "TIKI BUMPER ADS 2024",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1008292182.jpg",
    "year": "2024",
    "description": "VFX bumper ads for Tiki e-commerce platform. Brand identity animations and product effects.",
    "client": "Tiki",
    "duration": "6s",
    "team": "3 artists",
    "tools": [
      "After Effects",
      "Cinema 4D"
    ],
    "vimeoId": "1008292182"
  },
  {
    "id": "lays-tvc-2024",
    "title": "LAY'S TVC 2024",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/1008291680.jpg",
    "year": "2024",
    "description": "VFX breakdown for Lay's potato chips TV commercial. Food product animation and branding effects.",
    "client": "Lay's",
    "duration": "30s",
    "team": "4 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "After Effects"
    ],
    "vimeoId": "1008291680"
  },
  {
    "id": "king-koil-tvc-2024",
    "title": "KING KOIL TVC 2024",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/923624710.jpg",
    "year": "2024",
    "description": "VFX compositing for King Koil mattress TV commercial. Comfort and luxury lifestyle visualization.",
    "client": "King Koil",
    "duration": "59s",
    "team": "4 artists",
    "tools": [
      "Nuke",
      "After Effects",
      "DaVinci Resolve"
    ],
    "vimeoId": "923624710",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674747/best_01_dbhkmx.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674748/best_02_uwqn4v.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674750/best_03_icijje.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674751/best_04_mkoilo.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674753/best_05_k1l0kx.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674754/best_06_lsaxk8.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674756/best_07_jf0cp2.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674758/best_08_dh4vk9.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674759/best_09_ieeqri.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674760/best_10_qmc4nz.png"
    ]
  },
  {
    "id": "vietcombank-visa-infinity-tvc-2024",
    "title": "VIETCOMBANK VISA INFINITY TVC 2024",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/904023514.jpg",
    "year": "2024",
    "description": "VFX breakdown for Vietcombank Visa Infinity TV commercial. Premium banking services branding.",
    "client": "Vietcombank",
    "duration": "45s",
    "team": "4 artists",
    "tools": [
      "Nuke",
      "After Effects",
      "DaVinci Resolve"
    ],
    "vimeoId": "904023514",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675107/best_01_ga8imo.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675108/best_03_tfbeop.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675109/best_04_gczizs.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675111/best_05_vfklrd.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675112/best_06_ycpitw.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675114/best_08_mdho73.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675116/best_09_mxumpf.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675117/best_10_bnqipf.png"
    ]
  },
  {
    "id": "rong-do-gducke-mv",
    "title": "RỒNG ĐỎ x GDUCKY - MV CHÁY CHẤT RIÊNG",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/891730829.jpg",
    "year": "2023",
    "description": "VFX breakdown for Rồng Đỏ x GDucky music video. Dynamic visual effects for a Vietnamese hip-hop collaboration.",
    "client": "Rồng Đỏ",
    "duration": "1:55",
    "team": "6 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "After Effects"
    ],
    "vimeoId": "891730829",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674947/best_01_aexvby.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674948/best_02_ffw2o9.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674950/best_03_imewa5.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674952/best_04_hpdfxk.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674954/best_05_wksjhn.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674955/best_06_nuzgcz.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674956/best_07_t7tom0.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674958/best_08_nggvzb.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674959/best_09_jkkuxg.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674961/best_10_u0vg3i.png"
    ]
  },
  {
    "id": "surf-tvc-2023",
    "title": "SURF TVC 2023",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/880041741.jpg",
    "year": "2023",
    "description": "VFX breakdown for Surf laundry TV commercial. Water simulation and fabric care product visualization.",
    "client": "Surf",
    "duration": "15s",
    "team": "3 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "After Effects"
    ],
    "vimeoId": "880041741"
  },
  {
    "id": "larue-tvc-2023",
    "title": "LARUE TVC 2023",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/850791727.jpg",
    "year": "2023",
    "description": "VFX compositing for Larue beer TV commercial. Alcohol brand campaign with lifestyle visual effects.",
    "client": "Larue",
    "duration": "30s",
    "team": "4 artists",
    "tools": [
      "Nuke",
      "After Effects",
      "DaVinci Resolve"
    ],
    "vimeoId": "850791727",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674884/best_01_f62nkl.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674886/best_02_jwyhek.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674887/best_03_xcg78e.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674889/best_04_ivbulv.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674890/best_05_j0vvxg.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674892/best_06_bdwko9.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674894/best_07_astgf3.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674895/best_08_cabmzm.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674896/best_09_ttpdby.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674898/best_10_bbwr2t.png"
    ]
  },
  {
    "id": "air-asia-viral-2023",
    "title": "AIR ASIA VIRAL VIDEO 2023",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/841766655.jpg",
    "year": "2023",
    "description": "VFX viral video for Air Asia airline. Travel and adventure-themed visual effects campaign.",
    "client": "Air Asia",
    "duration": "1:00",
    "team": "5 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "After Effects"
    ],
    "vimeoId": "841766655",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674824/best_01_xmc4df.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674825/best_02_y5jqtv.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674827/best_03_rzydt9.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674828/best_04_otralu.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674830/best_05_xsvdl4.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674831/best_06_chlmbv.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674833/best_07_jjsxuv.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674834/best_08_vk4xyc.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674836/best_09_nvsqvz.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674837/best_10_xysyo4.png"
    ]
  },
  {
    "id": "tvc-maggi-2023",
    "title": "TVC MAGGI 2023",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/840708805.jpg",
    "year": "2023",
    "description": "VFX breakdown for Maggi seasoning TV commercial. Food product visualization and cooking effects.",
    "client": "Maggi",
    "duration": "14s",
    "team": "3 artists",
    "tools": [
      "Houdini",
      "After Effects",
      "Nuke"
    ],
    "vimeoId": "840708805",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674870/best_01_esdvig.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674871/best_02_mikqwi.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674872/best_03_uk4ilc.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674874/best_04_vjbhxh.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674875/best_05_t3ypre.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674877/best_06_kxpcis.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674878/best_07_komrsm.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674880/best_08_sl275j.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674882/best_10_swyosj.png"
    ]
  },
  {
    "id": "visa-tvc-2023",
    "title": "VISA TVC 2023",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/834625349.jpg",
    "year": "2023",
    "description": "VFX breakdown for Visa payment card TV commercial. Digital payments and financial technology branding.",
    "client": "Visa",
    "duration": "30s",
    "team": "4 artists",
    "tools": [
      "Nuke",
      "After Effects",
      "Cinema 4D"
    ],
    "vimeoId": "834625349",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674854/best_01_kkugs4.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674855/best_02_fohhha.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674857/best_03_e4mdrd.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674858/best_04_dofh1d.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674859/best_05_yzsysc.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674861/best_06_tyjnnw.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674863/best_07_rxva5p.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674864/best_08_a893bl.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674866/best_09_sl8wl5.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674867/best_10_rmw4dx.png"
    ]
  },
  {
    "id": "twister-tvc-2023",
    "title": "TWISTER TVC 2023",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/832113256.jpg",
    "year": "2023",
    "description": "VFX compositing for Twister drink TV commercial. Dynamic fluid simulation and beverage product effects.",
    "client": "Twister",
    "duration": "30s",
    "team": "4 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "After Effects"
    ],
    "vimeoId": "832113256",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675099/best_01_yszk27.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675102/best_03_k2zd5r.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778675103/best_04_ty2ccs.png"
    ]
  },
  {
    "id": "7up-tvc-2023",
    "title": "7UP TVC 2023",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/817154908.jpg",
    "year": "2023",
    "description": "VFX breakdown for 7Up soda TV commercial. Refreshing soft drink campaign with vibrant visual effects.",
    "client": "7Up",
    "duration": "1:00",
    "team": "4 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "After Effects"
    ],
    "vimeoId": "817154908"
  },
  {
    "id": "durex-thematic-gay-tvc-2022",
    "title": "DUREX THEMATIC GAY TVC 2022",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/817151192.jpg",
    "year": "2022",
    "description": "VFX breakdown for Durex Thematic Gay campaign. Sensitivity and creativity in visual storytelling.",
    "client": "Durex",
    "duration": "29s",
    "team": "4 artists",
    "tools": [
      "Nuke",
      "After Effects",
      "DaVinci Resolve"
    ],
    "vimeoId": "817151192"
  },
  {
    "id": "durex-thematic-les-tvc-2022",
    "title": "DUREX THEMATIC LES TVC 2022",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/817151101.jpg",
    "year": "2022",
    "description": "VFX compositing for Durex Thematic Les campaign. Emotional storytelling through visual effects.",
    "client": "Durex",
    "duration": "29s",
    "team": "4 artists",
    "tools": [
      "Nuke",
      "After Effects",
      "DaVinci Resolve"
    ],
    "vimeoId": "817151101"
  },
  {
    "id": "knorr-tvc-2023",
    "title": "KNORR TVC 2023",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/817148374.jpg",
    "year": "2023",
    "description": "VFX breakdown for Knorr seasoning TV commercial. Food product animation and culinary visual effects.",
    "client": "Knorr",
    "duration": "15s",
    "team": "3 artists",
    "tools": [
      "Houdini",
      "After Effects",
      "Nuke"
    ],
    "vimeoId": "817148374"
  },
  {
    "id": "rejoice-viral-2022",
    "title": "REJOICE VIRAL CLIP 2022",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/817147701.jpg",
    "year": "2022",
    "description": "VFX for Rejoice shampoo viral video campaign. Hair care product effects and lifestyle visualization.",
    "client": "Rejoice",
    "duration": "1:33",
    "team": "4 artists",
    "tools": [
      "Nuke",
      "After Effects",
      "DaVinci Resolve"
    ],
    "vimeoId": "817147701"
  },
  {
    "id": "omo-tvc-2022",
    "title": "OMO TVC 2022",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/817146786.jpg",
    "year": "2022",
    "description": "VFX breakdown for OMO detergent TV commercial. Laundry and cleaning product visual effects.",
    "client": "OMO",
    "duration": "30s",
    "team": "4 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "After Effects"
    ],
    "vimeoId": "817146786"
  },
  {
    "id": "heineken-tvc-2023",
    "title": "HEINEKEN TVC 2023",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/817144118.jpg",
    "year": "2023",
    "description": "VFX breakdown for Heineken beer TV commercial. Premium beverage branding with sophisticated visual effects.",
    "client": "Heineken",
    "duration": "20s",
    "team": "5 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "After Effects"
    ],
    "vimeoId": "817144118",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674778/best_01_k66mkt.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674779/best_02_omuzdj.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674781/best_03_t5m8q4.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674782/best_04_ilzapo.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674783/best_05_nzxtix.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674785/best_06_sxqpdr.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674786/best_07_ivz5ww.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674788/best_08_tp5ckp.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674789/best_09_jiv9hs.png",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1778674791/best_10_shwmmm.png"
    ]
  },
  {
    "id": "warrior-mv",
    "title": "WARRIOR MV",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/714310031.jpg",
    "year": "2022",
    "description": "VFX breakdown for Warrior music video. Cinematic visual effects for a high-energy music production.",
    "client": "Warrior",
    "duration": "3:14",
    "team": "6 artists",
    "tools": [
      "Houdini",
      "Nuke",
      "After Effects"
    ],
    "vimeoId": "714310031"
  },
  {
    "id": "warrior-tvc-2021",
    "title": "MASTER TVC WARRIOR 2021",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://vumbnail.com/713612370.jpg",
    "year": "2021",
    "description": "VFX for Warrior energy drink TV commercial. High-impact visual effects for sports drink branding.",
    "client": "Warrior",
    "duration": "15s",
    "team": "3 artists",
    "tools": [
      "After Effects",
      "Nuke"
    ],
    "vimeoId": "713612370"
  },
  {
    "id": "mbbank-priority",
    "title": "MB BANK PRIORITY - CREATIVE BREAKTHROUGH",
    "category": "TVC",
    "role": "VFX Compositor",
    "image": "https://res.cloudinary.com/diwzqmwno/image/upload/v1777443001/0820_MBBank_Online_30s_master_prores_4444.mov_snapshot_00.00.000_jsx6hv.jpg",
    "year": "2026",
    "description": "A cinematic campaign blending emotional storytelling with premium product visuals for MB Priority.",
    "client": "MB Bank",
    "duration": "2 months",
    "team": "6 artists",
    "tools": [
      "Houdini",
      "After Effects",
      "Nuke",
      "DaVinci Resolve"
    ],
    "youtubeId": "jArvdkD4Npw",
    "challenge": "Balancing emotional narrative scenes and high-end brand visuals while maintaining a consistent cinematic tone across all shots.",
    "solution": "Built a shot-based comp pipeline with lookdev presets, then unified the final output using custom grading LUTs and highlight control passes.",
    "gallery": [
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777443001/0820_MBBank_Online_30s_master_prores_4444.mov_snapshot_00.05.598_mhcwhn.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777443003/0820_MBBank_Online_30s_master_prores_4444.mov_snapshot_00.13.927_pnefyv.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777443002/0820_MBBank_Online_30s_master_prores_4444.mov_snapshot_00.15.038_jnitjf.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777443005/0820_MBBank_Online_30s_master_prores_4444.mov_snapshot_00.21.916_tfku02.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777443004/0820_MBBank_Online_30s_master_prores_4444.mov_snapshot_00.18.046_yuzq2m.jpg",
      "https://res.cloudinary.com/diwzqmwno/image/upload/v1777443007/0820_MBBank_Online_30s_master_prores_4444.mov_snapshot_00.24.109_jjusl8.jpg"
    ],
    "awards": [],
    "rating": 4.6,
    "voteCount": 89,
    "artists": [
      {
        "role": "CGI and VFX",
        "names": "SPICE fx"
      },
      {
        "role": "CG Director",
        "names": "Quoc Duy Ngo"
      },
      {
        "role": "VFX Producer",
        "names": "Nhi Truong, Tran Thi Tuyet Nhung"
      },
      {
        "role": "CG Artists",
        "names": "Viet Nguyen, Dat Duong"
      },
      {
        "role": "VFX Artists",
        "names": "Luong Minh Hai, Nguyen Thanh Duy, Ly Cam Bieu, Le My Tam"
      }
    ],
    "testimonial": {
      "text": "The visual storytelling was premium and emotional, exactly what we envisioned for the campaign.",
      "author": "Brand Manager",
      "position": "Client"
    }
  }
];

export const getProjectById = (id: string): Project | undefined =>
  PROJECTS.find((project) => project.id === id);

export const getAdjacentProjects = (id: string): { previous: Project; next: Project } | null => {
  const index = PROJECTS.findIndex((project) => project.id === id);

  if (index === -1) {
    return null;
  }

  return {
    previous: PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length],
    next: PROJECTS[(index + 1) % PROJECTS.length],
  };
};
