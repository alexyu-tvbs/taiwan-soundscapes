import type { SleepType, SleepQuestion, SleepTypeInfo, SleepOption, Prescription, JourneyStats } from '../types'

export const sleepQuestions: SleepQuestion[] = [
  {
    id: 'q1',
    question: '你通常需要多久才能入睡？',
    options: [
      { label: '不到 15 分鐘', value: 'q1-a', weight: { light: 1 } },
      { label: '15-30 分鐘', value: 'q1-b', weight: { difficulty: 1, anxious: 1 } },
      { label: '30-60 分鐘', value: 'q1-c', weight: { difficulty: 2, anxious: 1 } },
      { label: '超過 60 分鐘', value: 'q1-d', weight: { difficulty: 3 } },
    ],
  },
  {
    id: 'q2',
    question: '你半夜會醒來幾次？',
    options: [
      { label: '幾乎不會', value: 'q2-a', weight: { difficulty: 1 } },
      { label: '1-2 次', value: 'q2-b', weight: { light: 2 } },
      { label: '3 次以上', value: 'q2-c', weight: { light: 3 } },
    ],
  },
  {
    id: 'q3',
    question: '睡前你的腦袋通常在想什麼？',
    options: [
      { label: '很快放空', value: 'q3-a', weight: { light: 1 } },
      { label: '回想今天', value: 'q3-b', weight: { anxious: 1 } },
      { label: '擔心明天', value: 'q3-c', weight: { anxious: 2 } },
      { label: '各種想法停不下來', value: 'q3-d', weight: { anxious: 3 } },
    ],
  },
  {
    id: 'q4',
    question: '你早上醒來的感覺是？',
    options: [
      { label: '精神飽滿', value: 'q4-a', weight: { difficulty: 1 } },
      { label: '還好但想賴床', value: 'q4-b', weight: { light: 1 } },
      { label: '覺得沒睡夠', value: 'q4-c', weight: { light: 2, difficulty: 1 } },
      { label: '比睡前更累', value: 'q4-d', weight: { anxious: 2, light: 1 } },
    ],
  },
  {
    id: 'q5',
    question: '你覺得影響你睡眠最大的因素是？',
    options: [
      { label: '環境（光線噪音）', value: 'q5-a', weight: { light: 2 } },
      { label: '身體不適', value: 'q5-b', weight: { light: 2, difficulty: 1 } },
      { label: '心理壓力', value: 'q5-c', weight: { anxious: 3 } },
      { label: '不規律作息', value: 'q5-d', weight: { difficulty: 3 } },
    ],
  },
]

export const sleepTypeInfos: Record<SleepType, SleepTypeInfo> = {
  difficulty: {
    type: 'difficulty',
    name: '入睡困難型',
    description: '你的主要困擾是難以入睡。躺在床上翻來覆去，腦袋雖然疲倦，身體卻無法放鬆進入睡眠狀態。這可能與不規律的作息或睡前習慣有關。',
    approach: '建立固定的睡前儀式，搭配呼吸練習與自然聲景，幫助身心逐步進入放鬆模式。',
  },
  light: {
    type: 'light',
    name: '淺眠易醒型',
    description: '你雖然能入睡，但睡眠品質不深，容易被細微的聲響或身體不適喚醒。半夜醒來後往往難以再次入睡，導致白天精神不濟。',
    approach: '透過深層放鬆的聲景與腹式呼吸，訓練身體維持更穩定的睡眠週期。',
  },
  anxious: {
    type: 'anxious',
    name: '焦慮思緒型',
    description: '你的睡眠困擾主要來自心理層面。睡前腦中思緒不斷，擔心明天的事、回想今天的問題，讓大腦無法真正「關機」。',
    approach: '正念呼吸搭配沉浸式聲景，幫助你學會放下思緒，溫柔地引導注意力回到當下。',
  },
}

export const prescriptions: Record<SleepType, Prescription> = {
  difficulty: {
    sleepType: 'difficulty',
    planName: '入睡困難急救包',
    totalDays: 7,
    currentDay: 5,
    breathing: { name: '4-7-8 呼吸法', duration: '3 分鐘', expert: '江醫師引導' },
    soundscapeLocationId: 'tamsui',
    coachTip: '今天試著比昨天早 15 分鐘上床',
  },
  light: {
    sleepType: 'light',
    planName: '深層好眠計畫',
    totalDays: 10,
    currentDay: 3,
    breathing: { name: '腹式呼吸法', duration: '5 分鐘', expert: '林醫師引導' },
    soundscapeLocationId: 'alishan',
    coachTip: '睡前一小時調暗室內光線，幫助身體準備入睡',
  },
  anxious: {
    sleepType: 'anxious',
    planName: '安心入眠療程',
    totalDays: 14,
    currentDay: 7,
    breathing: { name: '正念呼吸法', duration: '4 分鐘', expert: '王心理師引導' },
    soundscapeLocationId: 'keelung',
    coachTip: '試著在睡前寫下三件今天感恩的事',
  },
}

export const journeyStats: JourneyStats = {
  completedSessions: 12,
  longestStreak: 5,
  unlockedSoundscapes: 3,
  reinforcementMessage: '你連續 3 天在 11 點前開始準備睡覺，這是很棒的習慣！',
}

export const hintLocations: Record<SleepType, string> = {
  difficulty: '台東稻浪',
  light: '日月潭晨曦',
  anxious: '蘭嶼飛魚季',
}

export const calculateSleepType = (answers: SleepOption[]): SleepType => {
  if (answers.length === 0) {
    return 'difficulty'
  }

  const scores = answers.reduce(
    (acc, answer) => {
      Object.entries(answer.weight).forEach(([type, w]) => {
        acc[type as SleepType] = (acc[type as SleepType] || 0) + (w || 0)
      })
      return acc
    },
    {} as Record<SleepType, number>
  )

  return Object.entries(scores).reduce(
    (best, [type, score]) =>
      score > (scores[best as SleepType] || 0) ? (type as SleepType) : (best as SleepType),
    'difficulty' as SleepType
  )
}
