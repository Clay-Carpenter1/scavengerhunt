export type ThemeName = 'playful' | 'warm' | 'memory' | 'romantic' | 'finale'

export type Stop = {
  id: string
  wheelLabel: string
  title: string
  clue: string
  note: string
  theme: ThemeName
  image?: string
  isFinale?: boolean
}

export type ChoiceOption = {
  id: string
  label: string
  hint: string
  clue: string
  note: string
  afterTitle: string
  afterClue: string
  afterNote: string
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
  introTitle: "Tonight's itinerary",
  introLine: 'The wheel decides. You just spin.',
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
    title: 'Pick one',
    lede: 'Last choice. Then look up.',
    resultEyebrow: 'You picked',
    options: [
      {
        id: 'our-song',
        label: 'Most played song together',
        hint: 'You know the one',
        clue: 'Put on the most played song we have together.',
        note: 'You both know which one.',
        afterTitle: 'Most played song together',
        afterClue: 'Put it on.',
        afterNote: 'You both know which one.',
      },
      {
        id: 'windows',
        label: 'Windows down',
        hint: 'The last stretch',
        clue: 'Windows down for the last stretch.',
        note: 'Let the air in.',
        afterTitle: 'Windows down',
        afterClue: 'Windows down for the last stretch.',
        afterNote: 'Let the air in.',
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
        clue: 'Put a song on the aux.',
        note: 'Your pick. The whole ride hears it.',
        afterTitle: 'Utter silence',
        afterClue: 'Put the song on. Then no talking while we go to the next destination.',
        afterNote: 'The song can play. You cannot.',
      },
      {
        id: 'photo',
        label: 'A photo',
        hint: 'Right now',
        clue: 'Take a picture before we leave.',
        note: 'Something we can keep from tonight.',
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
    },
    {
      id: 'memory',
      wheelLabel: 'A familiar place',
      title: 'A familiar place',
      clue: 'Go back to where this started. "Was this a date or a hangout?"',
      note: "This one isn't random.",
      theme: 'memory',
      image: '/familiar-place.png',
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
