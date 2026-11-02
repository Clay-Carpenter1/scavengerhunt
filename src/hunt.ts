export type ThemeName = 'playful' | 'warm' | 'memory' | 'romantic' | 'finale'

export type Stop = {
  id: string
  wheelLabel: string
  title: string
  clue: string
  note: string
  theme: ThemeName
  image?: string
  caption?: string
  isFinale?: boolean
}

export type SongCard = {
  id: string
  title: string
  artist: string
  image: string
}

export type ChoiceIcon = 'note' | 'photo'

export type ChoiceOption = {
  id: string
  label: string
  hint: string
  clue: string
  note: string
  afterTitle: string
  afterClue: string
  afterNote: string
  icon?: ChoiceIcon
  camera?: boolean
  appUrl?: string
}

/**
 * Edit this file to personalize the night.
 * Swap names, places, and the final letter — the wheel and screens read from here.
 */
export const hunt = {
  herName: 'Becca',
  yourName: 'Me',
  siteTitle: "Tonight's itinerary",
  introEyebrow: 'Classified, kind of',
  introLine: 'The wheel decides. You just spin.',
  rulesTitle: 'Rules',
  rules: [
    'You spin. Then you actually go.',
    'Follow Rule #3.',
    'Follow Rule #1.',
    'No Skipping, No Looking Ahead.',
  ],
  introButton: "Spin tonight's first stop",
  resultEyebrow: 'The wheel has spoken',
  doneButton: 'We did it',
  spinLabels: {
    playful: 'Give it a spin',
    warm: 'Again?',
    memory: 'One more',
    romantic: 'Whenever you are ready',
    finale: 'Last one.',
  } satisfies Record<ThemeName, string>,
  lastChoice: {
    eyebrow: 'One more',
    title: 'Most played together',
    lede: 'Tap to slide.',
    resultEyebrow: 'It landed on',
    afterClue: 'Put it on.',
    afterNote: 'You know the one.',
    songs: [
      {
        id: 'beauty-and-a-beat',
        title: 'Beauty and a Beat',
        artist: 'Justin Bieber',
        image: '/songs/beauty-and-a-beat.jpg',
      },
      {
        id: 'lonely-east-texas',
        title: 'Lonely East Texas Nights',
        artist: 'Whiskey Myers',
        image: '/songs/lonely-east-texas.jpg',
      },
      {
        id: 'wagon-wheel',
        title: 'Wagon Wheel',
        artist: 'Darius Rucker',
        image: '/songs/wagon-wheel.jpg',
      },
      {
        id: 'five-to-nine',
        title: '5 to 9',
        artist: 'Hudson Westbrook',
        image: '/songs/5-to-9.jpg',
      },
      {
        id: 'house-again',
        title: 'House Again',
        artist: 'Hudson Westbrook',
        image: '/songs/house-again.jpg',
      },
    ],
  },
  doneTitle: "That's everything.",
  doneLine: 'The rest is not on the phone.',
  choice: {
    afterStopId: 'andys',
    eyebrow: 'Your call',
    title: 'Pick one',
    lede: 'No wheel this time. Tap a box.',
    resultEyebrow: 'You picked',
    options: [
      {
        id: 'aux',
        label: 'Aux',
        hint: 'A song',
        icon: 'note' as const,
        clue: 'Put a song on the aux.',
        note: 'Your pick. The whole ride hears it.',
        appUrl: 'spotify://',
        afterTitle: 'Utter silence',
        afterClue: 'Put the song on. Then no talking while we go to the next destination.',
        afterNote: 'The song can play. You cannot.',
      },
      {
        id: 'photo',
        label: 'A photo',
        hint: 'Right now',
        icon: 'photo' as const,
        clue: 'Take a picture before we leave.',
        note: 'Something we can keep from tonight.',
        camera: true,
        afterTitle: 'Utter silence',
        afterClue: 'Take the picture. Then no talking while we go to the next destination.',
        afterNote: 'That is the last sound we make until we get there.',
      },
    ],
  },
  stops: [
    {
      id: 'andys',
      wheelLabel: 'Ice cream first',
      title: "Andy's",
      clue: "Go to Andy's and get a Butter Pecan Concrete.",
      note: "Dessert before the plan. That's the rule tonight.",
      theme: 'playful',
      image: '/andys.png',
    },
    {
      id: 'memory',
      wheelLabel: 'A familiar place',
      title: 'A familiar place',
      clue: 'Go back to where this started.',
      note: "This one isn't random.",
      theme: 'memory',
      image: '/familiar-place.png',
      caption: 'Was this a date or a hangout?',
    },
    {
      id: 'hers',
      wheelLabel: 'Just for you',
      title: 'The rest of us',
      clue: 'Go see the other part of our family.',
      note: 'Tonight is not complete without them.',
      theme: 'romantic',
      image: '/the-rest-of-us.png',
    },
    {
      id: 'the-question',
      wheelLabel: '???',
      title: 'Go back',
      clue: '.',
      note: 'Go back to the object that looks like this.',
      theme: 'finale',
      image: '/last-stop.svg',
    },
  ] satisfies Stop[],
  decoys: [
    'Pizza',
    'Bowling',
    'Mini golf',
    'Movie',
    'Karaoke',
    'Nap',
    'Coffee',
    'Tacos',
    'Arcade',
    'Sunset',
  ],
}

export const themeMotion: Record<ThemeName, { spinMs: number }> = {
  playful: { spinMs: 8000 },
  warm: { spinMs: 8000 },
  memory: { spinMs: 8000 },
  romantic: { spinMs: 8000 },
  finale: { spinMs: 8000 },
}

export type Hunt = typeof hunt
