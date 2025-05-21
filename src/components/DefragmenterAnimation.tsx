"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface DefragmenterAnimationProps {
  isIndexing: boolean;
}

const GRID_SIZE = 10; // 10x10 grid

export function DefragmenterAnimation({ isIndexing }: DefragmenterAnimationProps) {
  const [grid, setGrid] = useState<number[][]>([]);

  useEffect(() => {
    // Initialize grid
    const initialGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0)); // 0 for empty, 1 for filled, 2 for processed
    setGrid(initialGrid);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isIndexing) {
      intervalId = setInterval(() => {
        setGrid((prevGrid) => {
          const newGrid = prevGrid.map(row => [...row]);
          // Randomly change some cells
          for (let i = 0; i < 5; i++) { // Change 5 cells per tick
            const r = Math.floor(Math.random() * GRID_SIZE);
            const c = Math.floor(Math.random() * GRID_SIZE);
            newGrid[r][c] = Math.floor(Math.random() * 3); // 0, 1, or 2
          }
          return newGrid;
        });
      }, 200);
    } else {
      // When not indexing, show a "completed" or "idle" state
      setGrid(prevGrid => prevGrid.map(row => row.map(() => 2))); // All processed
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isIndexing]);

  if (!grid.length) return null;

  return (
    <div className="p-2 border border-[hsl(var(--border))] bg-input aspect-square max-w-xs mx-auto my-4">
      <div className="grid grid-cols-10 gap-0.5">
        {grid.flat().map((cellState, index) => (
          <div
            key={index}
            className={cn(
              'w-full aspect-square border border-[hsl(var(--border-dark))]',
              {
                'bg-background': cellState === 0, // Empty
                'bg-primary': cellState === 1,   // Filled / Being processed
                'bg-accent': cellState === 2,    // Processed
              }
            )}
          />
        ))}
      </div>
      {isIndexing && <p className="text-center text-xs text-primary mt-2 animate-pulse">Defragmenting Codebase...</p>}
      {!isIndexing && grid.every(row => row.every(cell => cell === 2)) && <p className="text-center text-xs text-accent mt-2">Indexing Complete.</p>}
    </div>
  );
}
