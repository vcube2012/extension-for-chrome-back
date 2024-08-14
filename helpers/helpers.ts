export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_')
    .replace(/__+/g, '_')
    .toLowerCase();
}

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
