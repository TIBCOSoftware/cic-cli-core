export async function progress(options?: any) {
  const cliProgress = await import('cli-progress');
  return new cliProgress.SingleBar(options || {});
}
