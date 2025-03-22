import MinesGame from '@/components/MinesGame';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Mines Game</h1>
        <MinesGame />
      </div>
    </main>
  );
}