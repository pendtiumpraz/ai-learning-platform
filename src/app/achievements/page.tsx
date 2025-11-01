import AchievementSystem from '@/components/gamification/AchievementSystem';

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-2">Achievements</h1>
          <p className="text-purple-100">Track your progress and unlock rewards</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AchievementSystem />
      </div>
    </div>
  );
}