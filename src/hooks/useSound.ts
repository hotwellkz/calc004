import { useCallback, useRef } from 'react';

/**
 * Хук для воспроизведения звуков
 * @param src - путь к аудио-файлу
 * @param volume - громкость (0.0 - 1.0), по умолчанию 0.6
 * @returns функция play() для воспроизведения звука
 */
export function useSound(src: string, volume: number = 0.6) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Создаём аудио-элемент один раз при первом использовании
  if (!audioRef.current) {
    const audio = new Audio(src);
    audio.volume = volume;
    audioRef.current = audio;
  }

  const play = useCallback(() => {
    // Обёртка на случай ошибок и autoplay-ограничений
    // Звук воспроизводится только после взаимодействия пользователя
    audioRef.current
      ?.play()
      .catch(() => {
        // Молча игнорируем ошибки autoplay - это нормально для браузеров
        // Звук будет работать после первого взаимодействия пользователя
      });
  }, []);

  return play;
}

