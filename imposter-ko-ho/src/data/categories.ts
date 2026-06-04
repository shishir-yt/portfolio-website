import type { Category } from '../types/game';

export const CATEGORIES: Category[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Simple everyday words',
    icon: '🎭',
    words: [
      { word: 'momo', hint: 'Common in casual plans' },
      { word: 'chiya', hint: 'Connected to habits or routine' },
      { word: 'kitab', hint: 'Something familiar but you might not talk about it daily' },
      { word: 'mobile', hint: 'People usually have strong opinions on usage' },
      { word: 'school', hint: 'Connected to a shared past experience' },
      { word: 'bus', hint: 'Related to getting somewhere' },
      { word: 'cinema', hint: 'Usually comes up when people are bored' },
      { word: 'doctor', hint: 'People usually need this but don\'t want it' },
      { word: 'bhat', hint: 'Connected to daily routine' },
      { word: 'ghar', hint: 'Something everyone relates to differently' }
    ]
  },
  {
    id: 'nepali-life',
    name: 'Nepali Life',
    description: 'Relatable Nepali context',
    icon: '🇳🇵',
    words: [
      { word: 'microbus', hint: 'Related to daily struggle for many' },
      { word: 'Dashain', hint: 'Comes with a lot of plans' },
      { word: 'tihar', hint: 'Usually connected to family and friends' },
      { word: 'chiya pasal', hint: 'Often comes up in group talks' },
      { word: 'chowk', hint: 'A familiar local reference' },
      { word: 'New Road', hint: 'Often associated with crowds and plans' },
      { word: 'Pathao', hint: 'Often used when people are in a hurry' },
      { word: 'mandir', hint: 'Connected to belief or regular habits' },
      { word: 'loksewa', hint: 'Something people stress about' },
      { word: 'hostel', hint: 'Brings back specific memories for some' }
    ]
  },
  {
    id: 'food',
    name: 'Food',
    description: 'Nepali and common food items',
    icon: '🥟',
    words: [
      { word: 'momo', hint: 'Common in casual plans' },
      { word: 'chowmein', hint: 'Often ordered when hanging out' },
      { word: 'dal bhat', hint: 'Something you can\'t escape' },
      { word: 'sel roti', hint: 'Connected to special days' },
      { word: 'chatpate', hint: 'Usually eaten in groups' },
      { word: 'sekuwa', hint: 'Often paired with evening plans' },
      { word: 'sukuti', hint: 'A common favorite in gatherings' },
      { word: 'pani puri', hint: 'People have strong opinions about this' },
      { word: 'wai wai', hint: 'A familiar quick fix' },
      { word: 'gundruk', hint: 'A classic everyone knows' }
    ]
  },
  {
    id: 'hard-mode',
    name: 'Hard Mode',
    description: 'Similar/confusing words',
    icon: '🔥',
    words: [
      { word: 'Pathao', hint: 'Related to moving around' },
      { word: 'InDrive', hint: 'Related to getting from A to B' },
      { word: 'momo', hint: 'Something familiar, but don\'t be too confident' },
      { word: 'chowmein', hint: 'A common choice, stay vague' },
      { word: 'gundruk', hint: 'A local staple, keep it broad' },
      { word: 'sinki', hint: 'Similar to something common, but specific' },
      { word: 'tuition', hint: 'Related to learning or pressure' },
      { word: 'coaching', hint: 'Connected to extra effort' },
      { word: 'chiya', hint: 'A very common habit' },
      { word: 'coffee', hint: 'A common habit but slightly different' }
    ]
  }
];
