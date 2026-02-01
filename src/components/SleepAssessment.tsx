import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { sleepQuestions, sleepTypeInfos, calculateSleepType } from '../data/sleep'
import type { SleepType, SleepOption } from '../types'

interface SleepAssessmentProps {
  onComplete: (sleepType: SleepType) => void
}

export const SleepAssessment = ({ onComplete }: SleepAssessmentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<(SleepOption | null)[]>(
    Array(sleepQuestions.length).fill(null)
  )
  const [direction, setDirection] = useState(0)
  const [resultType, setResultType] = useState<SleepType | null>(null)

  const currentQuestion = sleepQuestions[currentQuestionIndex]

  const handleOptionSelect = (option: SleepOption) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = option
    setAnswers(newAnswers)

    if (currentQuestionIndex < sleepQuestions.length - 1) {
      setDirection(1)
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      const validAnswers = newAnswers.filter((a): a is SleepOption => a !== null)
      const type = calculateSleepType(validAnswers)
      setResultType(type)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1)
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  if (resultType) {
    const info = sleepTypeInfos[resultType]
    return (
      <div
        data-testid="sleep-assessment"
        className="min-h-screen bg-slate-900 text-white flex flex-col"
      >
        <div
          data-testid="sleep-result"
          className="flex-1 flex flex-col items-center justify-center px-8 text-center"
        >
          <h1 className="text-4xl font-bold text-amber-400 mb-6">{info.name}</h1>
          <p className="text-lg text-slate-300 mb-4 max-w-md leading-relaxed">
            {info.description}
          </p>
          <p className="text-base text-slate-400 mb-10 max-w-md leading-relaxed">
            {info.approach}
          </p>
          <button
            data-testid="start-plan-btn"
            onClick={() => onComplete(resultType)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-8 rounded-full text-lg transition-colors"
          >
            開始我的計畫
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      data-testid="sleep-assessment"
      className="min-h-screen bg-slate-900 text-white flex flex-col"
    >
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="text-slate-400 text-sm mb-8">
          {currentQuestionIndex + 1} / {sleepQuestions.length}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestionIndex}
            custom={direction}
            initial={direction !== 0 ? { x: direction > 0 ? 100 : -100, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-full max-w-md text-center"
          >
            <h2 className="text-2xl font-bold mb-8">{currentQuestion.question}</h2>
            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestionIndex]?.value === option.value
                return (
                  <button
                    key={option.value}
                    data-testid={`option-${idx}`}
                    onClick={() => handleOptionSelect(option)}
                    className={`py-3 px-6 rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-amber-500/20 border border-amber-400 text-amber-300'
                        : 'bg-slate-800 border border-slate-700 text-slate-200 hover:border-slate-500'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {currentQuestionIndex > 0 && (
          <button
            data-testid="back-btn"
            onClick={handleBack}
            className="mt-8 text-slate-400 hover:text-white transition-colors"
          >
            ← 上一題
          </button>
        )}
      </div>
    </div>
  )
}
