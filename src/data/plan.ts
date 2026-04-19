export type Sport = 'swim' | 'bike' | 'run'
export type WorkoutType = 'interval' | 'easy' | 'endurance' | 'tempo' | 'time_trial'

export interface Workout {
  id: string
  day: string
  sport: Sport
  type: WorkoutType
  title: string
  description: string
  hasTransitionRun?: boolean
  transitionDesc?: string
}

export interface Week {
  number: number
  isRecovery: boolean
  workouts: Workout[]
}

function w(week: number, day: string, sport: Sport, type: WorkoutType, title: string, description: string, hasTransitionRun?: boolean, transitionDesc?: string): Workout {
  return { id: `w${week}-${day}-${sport}`, day, sport, type, title, description, hasTransitionRun, transitionDesc }
}

export const plan: Week[] = [
  {
    number: 1, isRecovery: false, workouts: [
      w(1, 'Tue', 'bike', 'interval', 'Interval Bike', '40 min w/ 6x20 sec sprints'),
      w(1, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 8x25m (1,000m total)'),
      w(1, 'Wed', 'run', 'easy', 'Easy Run', '5 miles'),
      w(1, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 4x100m (1,000m total)'),
      w(1, 'Thu', 'bike', 'easy', 'Easy Bike', '40 min'),
      w(1, 'Thu', 'run', 'interval', 'Interval Run', '40 min w/ 6x20 sec relaxed sprints'),
      w(1, 'Sat', 'bike', 'endurance', 'Endurance Bike', '25 miles'),
      w(1, 'Sat', 'run', 'endurance', 'Endurance Run', '6 miles'),
      w(1, 'Sun', 'swim', 'endurance', 'Endurance Swim', '1,000m'),
    ]
  },
  {
    number: 2, isRecovery: false, workouts: [
      w(2, 'Tue', 'bike', 'interval', 'Interval Bike', '40 min w/ 8x20 sec sprints'),
      w(2, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 10x25m (1,100m total)'),
      w(2, 'Wed', 'run', 'easy', 'Easy Run', '5 miles'),
      w(2, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 5x100m (1,100m total)'),
      w(2, 'Thu', 'bike', 'easy', 'Easy Bike', '45 min'),
      w(2, 'Thu', 'run', 'interval', 'Interval Run', '40 min w/ 8x20 sec relaxed sprints'),
      w(2, 'Sat', 'bike', 'endurance', 'Endurance Bike', '30 miles'),
      w(2, 'Sat', 'run', 'endurance', 'Endurance Run', '7 miles'),
      w(2, 'Sun', 'swim', 'endurance', 'Endurance Swim', '1,250m'),
    ]
  },
  {
    number: 3, isRecovery: false, workouts: [
      w(3, 'Tue', 'bike', 'interval', 'Interval Bike', '40 min w/ 10x20 sec sprints'),
      w(3, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 12x25m (1,200m total)'),
      w(3, 'Wed', 'run', 'easy', 'Easy Run', '5 miles'),
      w(3, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 6x100m (1,200m total)'),
      w(3, 'Thu', 'bike', 'easy', 'Easy Bike', '45 min'),
      w(3, 'Thu', 'run', 'interval', 'Interval Run', '45 min w/ 8x20 sec relaxed sprints'),
      w(3, 'Sat', 'bike', 'endurance', 'Endurance Bike', '35 miles'),
      w(3, 'Sat', 'run', 'endurance', 'Endurance Run', '8 miles'),
      w(3, 'Sun', 'swim', 'endurance', 'Endurance Swim', '1,500m'),
    ]
  },
  {
    number: 4, isRecovery: true, workouts: [
      w(4, 'Tue', 'bike', 'interval', 'Interval Bike', '40 min w/ 6x20 sec sprints'),
      w(4, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 10x25m (1,200m total)'),
      w(4, 'Wed', 'run', 'easy', 'Easy Run', '5 miles'),
      w(4, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 5x100m (1,200m total)'),
      w(4, 'Thu', 'bike', 'easy', 'Easy Bike', '45 min'),
      w(4, 'Thu', 'run', 'interval', 'Interval Run', '40 min w/ 6x20 sec relaxed sprints'),
      w(4, 'Sat', 'bike', 'endurance', 'Endurance Bike', '30 miles'),
      w(4, 'Sat', 'run', 'endurance', 'Endurance Run', '6 miles'),
      w(4, 'Sun', 'swim', 'endurance', 'Endurance Swim', '1,200m'),
    ]
  },
  {
    number: 5, isRecovery: false, workouts: [
      w(5, 'Tue', 'bike', 'tempo', 'Tempo Bike', '45 min w/ last 15 min comfortably hard'),
      w(5, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 10x50m (1,500m total)'),
      w(5, 'Wed', 'run', 'easy', 'Easy Run', '5.5 miles'),
      w(5, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 4x150m (1,500m total)'),
      w(5, 'Thu', 'bike', 'easy', 'Easy Bike', '45 min'),
      w(5, 'Thu', 'run', 'interval', 'Interval Run', '40 min w/ 6x1 min fast'),
      w(5, 'Sat', 'bike', 'endurance', 'Endurance Bike', '40 miles'),
      w(5, 'Sat', 'run', 'endurance', 'Endurance Run', '9 miles'),
      w(5, 'Sun', 'swim', 'endurance', 'Endurance Swim', '1,700m'),
    ]
  },
  {
    number: 6, isRecovery: false, workouts: [
      w(6, 'Tue', 'bike', 'interval', 'Interval Bike', '45 min w/ 8x1 min fast uphill'),
      w(6, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 8x50m, 8x25m (1,600m total)'),
      w(6, 'Wed', 'run', 'easy', 'Easy Run', '6 miles'),
      w(6, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 4x200m (1,600m total)'),
      w(6, 'Thu', 'bike', 'easy', 'Easy Bike', '45 min'),
      w(6, 'Thu', 'run', 'tempo', 'Tempo Run', '45 min w/ last 15 min comfortably hard'),
      w(6, 'Sat', 'bike', 'endurance', 'Endurance Bike', '45 miles'),
      w(6, 'Sat', 'run', 'endurance', 'Endurance Run', '10 miles'),
      w(6, 'Sun', 'swim', 'time_trial', 'Swim Time Trial', 'MS: 800m time trial (1,800m total)'),
    ]
  },
  {
    number: 7, isRecovery: false, workouts: [
      w(7, 'Tue', 'bike', 'tempo', 'Tempo Bike', '50 min w/ last 20 min comfortably hard'),
      w(7, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 12x50m (1,700m total)'),
      w(7, 'Wed', 'run', 'easy', 'Easy Run', '6 miles'),
      w(7, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 5x150m (1,700m total)'),
      w(7, 'Thu', 'bike', 'easy', 'Easy Bike', '50 min'),
      w(7, 'Thu', 'run', 'interval', 'Interval Run', '40 min w/ 10x1 min fast uphill'),
      w(7, 'Sat', 'bike', 'endurance', 'Endurance Bike + T-Run', '50 miles easy bike + 10-min easy run', true, '10-min easy run'),
      w(7, 'Sat', 'run', 'endurance', 'Endurance Run', '11 miles'),
      w(7, 'Sun', 'swim', 'endurance', 'Endurance Swim', '2,100m'),
    ]
  },
  {
    number: 8, isRecovery: true, workouts: [
      w(8, 'Tue', 'bike', 'interval', 'Interval Bike', '45 min w/ 6x90 sec fast'),
      w(8, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 16x50m (1,500m total)'),
      w(8, 'Wed', 'run', 'easy', 'Easy Run', '6 miles'),
      w(8, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 8x100m (1,500m total)'),
      w(8, 'Thu', 'bike', 'easy', 'Easy Bike', '45 min'),
      w(8, 'Thu', 'run', 'tempo', 'Tempo Run', '45 min w/ last 15 min comfortably hard'),
      w(8, 'Sat', 'bike', 'endurance', 'Endurance Bike', '40 miles'),
      w(8, 'Sat', 'run', 'endurance', 'Endurance Run', '8 miles'),
      w(8, 'Sun', 'swim', 'endurance', 'Endurance Swim', 'MS: 1,600m steady (1,800m total)'),
    ]
  },
  {
    number: 9, isRecovery: false, workouts: [
      w(9, 'Tue', 'bike', 'tempo', 'Tempo Bike + T-Run', '55 min bike w/ last 20 min comfortably hard + 10-min easy run', true, '10-min easy run'),
      w(9, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 8x75m (1,900m total)'),
      w(9, 'Wed', 'run', 'easy', 'Easy Run', '6 miles'),
      w(9, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 4x250m (1,900m total)'),
      w(9, 'Thu', 'bike', 'easy', 'Easy Bike', '50 min'),
      w(9, 'Thu', 'run', 'interval', 'Interval Run', '45 min w/ 8x2 min fast'),
      w(9, 'Sat', 'bike', 'endurance', 'Endurance Bike + T-Run', '55 miles easy bike + 10-min easy run', true, '10-min easy run'),
      w(9, 'Sat', 'run', 'endurance', 'Endurance Run', '12 miles'),
      w(9, 'Sun', 'swim', 'endurance', 'Endurance Swim', '2,400m'),
    ]
  },
  {
    number: 10, isRecovery: false, workouts: [
      w(10, 'Tue', 'bike', 'interval', 'Interval Bike + T-Run', '55 min bike w/ 8x2 min fast + 10-min easy run', true, '10-min easy run'),
      w(10, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 10x50m, 10x25m (2,100m total)'),
      w(10, 'Wed', 'run', 'easy', 'Easy Run', '6 miles'),
      w(10, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 6x150m (2,100m total)'),
      w(10, 'Thu', 'bike', 'easy', 'Easy Bike', '55 min'),
      w(10, 'Thu', 'run', 'tempo', 'Tempo Run', '50 min w/ last 20 min comfortably hard'),
      w(10, 'Sat', 'bike', 'endurance', 'Endurance Bike + T-Run', '60 miles easy bike + 15-min easy run', true, '15-min easy run'),
      w(10, 'Sat', 'run', 'endurance', 'Endurance Run', '10 miles'),
      w(10, 'Sun', 'swim', 'endurance', 'Endurance Swim', '2,700m'),
    ]
  },
  {
    number: 11, isRecovery: false, workouts: [
      w(11, 'Tue', 'bike', 'tempo', 'Tempo Bike + T-Run', '1 hr bike w/ last 20 min comfortably hard + 10-min easy run', true, '10-min easy run'),
      w(11, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 10x75m, 10x25m (2,300m total)'),
      w(11, 'Wed', 'run', 'easy', 'Easy Run', '6 miles'),
      w(11, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 5x200m (2,300m total)'),
      w(11, 'Thu', 'bike', 'easy', 'Easy Bike', '1 hr'),
      w(11, 'Thu', 'run', 'interval', 'Interval Run', '45 min w/ 8x2 min fast'),
      w(11, 'Sat', 'bike', 'endurance', 'Endurance Bike + T-Run', '65 miles easy bike + 10-min easy run', true, '10-min easy run'),
      w(11, 'Sat', 'run', 'endurance', 'Endurance Run', '13 miles'),
      w(11, 'Sun', 'swim', 'endurance', 'Endurance Swim', '3,000m'),
    ]
  },
  {
    number: 12, isRecovery: true, workouts: [
      w(12, 'Tue', 'bike', 'interval', 'Interval Bike + T-Run', '50 min bike w/ 8x1 min fast + 10-min easy run', true, '10-min easy run'),
      w(12, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 15x50m (1,800m total)'),
      w(12, 'Wed', 'run', 'easy', 'Easy Run', '6 miles'),
      w(12, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 12x100m (1,800m total)'),
      w(12, 'Thu', 'bike', 'easy', 'Easy Bike', '50 min'),
      w(12, 'Thu', 'run', 'tempo', 'Tempo Run', '40 min w/ last 12 min comfortably hard'),
      w(12, 'Sat', 'bike', 'endurance', 'Endurance Bike + T-Run', '50 miles easy bike + 15-min easy run', true, '15-min easy run'),
      w(12, 'Sat', 'run', 'endurance', 'Endurance Run', '10 miles'),
      w(12, 'Sun', 'swim', 'endurance', 'Endurance Swim', '2,400m'),
    ]
  },
  {
    number: 13, isRecovery: false, workouts: [
      w(13, 'Tue', 'bike', 'tempo', 'Tempo Bike + T-Run', '1 hr 10 min bike w/ last 20 min comfortably hard + 10-min easy run', true, '10-min easy run'),
      w(13, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 18x50m (2,500m total)'),
      w(13, 'Wed', 'run', 'easy', 'Easy Run', '6.5 miles'),
      w(13, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 4x300m (2,500m total)'),
      w(13, 'Thu', 'bike', 'easy', 'Easy Bike', '1 hr'),
      w(13, 'Thu', 'run', 'interval', 'Interval Run', '50 min w/ 10x2 min fast'),
      w(13, 'Sat', 'bike', 'endurance', 'Endurance Bike + T-Run', '70 miles easy bike + 10-min easy run', true, '10-min easy run'),
      w(13, 'Sat', 'run', 'endurance', 'Endurance Run', '14 miles'),
      w(13, 'Sun', 'swim', 'endurance', 'Endurance Swim', '3,000m'),
    ]
  },
  {
    number: 14, isRecovery: false, workouts: [
      w(14, 'Tue', 'bike', 'interval', 'Interval Bike + T-Run', '1 hr 10 min bike w/ 10x2 min hard + 10-min easy run', true, '10-min easy run'),
      w(14, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 8x100m, 8x25m (2,600m total)'),
      w(14, 'Wed', 'run', 'easy', 'Easy Run', '6.5 miles'),
      w(14, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 2x400m, 4x100m (2,600m total)'),
      w(14, 'Thu', 'bike', 'easy', 'Easy Bike', '1 hr 15 min'),
      w(14, 'Thu', 'run', 'tempo', 'Tempo Run', '1 hr w/ last 20 min comfortably hard'),
      w(14, 'Sat', 'bike', 'endurance', 'Endurance Bike + T-Run', '55 miles easy bike + 20-min easy run', true, '20-min easy run'),
      w(14, 'Sat', 'run', 'endurance', 'Endurance Run', '11 miles'),
      w(14, 'Sun', 'swim', 'endurance', 'Endurance Swim', '3,300m'),
    ]
  },
  {
    number: 15, isRecovery: false, workouts: [
      w(15, 'Tue', 'bike', 'tempo', 'Tempo Bike + T-Run', '1 hr 15 min bike w/ last 25 min comfortably hard + 10-min easy run', true, '10-min easy run'),
      w(15, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 6x75m, 6x50m (2,800m total)'),
      w(15, 'Wed', 'run', 'easy', 'Easy Run', '7 miles'),
      w(15, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 4x300m, 4x100m (2,800m total)'),
      w(15, 'Thu', 'bike', 'easy', 'Easy Bike', '1 hr 15 min'),
      w(15, 'Thu', 'run', 'interval', 'Interval Run', '55 min w/ 5x3 min fast'),
      w(15, 'Sat', 'bike', 'endurance', 'Endurance Bike + T-Run', '85 miles easy bike + 10-min easy run', true, '10-min easy run'),
      w(15, 'Sat', 'run', 'endurance', 'Endurance Run', '16 miles'),
      w(15, 'Sun', 'swim', 'endurance', 'Endurance Swim', '3,800m'),
    ]
  },
  {
    number: 16, isRecovery: true, workouts: [
      w(16, 'Tue', 'bike', 'interval', 'Interval Bike + T-Run', '1 hr bike w/ 10x2 min hard + 10-min easy run', true, '10-min easy run'),
      w(16, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 16x50m (2,300m total)'),
      w(16, 'Wed', 'run', 'easy', 'Easy Run', '6 miles'),
      w(16, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 2x400m, 4x100m (2,300m total)'),
      w(16, 'Thu', 'bike', 'easy', 'Easy Bike', '1 hr'),
      w(16, 'Thu', 'run', 'tempo', 'Tempo Run', '50 min w/ last 15 min comfortably hard'),
      w(16, 'Sat', 'bike', 'endurance', 'Endurance Bike + T-Run', '50 miles easy bike + 15-min easy run', true, '15-min easy run'),
      w(16, 'Sat', 'run', 'endurance', 'Endurance Run', '10 miles'),
      w(16, 'Sun', 'swim', 'time_trial', 'Swim Time Trial', 'MS: 1,650m as fast as possible (2,400m total)'),
    ]
  },
  {
    number: 17, isRecovery: false, workouts: [
      w(17, 'Tue', 'bike', 'tempo', 'Tempo Bike + T-Run', '1 hr 20 min bike w/ last 30 min comfortably hard + 10-min easy run', true, '10-min easy run'),
      w(17, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 10x100m, 10x50m (3,000m total)'),
      w(17, 'Wed', 'run', 'easy', 'Easy Run', '7 miles'),
      w(17, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 4x400m (3,000m total)'),
      w(17, 'Thu', 'bike', 'easy', 'Easy Bike', '1 hr 20 min'),
      w(17, 'Thu', 'run', 'interval', 'Interval Run', '1 hr w/ 3x5 min fast'),
      w(17, 'Sat', 'bike', 'endurance', 'Endurance Bike + T-Run', '100 miles easy bike + 10-min easy run', true, '10-min easy run'),
      w(17, 'Sat', 'run', 'endurance', 'Endurance Run', '18 miles'),
      w(17, 'Sun', 'swim', 'endurance', 'Endurance Swim', '4,000m'),
    ]
  },
  {
    number: 18, isRecovery: false, workouts: [
      w(18, 'Tue', 'bike', 'interval', 'Interval Bike + T-Run', '1 hr 20 min bike w/ 3x5 min hard + 10-min easy run', true, '10-min easy run'),
      w(18, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 8x75m, 8x50m, 8x25m (3,000m total)'),
      w(18, 'Wed', 'run', 'easy', 'Easy Run', '7 miles'),
      w(18, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 4x300m, 4x100m (3,000m total)'),
      w(18, 'Thu', 'bike', 'easy', 'Easy Bike', '1 hr 30 min'),
      w(18, 'Thu', 'run', 'tempo', 'Tempo Run', '1 hr w/ last 25 min comfortably hard'),
      w(18, 'Sat', 'bike', 'endurance', 'Endurance Bike + T-Run', '70 miles easy bike + 1-hour easy run', true, '1-hour easy run'),
      w(18, 'Sat', 'run', 'easy', 'Easy Run', '5 miles'),
      w(18, 'Sun', 'swim', 'endurance', 'Endurance Swim', '4,000m'),
    ]
  },
  {
    number: 19, isRecovery: false, workouts: [
      w(19, 'Tue', 'bike', 'tempo', 'Tempo Bike + T-Run', '1 hr bike w/ last 20 min comfortably hard + 10-min easy run', true, '10-min easy run'),
      w(19, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 10x100m, 10x50m (2,600m total)'),
      w(19, 'Wed', 'run', 'easy', 'Easy Run', '7 miles'),
      w(19, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 4x400m (2,600m total)'),
      w(19, 'Thu', 'bike', 'easy', 'Easy Bike', '1 hr'),
      w(19, 'Thu', 'run', 'interval', 'Interval Run', '45 min w/ 6x2 min fast'),
      w(19, 'Sat', 'bike', 'endurance', 'Endurance Bike + T-Run', '50 miles easy bike + 10-min easy run', true, '10-min easy run'),
      w(19, 'Sat', 'run', 'endurance', 'Endurance Run', '10 miles'),
      w(19, 'Sun', 'swim', 'endurance', 'Endurance Swim', '4,000m'),
    ]
  },
  {
    number: 20, isRecovery: false, workouts: [
      w(20, 'Tue', 'bike', 'interval', 'Interval Bike', '45 min w/ 6x1 min hard'),
      w(20, 'Tue', 'swim', 'interval', 'Interval Swim', 'MS: 10x50m (2,200m total)'),
      w(20, 'Wed', 'run', 'easy', 'Easy Run', '5 miles'),
      w(20, 'Wed', 'swim', 'interval', 'Interval Swim', 'MS: 4x300m (1,600m total)'),
      w(20, 'Thu', 'bike', 'easy', 'Easy Bike', '30 min'),
      w(20, 'Thu', 'run', 'easy', 'Easy Run', '30 min'),
      w(20, 'Sat', 'bike', 'easy', 'Easy Bike', '20 min'),
      w(20, 'Sun', 'run', 'endurance', 'IRONMAN!', 'RACE DAY!'),
    ]
  },
]
