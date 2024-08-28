export function sleep(seconds: number) {
  return new Promise((r) => setTimeout(r, seconds * 1000));
}

export async function loadDefaultClassFromFile(filepath: string) {
  try {
    const module = await import(filepath);

    return module.default;
  } catch (error) {
    console.error('Error loading class from file:', error);
    throw error;
  }
}

export function getRandomInt(min: number, max: number): number {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);

  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}
