export async function open(target: string, options?: any) {
  const open = await import('open');
  return await open(target, options);
}
